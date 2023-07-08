const Web3 = require('web3');
const abii = require('./build/contracts/indentify.json');

class web3_instance {
  constructor(uri) {
    this.uri = uri;
    this.web3_object = new Web3(new Web3.providers.HttpProvider(this.uri));
  }
}

class goerli_web3 extends web3_instance {
  constructor(uri) {
    super(uri);
  }
}

class contract {
  constructor(abi, contract_address, web3_instance) {
    this.web3_instance = web3_instance;
    this.contract_instance = new web3_instance.eth.Contract(
      abi,
      contract_address,
    );
  }
}

class Registration_service {
  constructor(contract_instance) {
    this.contract_instance = contract_instance;
  }
  async IsRegistered(Address) {
    return this.contract_instance
      .getPastEvents('CompanyRegistered', {
        fromBlock: 9291800,
        toBlock: 'latest',
      })
      .then(function (events) {
        //console.log(events);
        for (const event of events) {
          let data = event.returnValues;

          //console.log(data);
          if (data.ethAddress === Address) {
            return true;
          } else {
            return false;
          }
        }
      });
  }
  //returns a promise
}

class Account_service {
  constructor(web3_instance) {
    this.web3_instance = web3_instance;
  }
  create_account() {
    return this.web3_instance.eth.accounts.create();
  }
}

class indentify_contract extends contract {
  constructor(abi, contract_address, web3_instance) {
    super(abi, contract_address, web3_instance);
  }

  send = async (ipfs_uri, Company_account_obj) => {
    const _from = Company_account_obj.address;
    const privatekey = Company_account_obj.privateKey;
    const tx = {
      from: _from,
      to: abii.networks[5].address,
      gasPrice: this.web3_instance.utils.toWei('10', 'gwei'), // Adjust the gas price here
      gas: 600000,
      data: this.contract_instance.methods
        .registerCompany(ipfs_uri, Company_account_obj.is_registered)
        .encodeABI(),
    };
    const signature = await this.web3_instance.eth.accounts.signTransaction(
      tx,
      privatekey,
    );
    console.log('transaction being sent wait');
    this.web3_instance.eth
      .sendSignedTransaction(signature.rawTransaction)
      .on('receipt', (receipt) => {
        if (receipt.status) {
          console.log('Transaction successful');
          //console.log(receipt);
          return receipt;
        } else {
          console.log('Transaction failed');
          console.log('Error message:', receipt.message);
          // Transaction failed, handle the error message
        }
      })
      .on('error', function (error) {
        console.error('Error occurred during transaction:', error);
        // Handle other errors during the transaction
      });
  };

  async get_uri_from_address(Address) {
    return this.contract_instance.methods.getCompany(Address).call();
    //returns a promise
  }
}

const contract_event_registered_service = new Registration_service(
  indentify_contract_instance.contract_instance,
);

const goerli_account_service = new Account_service(
  goerli_web3_instance.web3_object,
);

const indentify_contract_instance = new indentify_contract(
  abii.abi,
  abii.networks[5].address,
  goerli_web3_instance.web3_object,
);

module.exports = {
  contract_event_registered_service,
  goerli_account_service,
  indentify_contract_instance,
};

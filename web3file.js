const Web3 = require('web3');
const abii = require('./build/contracts/indentify.json')



function initializeWeb3AndContract() {
    const providerUrl = "https://eth-goerli.g.alchemy.com/v2/o8-xz0_My6osxn4HGVyxdtNdKMKggcn_";
    const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
  
    const myContractAddress = abii.networks[5].address;
    const myContract = new web3.eth.Contract(abii.abi, myContractAddress);
  
    return { web3, myContract };
}
    

function account_create_ifnot(has_account) {
    const { web3, myContract } = initializeWeb3AndContract();
	if (!has_account) {
		const account = web3.eth.accounts.create();
		address = account.address;
		private_key = account.privateKey;
		return {address , private_key};
		// log it somewhere may be to a local database 
		// and make the has account to be true 
	}
}


// checking if the company for an address already exists 
async function IsRegistered(Address){
const { web3, myContract } = initializeWeb3AndContract();
myContract.getPastEvents("CompanyRegistered",{fromBlock: 9291800, toBlock: "latest" }).then(function(events){
    for(const event of events){
        let data = event.returnValues;

        console.log(data);
        if(data.ethAddress === Address){
            return true;
        }else{
            return false;
        }
    }
})
}


// here is a code to send transaction for registering the company
const send = async(ipfs_uri, isregistered, private_keyy,Addresss) =>{
    const { web3, myContract } = initializeWeb3AndContract();
    const _from = Addresss;
    const privatekey = private_keyy;
    const tx = {
        from : _from,
        to : abii.networks[5].address,
        gas : 600000,
        data : myContract.methods.registerCompany(ipfs_uri,isregistered).encodeABI()
    }
    const signature = await web3.eth.accounts.signTransaction(tx,privatekey);
    console.log("transaction being sent wait");
    web3.eth.sendSignedTransaction(signature.rawTransaction).on("receipt",(receipt)=>{
        console.log(receipt);
        // add a successfully created to FE
    }).on("error", function(error) {
        // Do something to alert the user their transaction has failed
      });
}


async function get_uri_from_address(Address) {
	const {
		web3,
		myContract
	} = initializeWeb3AndContract();
	myContract.methods.getCompany(Address).call().then(result => {
		console.log(result)
	})
}



async function main(){
    var has_account = false ; // ask the user if it us true or false then update this parameter by default it is false
    var isregistered = false;
    
    const {Address , Private_key} = account_create_ifnot(has_account);
    isregistered = await IsRegistered(address);

    console.log("company registered : " , isregistered);
    console.log("has account : ", has_account);
    console.log("Account address : ", address);
    console.log("Account Private Key : ", private_key);

    const receipt = await send("fake uri",isregistered,Private_key,Address);
    const getURI = await get_uri_from_address(address);

}

main();
const Web3 = require('web3');
const abii = require('./build/contracts/indentify.json')

const address; 
const private_key;
const providerUrl = "https://eth-goerli.g.alchemy.com/v2/o8-xz0_My6osxn4HGVyxdtNdKMKggcn_";
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
// contract address deploy garesi matra pauxa
myContractAddress = abii.networks[5].address;
var myContract = new web3.eth.Contract(abii.abi, myContractAddress);


var isregistered = false;
// ask to user 
var has_account = true ;

if(!has_account){
    const account = web3.eth.accounts.create();
    address = account.address;
    private_key = account.privateKey;
    console.log('New Account Created:');
    console.log('Address:', account.address);
    console.log('Private Key:', account.privateKey);
    // log it somewhere may be to a local database 
    // and make the has account to be true 
}


myContract.getPastEvents("CompanyRegistered",{fromBlock: 9291800, toBlock: "latest" }).then(function(events){
    for(const event of events){
        let data = event.returnValues;
        if(data.ethAddress === "0x1A27464A985D1495088B642eEa1833e94171c3C3"){
            isregistered = true;
            console.log("yes this is registered")
        }else{
            console.log("no this is not registered")
        }
    }
})


const send = async(ipfs_uri, isregistered ) =>{
    const _from = address;
    const privatekey = private_key;
    const tx = {
        from : _from,
        to : myContractAddress,
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

//send("hellothisisafakeipfs", false);

myContract.methods.getCompany("0x1A27464A985D1495088B542eEa1833e94171c3C3").call().then(result=>{
    console.log(result)
})

// console.log(abii.abi);



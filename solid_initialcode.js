// first company logs on to our app 
// it asks for address and a private key (which is like username and password)

require('dotenv').config()
const Web3 = require('web3');
const abii = require('./build/contracts/indentify.json')
const axios = require("axios");
const md5 = require("md5");
const { Web3Storage, getFilesFromPath, File } = require('web3.storage');
 

class Company {
	constructor(name, location, contactInformation, industrySector, dateOfEstablishment, ownership, description, GLN_number) {
		this.name = name;
		this.location = location;
		this.contactInformation = contactInformation;
		this.industrySector = industrySector;
		this.dateOfEstablishment = dateOfEstablishment;
		this.ownership = ownership;
		this.description = description;
		this.GLN_number = 0;
		this.generate_gln(this.location, process.env.api_key_for_geocoding);
	}

	generate_gln(loc, api_key) {
		axios.get(process.env.geocoding_api_url, {
			params: {
				location: loc,
				key: api_key
			}
		}).then((res) => {
			var data = res.data.results[0].locations;
			latitude = data[0].latLng.lat.toString();
			longitude = (data[0].latLng.lng).toString();
			plane_tes = name_of_company + latitude + longitude;
			GLN = md5(plane_tes).substring(0, 10).toUpperCase();
			this.GLN_number = GLN;
		}).catch((err) => {
			console.log(err)
			// handle error here
		});
	}


}



// initialized our contract object mycontract so that we can interact with our indentify smart contract and initialize our web3.storage endpoint
function initializeWeb3AndContract() {
    const providerUrl = process.env.goerli_testnet_endpoint;
    const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
  
    const myContractAddress = abii.networks[5].address;
    const myContract = new web3.eth.Contract(abii.abi, myContractAddress);
  
    return { web3, myContract };
}
    

function makeStorageClient () {
    return new Web3Storage({ token: process.env.web3storage_token })
}


function makeFileObjects (comp) {
    const obj = comp // here we pass the object of company 
    const buffer = Buffer.from(JSON.stringify(obj))
  
    const files = [
      new File([buffer], `${comp.name}.json`)
    ]
    return files
}

async function storeFiles (files) {
    const client = makeStorageClient()
    const cid = await client.put(files)
    console.log('stored files with cid:', cid)
    return cid
}



// now retrive the fiels using the cid 
async function retrieveFiles(cid) {
	const client = makeStorageClient()
	const res = await client.get(cid)
	if (!res.ok) {
		throw new Error(`failed to get ${cid} - [${res.status}] ${res.statusText}`)
	}
	const files = await res.files()
	for (const file of files) {
		const url = `http://${file.cid}.ipfs.w3s.link`;
		axios.get(url)
			.then(response => {
				return response.data
				// get the stored json data if necessary 
			})
			.catch(error => {
				console.error('Error:', error);
				// Handle any errors that occurred during the request
			});
	}
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
function IsRegistered(Address){
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
    
    const {address , private_key} = account_create_ifnot(has_account);
    isregistered = IsRegistered(address);

    console.log("company registered : " , isregistered);
    console.log("has account : ", has_account);
    console.log("Account address : ", address);
    console.log("Account Private Key : ", private_key);


    const comp1 = new Company("huzaf", "bharatpur, chitwan", 727636627, {
	    email: "hello@gmail",
	    phone: 9287772663,
	    tele: 01543672
    }, "Coorporate", "2061 BS", "private", "fake company just for test purpose");


    const Company_data_file_object = makeFileObjects(comp1);

    const CID = await storeFiles(Company_data_file_object);

    console.log("ipfs_uri of our file : ", CID);

    const metadata_retrival = retrieveFiles(CID);

    console.log("Retrived data from ipfs : ", metadata_retrival);

    const receipt = await send(CID,isregistered,private_key,address);

   // console.log("receipt for sending transaction of company register ", receipt);

    const getURI = await get_uri_from_address(address);

    console.log("URI retrival from smart contract : ", getURI);

    // we can use these info in front end 

}

main();
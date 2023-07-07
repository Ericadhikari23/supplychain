const { Web3Storage, getFilesFromPath, File } = require('web3.storage');
const axios = require('axios');


class Company {
  constructor(name, location, contactInformation, industrySector, dateOfEstablishment, ownership, description) {
    this.name = name;
    this.location = location;
    this.contactInformation = contactInformation;
    this.industrySector = industrySector;
    this.dateOfEstablishment = dateOfEstablishment;
    this.ownership = ownership;
    this.description = description;
  }
}
function getAccessToken(){
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDk3MzA3OTdDQTYxZjJmZTYyMjNhMTA1MTc0MDhBNDBFQmRBNjhhNGEiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODgzODU2NTYxMDksIm5hbWUiOiJTdXBwbHljaGFpbiJ9.GPDByGYycZ6S7SRvVpez2pbW7ImEnVSKSgy7uH_-OPw";
}

function makeStorageClient () {
    return new Web3Storage({ token: getAccessToken() })
}

function makeFileObjects (name) {
    const obj = name // here we pass the object of company 
    const buffer = Buffer.from(JSON.stringify(obj))
  
    const files = [
      new File([buffer], `${name.name}.json`)
    ]
    return files
}

async function storeFiles (files) {
    const client = makeStorageClient()
    const cid = await client.put(files)
    //console.log('stored files with cid:', cid)
    return cid
}


async function retrieveFiles (cid) {
    const client = makeStorageClient()
    const res = await client.get(cid)
    //console.log(`Got a response! [${res.status}] ${res.statusText}`)
    if (!res.ok) {
      throw new Error(`failed to get ${cid} - [${res.status}] ${res.statusText}`)
    }
    // unpack File objects from the response
    const files = await res.files()
    for (const file of files) {
        //arr.push([file.cid,file.name,file.size])
        const url = `http://${file.cid}.ipfs.w3s.link`;


        axios.get(url)
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error:', error);
    // Handle any errors that occurred during the request
  });
    }
  }

async function main(){
  const comp1 = new Company("huzaf","bharatpur, chitwan",727636627,{
    email : "hello@gmail",
    phone : 9287772663,
    tele : 01543672
  }, "Coorporate", "2061 BS", "private", "fake company just for test purpose");
  const file_object = makeFileObjects(comp1);

  const CID = await storeFiles(file_object);

  retrieveFiles(CID);

}





main();

















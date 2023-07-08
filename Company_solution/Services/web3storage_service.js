const { Web3Storage, File } = require('web3.storage');
const axios = require('axios');
const Company = require('./company');

class decentralized_storage {
  constructor(storage_service) {
    this.storage_service = storage_service;
  }
  async storeFiles(file) {
    return this.storage_service.storeFiles(file);
  }

  async retrieveFiles(cid) {
    return this.storage_service.retrieveFiles(cid);
  }
}

class decentralized_storage_service {
  async storeFiles() {
    throw new Error('Method not implemented');
  }

  async retrieveFiles() {
    throw new Error('method not implemented');
  }
}

class web3_storage extends decentralized_storage_service {
  constructor(access_token) {
    super();
    this.access_token = access_token;
    this.storage_client = new Web3Storage({ token: this.access_token });
  }

  make_file_object(_object) {
    const buffer = Buffer.from(JSON.stringify(_object));
    const files = [new File([buffer], `${_object.name}.json`)];
    return files;
  }

  async storeFiles(_object) {
    const files = this.make_file_object(_object);
    const cid = await this.storage_client.put(files);
    return cid;
  }

  async retrieveFiles(cid) {
    const res = await this.storage_client.get(cid);
    if (!res.ok) {
      throw new Error(
        `failed to get ${cid} - [${res.status}] ${res.statusText}`,
      );
    }
    const files = await res.files();
    for (const file of files) {
      const url = `http://${file.cid}.ipfs.w3s.link`; // we can get file name from file.name
      return axios.get(url);
    }
  }
}

function getAccessToken() {
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDk3MzA3OTdDQTYxZjJmZTYyMjNhMTA1MTc0MDhBNDBFQmRBNjhhNGEiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODgzODU2NTYxMDksIm5hbWUiOiJTdXBwbHljaGFpbiJ9.GPDByGYycZ6S7SRvVpez2pbW7ImEnVSKSgy7uH_-OPw';
}

const web3storage_service = new decentralized_storage(
  new web3_storage(getAccessToken()),
);

module.exports = web3storage_service;

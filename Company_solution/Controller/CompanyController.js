const company_obj = require('../Repository/company_repository');
const company_acc_obj = require('../Repository/company_account_repository');
const storage = require('../Services/web3storage_service');
const {
  contract_event_registered_service,
  goerli_account_service,
  indentify_contract_instance,
} = require('../Services/web3_service');

function main() {
  const mycompany = company_obj.create_company();
  const mycompany_accounts = company_acc_obj.create_company_account();
  const cid = storage.storeFiles(mycompany);
  indentify_contract_instance.send(cid, mycompany_accounts);
}

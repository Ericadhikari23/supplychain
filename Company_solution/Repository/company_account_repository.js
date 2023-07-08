const { Company, Company_account } = require('../Model/Company');

const {
  contract_event_registered_service,
  goerli_account_service,
  indentify_contract,
} = require('../Services/web3_service');
const company_repository_object = require('./company_repository');

class company_acc_repository {
  constructor(Account_service, Registration_service, Company_account) {
    this.Account_service = Account_service;
    this.Registration_service = Registration_service;
    this.Company_account = Company_account;
  }
  async create_company_account(
    has_account,
    isregistered,
    address,
    privateKey,
    Account_service,
  ) {
    const comp_acc = new this.Company_account(
      has_account,
      isregistered,
      address,
      privateKey,
      Account_service,
    );
    comp_acc.account_init();
    _is_registered = await contract_event_registered_service.IsRegistered(
      company1.address,
    );
    comp_acc.is_registered = _is_registered;
    return comp_acc;
  }
}

const company_acc_repository_object = new company_acc_repository(
  goerli_account_service,
  contract_event_registered_service,
  Company_account,
);

module.exports = company_acc_repository_object;

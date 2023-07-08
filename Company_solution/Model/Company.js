class Company {
  constructor(
    name,
    location,
    contactInformation,
    industrySector,
    dateOfEstablishment,
    ownership,
    description,
  ) {
    this.name = name;
    this.location = location;
    this.contactInformation = contactInformation;
    this.industrySector = industrySector;
    this.dateOfEstablishment = dateOfEstablishment;
    this.ownership = ownership;
    this.description = description;
  }
}

class Company_account {
  constructor(has_account, isregistered, address, privateKey, Account_service) {
    this.has_account = has_account;
    this.is_registered = isregistered;
    this.address = address;
    this.privateKey = privateKey;
    this.Account_service = Account_service;
  }

  account_init() {
    if (!this.has_account) {
      const account = this.Account_service.create_account();
      this.address = account.address;
      this.privateKey = account.privateKey;
      this.has_account = true;
    }
  }
}

module.exports = { Company, Company_account };

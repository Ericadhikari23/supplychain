const { Company, Company_account } = require('../Model/Company');
const mapquest = require('../Services/Geocoding_service');

class CompanyRepository {
  constructor(Company, mapquestGeocoder) {
    this.Company_data = Company;
    this.geocoding_service = mapquestGeocoder;
  }

  async create_company(
    name,
    location,
    contactInformation,
    industrySector,
    dateOfEstablishment,
    ownership,
    description,
  ) {
    const comp = new this.Company_data(
      name,
      location,
      contactInformation,
      industrySector,
      dateOfEstablishment,
      ownership,
      description,
    );
    const gln_number = await this.geocoding_service.generateGLN(
      comp.name,
      comp.location,
    );

    comp.gln_number = gln_number;
    return comp;
  }
}

const company_repository_object = new CompanyRepository(Company, mapquest);

module.exports = company_repository_object;

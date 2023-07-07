

const axios = require("axios");
const md5 = require("md5");



class Company {
    constructor(name, location, contactInformation, industrySector, dateOfEstablishment, ownership, description) {
      this.name = name;
      this.location = location;
      this.contactInformation = contactInformation;
      this.industrySector = industrySector;
      this.dateOfEstablishment = dateOfEstablishment;
      this.ownership = ownership;
      this.description = description;
      this.GLN_number = '';
    }
  
    async init() {
      try {
        const apiKey = "5eOqwuPNkQFRTVj7h6Bu3tTcRMDq7sbG";
        const url = 'https://www.mapquestapi.com/geocoding/v1/address';
  
        const response = await axios.get(url, {
          params: {
            location: this.location,
            key: apiKey,
          },
        });
  
        const data = response.data.results[0].locations;
        const latitude = data[0].latLng.lat.toString();
        const longitude = data[0].latLng.lng.toString();
        const planeTest = this.name + latitude + longitude;
        const GLN = md5(planeTest).substring(0, 10).toUpperCase();
  
        this.GLN_number = GLN;
      } catch (error) {
        console.log(error);
        // Handle error here
      }
    }
  }
  
  async function createCompany() {
    const company = new Company(
      "huzaf",
      "bharatpur, chitwan",
      { email: 'hello@gmail', phone: 9287772663, tele: 1543672 },
      'Coorporate',
      '2061 BS',
      'private',
      'fake company just for test purpose'
    );
  
    await company.init();
  
    console.log(company);
  }
  
createCompany();
  
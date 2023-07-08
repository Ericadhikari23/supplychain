const axios = require('axios');
const md5 = require('md5');

class Geocoder {
  constructor(geocodingService) {
    this.geocodingService = geocodingService;
  }

  async generateGLN(name, location) {
    return this.geocodingService.generateGLN(name, location);
  }
}

// abstract class
class GeocodingService {
  async generateGLN(name, location) {
    throw new Error('Method not implemented');
  }
}

class Map_quest_geocoder extends GeocodingService {
  constructor(api_key) {
    super();
    this.api = api_key;
  }

  async generateGLN(name, location) {
    try {
      const response = await axios.get(
        'https://www.mapquestapi.com/geocoding/v1/address',
        {
          params: {
            location: location,
            key: this.api,
          },
        },
      );
      const data = response.data.results[0].locations;
      const latitude = data[0].latLng.lat.toString();
      const longitude = data[0].latLng.lng.toString();
      const planeTest = name + latitude + longitude;
      const GLN = md5(planeTest).substring(0, 10).toUpperCase();

      return GLN;
    } catch (error) {
      console.log(
        `${error.response.status} status ${error.response.statusText} ${error.data}`,
      );
      // Handle error here or throw an exception
    }
  }
}

const Map_quest_geocoder_object = new Geocoder(
  new Map_quest_geocoder('EEcDXClNXPYAw8Ou7thJ8ayfXsbrD4W6'),
);

module.exports = Map_quest_geocoder_object;

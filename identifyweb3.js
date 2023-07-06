// create gln number from longitude of district and name of company generate random number for company g trade number and create sscc using a specific format all will be a 10 digit code 
// creata a es6 class for object of a company create an ipfs uri and pass the object to ipfs uri 
// create a function to sign and send the transactions


const axios = require("axios");
const md5 = require("md5");
var api_key = "RemcwVXjwkr9Q5O5p7mO8dDZ9XNcnj6u";

var loc = "chitwan"; // get location 

var name_of_company = "something"; // get name 

function geocode(){
    axios.get(`https://www.mapquestapi.com/geocoding/v1/address`,{
        params:{
            location: loc,
            key: api_key 
        }
    }).then((res)=>{
        var data = res.data.results[0].locations;
        latitude = data[0].latLng.lat.toString();
        longitude = (data[0].latLng.lng).toString();
        plane_tes = name_of_company+latitude+longitude;
        GLN = md5(plane_tes).substring(0,10).toUpperCase();
        console.log(GLN);
        // gln
    }).catch((err)=>{
        console.log(err)
        // handle error here
    });
}














geocode();




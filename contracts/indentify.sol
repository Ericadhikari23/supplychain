// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract indentify {
    struct Company {
        address ethAddress;
        string ipfsURI;
    }

    mapping(address => Company) public companies;

    event CompanyRegistered(address indexed ethAddress, string ipfsURI);

    function registerCompany( string memory _ipfsURI,bool isregistered) public {
        require(!isregistered, "Company already registered");
        
        companies[msg.sender] = Company({
            ethAddress: msg.sender,
            ipfsURI: _ipfsURI
        });

        emit CompanyRegistered(msg.sender, _ipfsURI);
    }

    function getCompany(address _ethAddress) public view returns ( string memory) {
        return (companies[_ethAddress].ipfsURI);
    }
}


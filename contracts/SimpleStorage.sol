// I'm a comment!
// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

// pragma solidity ^0.8.0;
// pragma solidity >=0.8.0 <0.9.0;

contract SimpleStorage {
  uint256 favoriteNumber;

  struct People {
    uint256 favoriteNumber;
    string name;
  }

  // uint256[] public anArray;
  People[] public people;

  mapping(string => uint256) public nameToFavoriteNumber;

  function store(uint256 _favoriteNumber) public {
    // need to add validation
    favoriteNumber = _favoriteNumber;
  }

  function retrieve() public view returns (uint256) {
    return favoriteNumber;
  }

  function addPerson(string memory _name, uint256 _favoriteNumber) public {
    // need to add validation
    people.push(People(_favoriteNumber, _name));
    nameToFavoriteNumber[_name] = _favoriteNumber;
  }

  function getNewPerson() public view returns (People memory) {
    if(people.length > 0){
      uint256 lastIndex = people.length - 1;
      return people[lastIndex];
    } else {
      return People(0,"");
    }
  }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//forge install OpenZeppelin/openzeppelin-contracts --no-commit pour initialiser OpenZippelin
//address(this) toujours l'adresse du contrat qui l'utilise 
//cast send 0xBD13df8d4C26392099606288618e68E1c123d4DA "declareAnimal(uint256,uint256,bool,string)" 1 4 true "Poulet" --rpc-url $HOLESKY_RPC --private-key $privateKey
//source .env
//forge script script/DeployERC721.s.sol:DeployMyERC721 --rpc-url $HOLESKY_RPC --broadcast --private-key $privateKey

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyERC721 is ERC721 {

    mapping(address => bool) breeder;
    mapping(uint256 => Animal) mapanimal ;
    mapping(address => mapping(uint256  => uint256)) ownedTokens;
    mapping(uint256 => uint256) attribute_price;
    mapping(uint256 => uint256) attribute_priceOfReproduction;
    mapping (address => mapping(uint256 => bool)) breederReproduction;
    uint256 nextTokenId = 0;
    uint256 index;

    struct Animal {
        string name; 
        bool wings;  
        uint256 legs; 
        uint256 sex;
        uint256 parent1;
        uint256 parent2;
    }


    constructor() ERC721("Kyllian721", "K721") {
        //nextTokenId += 1;
        //_mint(msg.sender, nextTokenId);
    }

    function getAnimalCharacteristics(uint animalNumber) external returns (string memory _name, bool _wings, uint _legs, uint _sex){
        return(mapanimal[animalNumber].name,mapanimal[animalNumber].wings,mapanimal[animalNumber].legs,mapanimal[animalNumber].sex);
    }

    function registrationPrice() external returns (uint256){
        return 10;
    }

	function registerMeAsBreeder() external payable{
        breeder[msg.sender]=true;
    }

    function isBreeder(address account) external returns (bool){
        return breeder[account];
    }

    function declareAnimal(uint sex, uint legs, bool wings, string calldata name) external returns (uint256){
        nextTokenId += 1;
        index = balanceOf(msg.sender);
        mapanimal[nextTokenId] = Animal(name, wings, legs, sex,0,0);
        ownedTokens[msg.sender][index] = nextTokenId;
        _mint(msg.sender, nextTokenId);
        return nextTokenId;
    }

    function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256){
        return ownedTokens[owner][index];
    }

	function declareDeadAnimal(uint animalNumber) external  {
        require(ownerOf(animalNumber) == msg.sender, "You are not the owner of this animal");
        mapanimal[animalNumber] = Animal("", false,0,0,0,0);
        _burn(animalNumber);
    }

    function isAnimalForSale(uint animalNumber) external view returns (bool){
        if (attribute_price[animalNumber] != 0)
        {
            return true;
        } else{
            return false;
        }
    }

	function animalPrice(uint animalNumber) external view returns (uint256){
        return attribute_price[animalNumber];
    }

    function buyAnimal(uint animalNumber) external payable{
        // Identify the current owner of the animal
        address currentOwner = ownerOf(animalNumber);
        require(currentOwner != msg.sender, "You already own this animal");

        // Transfer ETH to the current owner
        payable(currentOwner).transfer(attribute_price[animalNumber]);

        // Transfer the token to the new buyer
        _transfer(currentOwner, msg.sender, animalNumber);

        // Reset the price of the animal
        attribute_price[animalNumber] = 0;
    }


	function offerForSale(uint animalNumber, uint price) external{
        attribute_price[animalNumber] = price;
    }


    function declareAnimalWithParents(uint sex, uint legs, bool wings, string calldata name, uint parent1, uint parent2) external returns (uint256){
        nextTokenId += 1;
        index = balanceOf(msg.sender);
        mapanimal[nextTokenId] = Animal(name, wings, legs, sex, parent1, parent2);
        ownedTokens[msg.sender][index] = nextTokenId;
        _mint(msg.sender, nextTokenId);
        return nextTokenId;
    }

	function getParents(uint animalNumber) external returns (uint256, uint256){
        return(mapanimal[animalNumber].parent1,mapanimal[animalNumber].parent2);
    }

    function canReproduce(uint animalNumber) external returns (bool){
        if (attribute_priceOfReproduction[animalNumber]!=0)
        {
            return true;
        } else{
            return false;
        }
    }

	function reproductionPrice(uint animalNumber) external view returns (uint256){
        return attribute_priceOfReproduction[animalNumber];
    }

	function offerForReproduction(uint animalNumber, uint priceOfReproduction) external returns (uint256) {
        require(ownerOf(animalNumber) == msg.sender, "You are not the owner of this animal");
        attribute_priceOfReproduction[animalNumber] = priceOfReproduction;
        return priceOfReproduction;
    }

    function authorizedBreederToReproduce(uint animalNumber) external returns (address){
        if (breederReproduction[msg.sender][animalNumber] == true){
            return msg.sender;
        } else{
            return address(0);
        }
    }

	function payForReproduction(uint animalNumber) external payable{
        require(msg.value > 0);
        breederReproduction[msg.sender][animalNumber] = true;      
    }
}
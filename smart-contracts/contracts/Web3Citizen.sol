// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "hardhat/console.sol";

// Deployed to 0x652a6302420D94F707b7Ad9Ae6eFc9E849805605
contract Web3Citizen is ERC721URIStorage {

    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint private nonce;

    // tokenId -> ammount of votes
    mapping(uint256 => uint256) public tokenIdToVoteCount;
    // we only allow 1 NFT per address, this helps us track
    mapping(address => uint256) public addressToTokenId;

    //collection of all Ballots every created. This helps enforce security between contracts
    //now this really should be an array and not a mapping, but i think
    //searching mappings uses way less gas than arrays, so we hack a bit
    mapping(address => uint256) public ballotAddresses;

    // @gonza so we here are storing the proposals addresses

    constructor() ERC721("Web3Citizen", "W3ID") {

    }

    /**
     * @dev Adds the address of the newly created Ballot
     * Ideally we'd verify that msg.sender actually is a Ballot contract, but that's probably beyond the scope of this
     */
    function addBallotToCollection() public {
        ballotAddresses[msg.sender] = 1;
    }

    /**
     * @dev Generates the citizen id, where the number of color blobs is equal to the number of times said NFT has voted
     */
    function generateCitizenId(uint256 tokenID) public returns(string memory){
        uint256 voteCount = tokenIdToVoteCount[tokenID];
     
        // everyone gets this first part
        bytes memory svg = abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev/svgjs" viewBox="0 0 800 800">',
            '  <defs>',
            '    <filter id="bbblurry-filter" x="-100%" y="-100%" width="400%" height="400%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">',
            '      <feGaussianBlur stdDeviation="40" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" edgeMode="none" result="blur"/>',
            '    </filter>',
            '  </defs>',
            '  <g filter="url(#bbblurry-filter)">',
            '<ellipse rx="150" ry="150" cx="50%" cy="50%" fill="hsl(316, 73%, 52%)"/>'
        );
     
        // you get one more ellipse for every time you vote
        for(uint256 i=0; i<voteCount; i++) {
            string memory x = random(100).toString();
            string memory y = random(100).toString();
            string memory hue = random(360).toString();
            svg = abi.encodePacked(svg, '<ellipse rx="150" ry="150" cx="',x,'%" cy="',y,'%" fill="hsl(',hue,', 73%, 52%)"/>');
        }

        // everyone gets the end
        svg = abi.encodePacked(svg,     
            '</g>',
            '</svg>'
        );

        return string(
            abi.encodePacked(
                "data:image/svg+xml;base64,",
                Base64.encode(svg)
            )    
        );
    }

     /**
     * @dev Returns a random number between 1 and max. This may or may not suspectable to hacks, I 
     * probably should use Chainlink or some outside number generator, but let's get it working first.
     */
    function random(uint max) private returns (uint) {
        nonce++;
        return uint(keccak256(abi.encodePacked(nonce, block.timestamp, block.difficulty, msg.sender))) % max + 1;
    }  
    
    /**
     * @dev Returns the number of times msg.sender has voted
     */
    function getVoteCount() public view returns(uint256) {
        return tokenIdToVoteCount[addressToTokenId[msg.sender]];
    }

    /**
     * @dev Creates and returns the token URI
     */
    function getTokenURI(uint256 tokenId) public returns (string memory){
        bytes memory dataURI = abi.encodePacked(
            '{',
                '"name": "Web3 Citizen ID #', tokenId.toString(), '",',
                '"description": "A voter ID for web3 citizens",',
                '"image": "', generateCitizenId(tokenId), '"',
            '}'
        );
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(dataURI)
            )
        );
    }

    /**
     * @dev Mints an NFT for msg.sender. Since this is an ID, we only allow one NFT per address
     */
    function mint() public {
        // validates that the adress doesn't have an nft already (tokenId)
        require(addressToTokenId[msg.sender] == 0, "you already have an NFT");
        // updates this tokenId tracker.
        _tokenIds.increment();
        // give the new tokenId (new ammount of minted nfts) to the new NFT.
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        // set the ammount of times a nft has been used to vote to 0.
        tokenIdToVoteCount[newItemId] = 0;
        _setTokenURI(newItemId, getTokenURI(newItemId));
        // assign the nft id to the sender. We save that the sender now has this nft to check later.
        addressToTokenId[msg.sender] = newItemId;
    }   

    /*
     * @dev Increases the number of votes for the spcified address
     * @param The address of the wallet that just voted
     * 
     */
    function vote(address votingAddress) public {
        // validates that the caller is a ballot contract. 
        require(ballotAddresses[msg.sender] == 1, "Only registered Ballot contracts can call Web3Citizen.vote()");
        
        // to this point, we know that the user has a nft.
        // the passed that validation at Ballot vote()

        uint256 tokenId = addressToTokenId[votingAddress];
        require(_exists(tokenId), "please use an existing id");
        //TODO only allow Ballot to call
        uint256 voteCount = tokenIdToVoteCount[tokenId];
        tokenIdToVoteCount[tokenId] = voteCount + 1;
         _setTokenURI(tokenId, getTokenURI(tokenId));       
    }
} 
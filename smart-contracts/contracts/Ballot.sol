// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "hardhat/console.sol";
import "./Web3Citizen.sol";

/** 
 * @title Ballot
 * @dev Implements voting process along with vote delegation
 * inspired by https://www.youtube.com/watch?v=GB3hiiNNDjk
 */
 // ballot1 deployed to 0x3ff3efbf39d056c4de0277a2c5fff924a4082807
contract Ballot {
    address private _web3CitizenIdContract;
    //lists all registerd voters
    mapping(address => uint256) private _registeredVoters;

    struct Voter {
        uint weight; // weight is accumulated by delegation as each user can only have 1 vote
        bool voted;  // if true, that person already voted
        address delegate; // if blank we have not delegated, if is an address means we have delegated to someone else 
        uint vote;   // index of the voted proposal
    }

    struct Proposal {
        bytes32 name;   // short name (up to 32 bytes)
        uint voteCount; // number of accumulated votes
    }

    mapping(address => Voter) public voters; 

    Proposal[] public proposals;

    /** 
     * @dev Create a new ballot to choose one of 'proposalNames'.
     * @param ballotOptions names of proposals
     */
    constructor(bytes32[] memory ballotOptions, address citizenIDContract) {
        _web3CitizenIdContract = citizenIDContract;

        //TODO: REQUIRE MSG.SENDER IS ACCOUNT HOLDER
        // For some reason this is giving me a not enough gas error
        //require(isWeb3Citizen(msg.sender));

        for (uint i = 0; i < ballotOptions.length; i++) {
            // create a new Proposal with a vote count of 0
            proposals.push(Proposal({
                name: ballotOptions[i],
                voteCount: 0
            }));
        }
       // now we tell the ID contract that a new Ballot has been created
        //Web3Citizen studentIDToken = Web3Citizen(_web3CitizenIdContract);
        //studentIDToken.addBallotToCollection();
    }
    
    /**
     * @dev This should be in the constructor, but it's giving me out of gas errors
     *
     * Comment out. Makes less secure, but helps launch hackathon
     */
    //function addToWeb3Citizen() public {
    //   // now we tell the ID contract that a new Ballot has been created
    //    Web3Citizen studentIDToken = Web3Citizen(_web3CitizenIdContract);
    //    studentIDToken.addBallotToCollection();
    //}

    /**
     * @dev Checks to see if specified address owns an earlyStudentNFT
     */
    function isWeb3Citizen(address addressToCheck) public view returns (bool) {
        // connect to the citizen id contract
        Web3Citizen studentIDToken = Web3Citizen(_web3CitizenIdContract);
 
        // check to see if the specified account has an early student id
        return studentIDToken.balanceOf(addressToCheck) > 0;
    }

    /**
     * @dev Delegate your vote to the voter 'to'.
     * @param to address to which vote is delegated
     */
    function delegate(address to) public {
        // check to see voter and delegate are registered to vote
        if(_registeredVoters[msg.sender] == 0) {
            _registeredVoters[msg.sender] = 1;
            voters[msg.sender].weight = 1;
        }
        if(_registeredVoters[to] == 0) {
            _registeredVoters[to] = 1;
            voters[to].weight = 1;
        }

        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "You already voted.");
        require(to != msg.sender, "Self-delegation is disallowed.");
       
        // this covers the corner-case when someone delegates they
        // vote to someone who has already delegated their vote to someone else
        // If A has delegated to C, and B tries to delegate to A, B's delegation will move to C
        while (voters[to].delegate != address(0)) {
            to = voters[to].delegate;
            require(to != msg.sender, "Found loop in delegation.");
        }

        sender.voted = true;
        sender.delegate = to;

        Voter storage delegate_ = voters[to];

        if (delegate_.voted) {
            // If the delegate already voted,
            // directly add to the number of votes
            proposals[delegate_.vote].voteCount += sender.weight;
        } else {
            // If the delegate did not vote yet,
            // add to her weight.
            delegate_.weight += sender.weight;
        }

        // delegating your vote means you've exercised your civic responsibility, so we update the Id
        // there's still a chance the delegat-ee will not vote, but that doesn't matter. 
        Web3Citizen studentIDToken = Web3Citizen(_web3CitizenIdContract);
        studentIDToken.vote(msg.sender);       
    }

    /**
     * @dev Give your vote (including votes delegated to you) to proposal 'proposals[proposal].name'.
     * @param optionID index of proposal in the proposals array
     */
    function vote(uint optionID) public {
        // check to see if we've registered them to vote
        if(_registeredVoters[msg.sender] == 0) {
            _registeredVoters[msg.sender] = 1;
            voters[msg.sender].weight = 1;
        }

        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "You already voted");
        sender.voted = true;
        sender.vote = optionID;

        // If 'proposal' is out of the range of the array,
        // this will throw automatically and revert all
        // changes.
        proposals[optionID].voteCount += sender.weight;

        // update the ID card to show we've voted
        // TODO: this needs some secuity
        Web3Citizen studentIDToken = Web3Citizen(_web3CitizenIdContract);
        studentIDToken.vote(msg.sender);
    }

    /** 
     * @dev Computes the winning proposal taking all previous votes into account.
     * @return winningProposal_ index of winning proposal in the proposals array
     */
    function winningProposal() public view
            returns (uint winningProposal_)
    {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    /** 
     * @dev Calls winningProposal() function to get the index of the winner contained in the proposals array and then
     * @return winnerName_ the name of the winner
     */
    function winnerName() public view
            returns (bytes32 winnerName_)
    {
        winnerName_ = proposals[winningProposal()].name;
    }

    /**
     * @dev returns the voteCount for the specified name
     */
        function voteCount(bytes32 nameToCheck) public view returns (uint256) {
        for (uint i = 0; i < proposals.length; i++) {
                if (proposals[i].name == nameToCheck) {
                    return proposals[i].voteCount;
                }
            }
            //TODO add better error handeling
            return 0;
        }
    }

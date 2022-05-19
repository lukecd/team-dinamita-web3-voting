async function createBytes(name) {
    const bytes = ethers.utils.formatBytes32String(name);
    return bytes;
}

async function parseBytes(bytes) {
   const name = ethers.utils.parseBytes32String(bytes);
   return name;
}

const main = async () => {
    try {
        const [person1, person2, person3, person4, person5] = await hre.ethers.getSigners();

        // create and deploy the contract
        const nftContractFactory = await hre.ethers.getContractFactory("Web3Citizen");
        const nftContract = await nftContractFactory.deploy();
        await nftContract.deployed();
        console.log("Web3Citizen deployed to:", nftContract.address);

        // mint NFTs (required to mint before creating a Ballot)
        await nftContract.connect(person1).mint();
        await nftContract.connect(person2).mint();
        await nftContract.connect(person3).mint();
        await nftContract.connect(person4).mint();
        await nftContract.connect(person5).mint();
        console.log("minted an nfts");

        let constructorArgs = [createBytes("gonza"), createBytes("nacho"), createBytes("luke")];
        const Ballot = await hre.ethers.getContractFactory("Ballot");
        const ballot = await Ballot.deploy(constructorArgs, nftContract.address);
        await ballot.deployed();
        console.log("Ballot deployed to ", ballot.address);

        // register to vote 
        // NOTE THIS IS A NEW STEP!
        await ballot.connect(person1).registerToVote();
        await ballot.connect(person2).registerToVote();
        await ballot.connect(person3).registerToVote();
        await ballot.connect(person4).registerToVote();
        await ballot.connect(person5).registerToVote();

        // persons 1-3 vote on their own
        await ballot.connect(person1).vote(0);
        await ballot.connect(person2).vote(0);
        await ballot.connect(person3).vote(0);        
        
        // check that each person has now voted once
        let votedCount = await nftContract.connect(person1).getVoteCount();
        console.log("Person1 voted "+votedCount+" times");
        votedCount = await nftContract.connect(person2).getVoteCount();
        console.log("Person2 voted "+votedCount+" times");
        votedCount = await nftContract.connect(person3).getVoteCount();
        console.log("Person3 voted "+votedCount+" times");

        // person 4 delegates to person 5
        await ballot.connect(person4).delegate(person5.address);
        // check that person 4 now has a vote acount of 1
        votedCount = await nftContract.connect(person4).getVoteCount();
        console.log("Person4 voted "+votedCount+" times");

        // now have person5 exercise their 2 votes
        await ballot.connect(person5).vote(2);      
        // check that person 5 now has a vote count of 1
        votedCount = await nftContract.connect(person5).getVoteCount();
        console.log("Person5 voted "+votedCount+" times");

        // check the vote tallys in the Ballot
        // should be 3 for option 0, and 2 for option 2
        const voteCountForOption0 = await ballot.connect(person1).voteCount(constructorArgs[0]);
        const voteCountForOption1 = await ballot.connect(person1).voteCount(constructorArgs[1]);
        const voteCountForOption2 = await ballot.connect(person1).voteCount(constructorArgs[2]);
        console.log("voteCountForOption0="+voteCountForOption0);
        console.log("voteCountForOption1="+voteCountForOption1);
        console.log("voteCountForOption2="+voteCountForOption2);
        process.exit(0);
    } 
    catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
    
  main();
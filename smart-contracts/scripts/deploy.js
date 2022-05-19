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
        //const nftContractFactory = await hre.ethers.getContractFactory("Web3Citizen");
        //const nftContract = await nftContractFactory.deploy();
        //await nftContract.deployed();
        //console.log("Web3Citizen deployed to:", nftContract.address);

        let constructorArgs = [createBytes("gonza"), createBytes("nacho"), createBytes("luke")];
        const Ballot = await hre.ethers.getContractFactory("Ballot");
        console.log("got contractFactory");
        //const ballot = await Ballot.deploy(constructorArgs, nftContract.address);
        const ballot = await Ballot.deploy(constructorArgs, '0x652a6302420D94F707b7Ad9Ae6eFc9E849805605');
        console.log("called deploy");
        await ballot.deployed();
        console.log("Ballot deployed to ", ballot.address);

        process.exit(0);
    } 
    catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
    
  main();
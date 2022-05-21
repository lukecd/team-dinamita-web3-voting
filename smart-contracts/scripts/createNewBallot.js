const nftContractAddress = "0x652a6302420d94f707b7ad9ae6efc9e849805605";

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

    let constructorArgs = [createBytes("option1"), createBytes("option2"), createBytes("option3")];
    const Ballot = await hre.ethers.getContractFactory("Ballot");
    console.log("got contractFactory");
    const ballot = await Ballot.deploy(constructorArgs, nftContractAddress);
    //const ballot = await Ballot.deploy(constructorArgs, '0x652a6302420D94F707b7Ad9Ae6eFc9E849805605');
    console.log("called deploy");
    await ballot.deployed();
    console.log("Ballot deployed to ", ballot.address);

    // This should be called from the constructor, but it gives not enough gas errors
    await ballot.addToWeb3Citizen();
    console.log("Ballot added to the Web3Citizen collection of Ballots");

    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

main();
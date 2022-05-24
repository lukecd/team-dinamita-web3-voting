
// list of ballots created
const ballot1Address = "0x7529C3E807d35B04241486e52796830eDB20EA8c";
const ballot2Address = "0xd46f127d31f1BDb5Adb03A8cF363d89a8CBdd04c";
const ballot3Address = "0x590c8AEE99943Eb65817D461ED1d3c23119aA2F0";


const nftContractAddress = "0x4Eed0b565D57DB5D7A103Dc751104e03897cfcA0";

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

    let constructorArgs = [createBytes("first option"), createBytes("second option"), createBytes("third option")];
    const Ballot = await hre.ethers.getContractFactory("Ballot");
    console.log("got contractFactory");
    const ballot = await Ballot.deploy(constructorArgs, nftContractAddress);
    //const ballot = await Ballot.deploy(constructorArgs, '0x652a6302420D94F707b7Ad9Ae6eFc9E849805605');
    console.log("called deploy");
    await ballot.deployed();
    console.log("Ballot deployed to ", ballot.address);

    // This should be called from the constructor, but it gives not enough gas errors
    // await ballot.addToWeb3Citizen();
    // console.log("Ballot added to the Web3Citizen collection of Ballots");

    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

main();

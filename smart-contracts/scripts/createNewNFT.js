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
    const nftContractFactory = await hre.ethers.getContractFactory("Web3Citizen");
    const nftContract = await nftContractFactory.deploy();
    await nftContract.deployed();
    console.log("Web3Citizen deployed to:", nftContract.address);

    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

main();

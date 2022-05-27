import React, { useEffect } from "react";
// import WarningIcon from "../components/WarningIcon.jsx";
import MintNFT from "../components/MintNFT";
import { useContract, useProvider, useSigner } from "wagmi";
import nAbi from "../smart-contracts/artifacts/contracts/Web3Citizen.sol/Web3Citizen.json";
import { nftAddress } from "../pages/index.js";
const nftAbi = nAbi.abi;

const Header = ({ NFT, loadingNFT, user }) => {
  const { data: signer, isError: isSignerError, isLoading: isSignerLoading } = useSigner();
  const nftWithSigner = useContract({
    addressOrName: nftAddress,
    contractInterface: nftAbi,
    signerOrProvider: signer,
  });

  const getVoteCount = async contract => {
    const data = await contract.getVoteCount();
    // const votes = await data.toNumber();
    return data;
  };

  useEffect(() => {
    console.log(user);
    console.log(signer);
    if (user && !isSignerLoading) {
      getVoteCount(nftWithSigner)
        .then(data => {
          console.log("the data is", data);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [user, isSignerLoading]);

  return (
    <header className="w-full border-b-[1px] border-white/25 py-6 flex items-center">
      <div className="w-10/12">
        <h3 className="text-2xl 2xl:text-3xl font-medium mb-4">Intructions</h3>
        <p className="text-lg 2xl:text-xl font-medium mb-3">
          To be able to vote on a proposal, you have to{" "}
          <span className="text-cyan-400">claim our NFT </span> to be validated as a member of the
          community.
        </p>
        <p className="text-lg 2xl:text-xl font-medium mb-3">
          <span className="text-cyan-400">Your NFT will evolve </span> each time you vote. this way,
          active members will have their NFT as a proof-of-activity.
        </p>
        <p className="text-lg 2xl:text-xl font-medium mb-3">
          Be sure to refresh the metadata in open sea in order to see the evolution!.
        </p>
        {/* <span className="flex items-center mb-2">
          <span className="text-cyan-400 relative top-[1px]">
            <WarningIcon />
          </span>
          <p className="text-lg 2xl:text-xl text-cyan-400">
            We are facing a development UI error, if you dont see the available options to vote,
            connect and disconnect you wallet in the button from above. Thanks.
          </p>
        </span> */}
        <p className="text-lg 2xl:text-xl font-medium mb-10 2xl:mb-8">
          Claim free Mumbai $MATIC to use this dapp:{" "}
          <a className="text-cyan-400" href="https://faucet.polygon.technology/" target="_blank">
            https://faucet.polygon.technology/
          </a>
        </p>
      </div>
      <div className="w-3/12 2xl:w-2/12">
        {/* if the user is not connected, show nothing.  */}
        {user && !loadingNFT && NFT && (
          <div className="flex flex-col items-center bg-gray-800 rounded-xl px-4 py-2 ">
            <h3>{NFT.name}</h3>
            <img className="bg-purple-700/20 rounded-xl my-1" src={NFT.image} alt="" />
            <p className="text-cyan-300">{NFT.description}</p>
          </div>
        )}
        {user && !loadingNFT && !NFT && (
          <div className="flex flex-col items-center justify-center bg-gray-800 rounded-xl px-4 py-4">
            <h3 className="text-lg mb-4">You don't hold the nft .</h3>
            <MintNFT NFT={NFT} loadingNFT={loadingNFT} user={user} />
            <p className="text-cyan-300 mt-1">Be a member of the community!</p>
          </div>
        )}
        {user && loadingNFT && (
          <div>
            <p>Loading...</p>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

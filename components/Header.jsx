import React from "react";
import WarningIcon from "../components/WarningIcon.jsx";
import MintNFT from "../components/MintNFT";

const Header = ({ NFT, loadingNFT }) => {
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
        {!loadingNFT && NFT && (
          <div className="flex flex-col items-center bg-gray-800 rounded-xl px-4 py-2 ">
            <h3>{NFT.name}</h3>
            <img className="bg-purple-700/20 rounded-xl my-1" src={NFT.image} alt="" />
            <p className="text-cyan-300">{NFT.description}</p>
          </div>
        )}
        {!loadingNFT && !NFT && (
          <div>
            <MintNFT NFT={NFT} loadingNFT={loadingNFT} user={user} />
          </div>
        )}
        {loadingNFT && (
          <div>
            <p>Loading...</p>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

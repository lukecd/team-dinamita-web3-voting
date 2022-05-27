import { Tooltip, Loading } from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import { useContract, useSigner } from "wagmi";
import { nftAddress } from "../pages";

import abi from "../smart-contracts/artifacts/contracts/Web3Citizen.sol/Web3Citizen.json";

const nftAbi = abi.abi;

const MintNFT = ({ user, NFT, loadingNFT }) => {
  const [mintingNft, setMintingNft] = useState(false);
  const [mintingNftError, setMintingNftError] = useState(null);
  const [minted, setMinted] = useState(false);

  const { data: signer, isError: isSignerError, isLoading: isSignerLoading } = useSigner();
  const nftWithSigner = useContract({
    addressOrName: nftAddress,
    contractInterface: nftAbi,
    signerOrProvider: signer,
  });

  const mintNft = async () => {
    const data = await nftWithSigner.mint({
      gasLimit: 5000000,
    });
    console.log(data);
    let receipt = await data.wait();
    console.log(receipt);
    return receipt;
  };

  const handleMintNft = () => {
    if (user) {
      setMintingNft(true);
      mintNft()
        .then(result => {
          console.log("handleMintNft- successfull!", result);
          setMintingNftError(null);
          setMinted(true);
        })
        .catch(error => {
          console.log("handleMintNft - error ", error.reason);
          console.log(error);
          setMintingNftError(error.message);
        })
        .finally(() => {
          setMintingNft(false);
        });
    }
  };
  return (
    <>
      {/* only connected users can see the Mint button. */}
      {user && !loadingNFT && !NFT && (
        <Tooltip
          shadow={true}
          placement="bottom"
          content={
            mintingNft ? (
              "minting ... "
            ) : minted ? (
              <a
                className="flex items-center justify-center flex-col"
                href={`https://testnets.opensea.io/${user}`}
                target="_blank"
              >
                <p className="">Minted the NFT successfuly.</p>
                <p className="text-cyan-400">Click here to see your new NFT in open sea!</p>
                <p> ( It will take 1min for opensea to load it. )</p>
              </a>
            ) : mintingNftError !== null ? (
              "Transaction failed. Check if you already have the NFT. You can only mint one. If you dont have one yet, it must be that you dont have enough gas to mint. Around 0.07 matic is needed."
            ) : (
              "Mint this test-net NFT to be get Vote Power and emit a vote!. You can only mint one."
            )
          }
          css={{
            borderRadius: "$sm",
            padding: "$4 $8",
            fontWeight: "$medium",
            textAlign: "center",
          }}
        >
          <button
            onClick={handleMintNft}
            disabled={NFT}
            className={`text-center w-44 border-[2px] rounded-lg px-4 py-3 font-semibold bg-[rgba(153,102,255,0.35)] border-[rgba(153,102,255,1)] hover:bg-[rgba(126,69,241,0.35)] hover:border-[rgba(127,63,255,1)] mr-4 relative cursor-pointer`}
          >
            {mintingNft ? (
              <Loading color="secondary" size="sm" />
            ) : minted ? (
              "Minted"
            ) : mintingNftError === null ? (
              "Mint the NFT!"
            ) : (
              "Error"
            )}
          </button>
        </Tooltip>
      )}

      {user && !loadingNFT && NFT && (
        <Tooltip
          shadow={true}
          placement="bottom"
          content={"You already have the NFT!"}
          css={{
            borderRadius: "$sm",
            padding: "$4 $8",
            fontWeight: "$medium",
            textAlign: "center",
          }}
        >
          <button
            onClick={handleMintNft}
            disabled={NFT}
            className={`text-center w-44 border-[2px] rounded-lg px-4 py-3 font-semibold bg-[rgba(153,102,255,0.35)] border-[rgba(153,102,255,1)] hover:bg-[rgba(126,69,241,0.35)] hover:border-[rgba(127,63,255,1)] mr-4 relative cursor-pointer`}
          >
            {mintingNft ? (
              <Loading color="secondary" size="sm" />
            ) : minted ? (
              "Minted"
            ) : mintingNftError === null ? (
              "Mint the NFT!"
            ) : (
              "Error"
            )}
          </button>
        </Tooltip>
      )}
    </>
  );
};

export default MintNFT;

import { Dialog } from "@headlessui/react";
import { Tooltip, Loading } from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import { useContract, useFeeData, useProvider, useSigner } from "wagmi";

import abi from "../smart-contracts/artifacts/contracts/Web3Citizen.sol/Web3Citizen.json";

const nftAddress = "0x652a6302420D94F707b7Ad9Ae6eFc9E849805605"; // nft contract
const nftAbi = abi.abi
console.log(nftAbi)

const MintNFT = ({ user }) => {
  const { data: feeData, isError: isErrorFee, isLoading, isLoadingFee } = useFeeData();
  // console.log(feeData);

  const [mintingNft, setMintingNft] = useState(false);
  const [mintingNftError, setMintingNftError] = useState(false);
  const [minted, setMinted] = useState(undefined);

  const { data: signer, isError: isSignerError, isLoading: isSignerLoading } = useSigner();
  const nftWithSigner = useContract({
    addressOrName: nftAddress,
    contractInterface: nftAbi,
    signerOrProvider: signer,
  });

  const mintNft = async () => {
    const data = await nftWithSigner.mint({
      gasLimit: 2599999
    });
    console.log(data)
    let receipt = await data.wait()
    console.log(receipt)
    return receipt
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
          setMintingNftError(error.reason);
          setMinted(true);
        })
        .finally(() => {
          setMintingNft(false);
        });
    }
  };
  //y ya casi tengo el minteo :D

  // the function to verify if the adress has the nft is private
  // because of that, we will check in the try to mint and in the votation time.
  return (
    <>
      {/* only connected users can see the Mint button. */}
      {user && (
        <Tooltip
          shadow={true}
          placement="bottom"
          content={
            mintingNft
              ? "minting ... "
              : mintingNftError
              ? mintingNftError
              : "Mint this test-net NFT to be able to vote. You can only mint one."
          }
          css={{
            borderRadius: "$sm",
            padding: "$4 $8",
            fontWeight: "$medium",
          }}
        >
          <button
            onClick={handleMintNft}
            className={`text-center w-44 border-[2px] rounded-lg px-4 py-3 font-semibold bg-[rgba(153,102,255,0.35)] border-[rgba(153,102,255,1)] hover:bg-[rgba(126,69,241,0.35)] hover:border-[rgba(127,63,255,1)] mr-4 relative cursor-pointer`}
          >
            {mintingNft ? <Loading color="secondary" size="sm" /> : "Mint the NFT!"}
          </button>
        </Tooltip>
      )}
    </>
  );
};

export default MintNFT;

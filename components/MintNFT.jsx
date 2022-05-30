import { Tooltip, Loading } from "@nextui-org/react";
import React from "react";

const MintNFT = ({
  minted,
  setMinted,
  mintingNft,
  setMintingNft,
  mintingNftError,
  setMintingNftError,
  handleMintNft,
}) => {
  // if this component is rendered, the user is loged, nothing is loading and the dosn't have the nft yet.

  return (
    <Tooltip
      shadow={true}
      placement="bottom"
      content={
        mintingNft ? (
          "minting... "
        ) : mintingNftError !== null ? (
          <p className="font-medium">
            Transaction failed. <br />
            Check if you have enought gas. <br />
            Around 0.07 matic is needed.
            <br />
            Check if you already have the NFT. <br />
            You can only mint one.
            <br />
          </p>
        ) : (
          <p className="font-medium p-0 m-0">
            Mint the NFT to be able to vote. <br />
            You can only mint one.
          </p>
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
        className={`text-center w-[180px] h-[52px] rounded-lg border-[2px] font-semibold bg-[rgba(153,102,255,0.35)] border-[rgba(153,102,255,1)] hover:bg-[rgba(126,69,241,0.35)] hover:border-[rgba(127,63,255,1)] cursor-pointer flex items-center justify-center`}
      >
        {mintingNft ? (
          <Loading color="secondary" size="md" />
        ) : mintingNftError === null ? (
          "Mint the NFT"
        ) : (
          "Error, try again"
        )}
      </button>
    </Tooltip>
  );
};

export default MintNFT;

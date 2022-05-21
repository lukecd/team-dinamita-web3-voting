import { Tooltip, Loading } from "@nextui-org/react";
import React, { useState, useEffect } from "react";

const Verification = ({
  user,
  isVerified,
  setIsVerified,
  loadingVerification,
  loadingMint,
  setLoadingVerification,
  setLoadingMint,
}) => {
  const className =
    "text-center w-44 border-[2px] rounded-lg px-4 py-3 font-semibold bg-[rgba(153,102,255,0.35)] border-[rgba(153,102,255,1)] hover:bg-[rgba(126,69,241,0.35)] hover:border-[rgba(127,63,255,1)]";

  const timeout = Math.random() * 4000;

  const mintNFT = () => {
    setLoadingMint(true);
  };

  useEffect(() => {
    setTimeout(() => {
      if (timeout <= 2500) {
        {
          setIsVerified(true);
        }
      } else {
        setIsVerified(false);
      }
      setLoadingVerification(false);
    }, [timeout]);
  }, []);

  return (
    <>
      <Tooltip
        shadow={true}
        placement="bottom"
        content={
          isVerified
            ? `You are a holder of the NFT in your address ${user}`
            : `You are not a holder of the NFT in your address ${user}`
        }
        css={{
          borderRadius: "$sm",
          padding: "$4 $8",
          fontWeight: "$medium",
        }}
      >
        {loadingVerification && (
          <div className={`${className} cursor-default`}>Verificating...</div>
        )}
        {!isVerified && !loadingVerification && (
          <button onClick={mintNFT} className={`${className} cursor-pointer`}>
            {loadingMint ? (
              <Loading color="secondary" size="sm" />
            ) : (
              "Mint the NFT!"
            )}
          </button>
        )}
        {isVerified && !loadingVerification && (
          <div className={`${className} cursor-default`}>
            You hold the NFT!
            {/* <img src="https://img.freepik.com/psd-gratis/nft-logo-3d-render-tecnologia-estilo-blockchain_513203-159.jpg"></img> */}
          </div>
        )}
      </Tooltip>
    </>
  );
};

export default Verification;

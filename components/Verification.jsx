import { Tooltip } from "@nextui-org/react";
import React, { useState, useEffect } from "react";

const Verification = ({
  user,
  isVerified,
  setIsVerified,
  loadingVerification,
  setLoadingVerification,
}) => {
  const className =
    "cursor-default border-[2px] rounded-lg px-4 py-2 font-semibold bg-[rgba(153,102,255,0.35)] border-[rgba(153,102,255,1)] hover:bg-[rgba(126,69,241,0.35)] hover:border-[rgba(127,63,255,1)]";

  const timeout = Math.random() * 4000;

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
        {loadingVerification && <div className={`${className}`}>Verificating...</div>}
        {!isVerified && !loadingVerification && (
          <div className={`${className}`}>You dont hold the NFT</div>
        )}
        {isVerified && !loadingVerification && (
          <div className={`${className} `}>
            You hold the NFT!
            {/* <img src="https://img.freepik.com/psd-gratis/nft-logo-3d-render-tecnologia-estilo-blockchain_513203-159.jpg"></img> */}
          </div>
        )}
      </Tooltip>
    </>
  );
};

export default Verification;

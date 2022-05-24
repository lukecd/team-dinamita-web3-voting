import React, { useState, useEffect } from "react";
import { useContract, useSigner } from "wagmi";
import abi from "../smart-contracts/abi/BallotAbi.json";

const ballot1Address = "0x3ff3EfbF39d056c4dE0277a2c5FFF924a4082807";
const ballotAbi = abi;

const Vote = () => {
  const [showError, setShowError] = useState(false);
  const [claimError, setClaimError] = useState(null);
  const { data: signer, isError, isLoading } = useSigner();
  const ballot1 = useContract({
    addressOrName: ballot1Address,
    contractInterface: ballotAbi,
    signerOrProvider: signer,
  });

  useEffect(() => {
    if (showError) {
      setShowError(true);
      let timeout = setTimeout(() => setShowError(false), 4000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [showError]);

  const getVotes = async (name, contract) => {
    const data = await contract.voteCount(createBytes(name));
    return data;
  };

  const handleClaimVotePower = async () => {
    setClaimError(null);
    await ballot1
      .registerToVote()
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        setShowError(true);
        setClaimError(error.reason);
      });
  };

  return (
    <>
      <div
        className="text-center w-44 border-[2px] rounded-lg px-4 py-3 font-semibold bg-[rgba(153,102,255,0.35)] border-[rgba(153,102,255,1)] hover:bg-[rgba(126,69,241,0.35)] hover:border-[rgba(127,63,255,1)] mr-4 relative cursor-pointer"
        onClick={handleClaimVotePower}
      >
        {isLoading ? "loading" : isError ? "Error" : "Claim vote power"}
        {showError && (
          <span className="absolute top-[3.8rem] left-0 border-[2px] rounded-lg bg-red-600/50 border-red-100 w-[270px] text-white py-3 px-2 font-normal  text-md">
            {claimError}
          </span>
        )}
      </div>
    </>
  );
};

export default Vote;

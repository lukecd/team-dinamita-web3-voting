import React, { useState, useEffect } from "react";
import Link from "next/link";
import { proposalsData } from "../utils/proposals.js";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import OptionsGroup from "/components/OptionsGroup.jsx";
import Chart from "../components/Chart.jsx";
import MintNFT from "../components/MintNFT";
import MyDialog from "../components/MyDialog";
import Informative from "../components/Informative.jsx";

import { useAccount, useContract, useProvider, useSigner } from "wagmi";
import abi from "../smart-contracts/abi/BallotAbi.json";
import { createBytes } from "../utils/functions.js";
import { Tooltip } from "@nextui-org/react";
import WarningIcon from "../components/WarningIcon.jsx";

const nacho = (
  <span className="text-teal-300">
    <Link href="https://twitter.com/cu_ouz">@cu_ouz</Link>
  </span>
);
const gonza = (
  <span className="text-teal-300">
    <Link href="https://twitter.com/gonzaotc">@gonzaotc</Link>
  </span>
);
// HAY ESPERANZAS.
const luke = (
  <span className="text-teal-300">
    <Link href="#">@lukebkk</Link>
  </span>
);

// at this moment only the ballot1 is created. it has "option1", "option2", "option3"
const ballot1Address = "0x3ff3EfbF39d056c4dE0277a2c5FFF924a4082807";
const ballot2Address = "0x8384AA012478A1f75DAF69812592BA9712cb0663";
const ballot3Address = "0xbC49650e92FaC4B60409fa79cF72486df066876F";
const ballotAbi = abi;

const Index = () => {
  // states
  const proposals = proposalsData;
  const [options, setOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const { data: accountData, isError, isLoading: isAccountLoading } = useAccount();
  const [user, setUser] = useState(undefined);

  const [getVotePowerLoading, setGetVotePowerLoading] = useState(false);
  const [getVotePowerError, setGetVotePowerError] = useState(null);
  const [hasVotePower, setHasVotePower] = useState(null);

  const [hasVotedReloadUi, setHasVotedReloadUi] = useState(false);

  useEffect(() => {
    if (accountData && !isAccountLoading) {
      setUser(accountData.address);
    } else setUser(undefined);
  }, [accountData]);

  // contracts data
  const provider = useProvider();
  const ballotWithProvider1 = useContract({
    addressOrName: ballot1Address,
    contractInterface: ballotAbi,
    signerOrProvider: provider,
  });
  const ballotWithProvider2 = useContract({
    addressOrName: ballot2Address,
    contractInterface: ballotAbi,
    signerOrProvider: provider,
  });
  const ballotWithProvider3 = useContract({
    addressOrName: ballot3Address,
    contractInterface: ballotAbi,
    signerOrProvider: provider,
  });
  const ballotsWithProviders = [ballotWithProvider1, ballotWithProvider2, ballotWithProvider3];

  const { data: signer, isError: isSignerError, isLoading: isSignerLoading } = useSigner();
  const ballotWithSigner1 = useContract({
    addressOrName: ballot1Address,
    contractInterface: ballotAbi,
    signerOrProvider: signer,
  });
  const ballotWithSigner2 = useContract({
    addressOrName: ballot2Address,
    contractInterface: ballotAbi,
    signerOrProvider: signer,
  });
  const ballotWithSigner3 = useContract({
    addressOrName: ballot3Address,
    contractInterface: ballotAbi,
    signerOrProvider: signer,
  });
  const ballotsWithSigners = [ballotWithSigner1, ballotWithSigner2, ballotWithSigner3];

  // FUNCTIONS
  const getVotes = async (name, contract) => {
    const data = await contract.voteCount(createBytes(name));
    const votes = await data.toNumber();
    return votes;
  };

  const getVotePower = async contract => {
    const data = await contract.registerToVote({ gasLimit: 2600000 });
    console.log(data);
    let receipt = await data.wait();
    console.log(receipt);
    return receipt;
  };

  // registerToVote validations -> isWeb3Citizen, !voted
  const handleClaimVotePower = contract => {
    setGetVotePowerLoading(true);
    getVotePower(contract)
      .then(result => {
        console.log("getVotePower - successfull!", result);
        setGetVotePowerError(null);
        setHasVotePower(true);
      })
      .catch(error => {
        console.log("getVotePower - error", error);
        setGetVotePowerError(error.reason);
        setHasVotePower(false);
      })
      .finally(() => {
        setGetVotePowerLoading(false);
      });
  };

  // loads votes
  useEffect(() => {
    console.log("hello ");
    const fetchedProposals = [];
    proposals.forEach((proposal, index) => {
      const fetchedOptions = [];
      proposal.options.forEach(async option => {
        await getVotes(option.name, ballotsWithProviders[index])
          .then(votes => {
            fetchedOptions.push({ ...option, votes: votes });
          })
          .catch(error => console.log(error));
      });
      fetchedProposals.push({
        title: proposal.title,
        id: proposal.id,
        timeEnd: proposal.timeEnd,
        options: fetchedOptions,
      });
    });
    setOptions(fetchedProposals);
    setLoadingOptions(false);
    return () => {
      console.log("bye");
    };
  }, [hasVotedReloadUi]);

  return (
    <>
      <div className="h-full bg-gradient w-full flex items-center justify-center font-Inter text-white">
        {/* page container -> aprox 80% width.  */}
        <div className="h-full w-10/12 flex flex-col items-center">
          {/* navbar */}
          <nav className="h-20 w-full flex items-center justify-between relative border-b-[1px] border-[rgba(255,255,255,0.25)]">
            {/* justify-center */}
            <h1 className="text-3xl font-medium">NFT-gated voting system 🦄🌌</h1>
            <div className="">
              {/* absolute right-0 */}
              <ConnectButton />
            </div>
          </nav>
          <main className="h-full w-full flex flex-col">
            <section className="w-full py-6 border-b-[1px] border-white/25 flex flex-col">
              <p className="text-lg 2xl:text-xl font-medium mb-3">
                Instructions: To be able to vote on a proposal, you have to claim our NFT to be
                validated as a active member of the community. Also, you have to claim vote power
                for each proposal.
              </p>
              <p className="text-lg 2xl:text-xl font-medium mb-3">
                Claim free Mumbai $MATIC to use this dapp: <a className="text-cyan-400" href="https://faucet.polygon.technology/" target="_blank">https://faucet.polygon.technology/</a>
              </p>
              <span className="flex items-center">
                <span className="text-cyan-400 relative top-[1px]">
                  <WarningIcon />
                </span>
                <p className="text-lg 2xl:text-xl text-cyan-400">
                  We are facing a development UI error, if you dont see the available options to
                  vote, connect and disconnect you wallet in the button from above. Thanks.
                </p>
              </span>
            </section>
            <section className="w-full">
              <div className="flex justify-between items-center my-4">
                <h2 className="text-2xl font-medium">Projects being voted:</h2>
                {user && (
                  <span className="flex items-center justify-center">
                    <MintNFT user={user} />
                  </span>
                )}
              </div>
              {options && !isAccountLoading && (
                <>
                  {options.map((proposal, index) => (
                    <article
                      key={index}
                      className={`border-t-[1px] border-[rgba(255,255,255,0.25)] pt-6 2xl:pt-7 mb-8`}
                    >
                      <div className="flex items-center justify-between w-full mb-3">
                        <h3 className="text-xl font-medium">
                          {proposal.id}# - {proposal.title}
                        </h3>
                        <Tooltip
                          shadow={true}
                          placement="bottom"
                          content={
                            getVotePowerLoading
                              ? "Fetching on the blockchain for vote power..."
                              : getVotePowerError
                              ? "Error you dont hold the NFT or you have already voted in this proposal."
                              : hasVotePower
                              ? "You have the vote power!"
                              : "Check if you have the nft and have not voted yet to get 1 vote power"
                          }
                          css={{
                            borderRadius: "$sm",
                            padding: "$4 $8",
                            fontWeight: "$medium",
                          }}
                        >
                          <button
                            className="text-center w-44 border-[2px] rounded-lg px-4 py-3 font-semibold bg-[rgba(153,102,255,0.35)] border-[rgba(153,102,255,1)] hover:bg-[rgba(126,69,241,0.35)] hover:border-[rgba(127,63,255,1)] mr-4 relative cursor-pointer"
                            onClick={() => handleClaimVotePower(ballotsWithSigners[index])}
                          >
                            {getVotePowerLoading
                              ? "Loading.."
                              : getVotePowerError
                              ? "Error"
                              : hasVotePower
                              ? "Empowered!"
                              : "Get vote power"}
                          </button>
                        </Tooltip>
                      </div>

                      <div className="h-full w-full flex items-center ">
                        <OptionsGroup
                          user={accountData?.address}
                          options={proposal.options}
                          hasVotePower={hasVotePower}
                          getVotePowerError={getVotePowerError}
                          setHasVotedReloadUi={setHasVotedReloadUi}
                          ballotWithSigner={ballotsWithSigners[index]}
                        />
                        <Chart options={proposal.options} />
                      </div>
                    </article>
                  ))}
                </>
              )}
            </section>
          </main>
          <footer className="mx-20 border-t-[1px] border-white/10 w-[100vw] h-[200px] box-border flex items-center justify-center">
            <div className="w-1/2 flex items-center justify-center flex-col">
              {/* <Informative />
              <h1 className="border-2">hola</h1> */}
              <p>
                This project was made by {gonza}, {nacho}, {luke} for the Alchemy Hackathon.
              </p>
              <span className="mt-4">
                <svg className="w-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
                  <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
                </svg>
              </span>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Index;

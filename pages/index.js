import React, { useState, useEffect, useCallback } from "react";
import { proposalsData } from "../utils/proposals.js";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import OptionsGroup from "/components/OptionsGroup.jsx";
import Chart from "../components/Chart.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

import { useAccount, useContract, useProvider, useSigner } from "wagmi";
import { createBytes } from "../utils/functions.js";
import bAbi from "../smart-contracts/abi/BallotAbi.json";

const ballot1Address = "0x7529C3E807d35B04241486e52796830eDB20EA8c";
const ballot2Address = "0xd46f127d31f1BDb5Adb03A8cF363d89a8CBdd04c";
const ballot3Address = "0x590c8AEE99943Eb65817D461ED1d3c23119aA2F0";
export const ballotAbi = bAbi;

const Index = () => {
  const proposals = proposalsData;
  const [fetchedProposals, setFetchedProposals] = useState([]);
  const [loadingFetchedProposals, setloadingFetchedProposals] = useState(true);

  // vote notif
  const [voteNotif, setVoteNotif] = useState(false);

  // manage access
  const { data: accountData, isError, isLoading: loadingAccount } = useAccount({ suspense: true });

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

  // loads votes
  const getVotes = async (name, contract) => {
    const data = await contract.voteCount(createBytes(name));
    const votes = await data.toNumber();
    return votes;
  };
  // this should only be executed once. No prior conditions.
  useEffect(() => {
    console.log("running");
    const arrayProposals = [];
    for (let [index, proposal] of proposals.entries()) {
      const arrayOptions = [];
      for (let [index2, option] of proposal.options.entries()) {
        const func = async () => {
          await getVotes(option.name, ballotsWithProviders[index])
            .then(votes => {
              arrayOptions[index2] = { ...option, votes: votes };
            })
            .catch(error => console.log(error));
        };
        func();
      }
      arrayProposals[index] = {
        title: proposal.title,
        id: proposal.id,
        timeEnd: proposal.timeEnd,
        options: arrayOptions,
      };
    }
    console.log(arrayProposals);
    setFetchedProposals(arrayProposals);
    setloadingFetchedProposals(false);
    return () => {
      console.log("desmounting useEffect");
    };
  }, []);

  return (
    <>
      <div className="h-full bg-gradient w-full flex items-center justify-center font-Inter text-white">
        {/* page container -> aprox 80% width.  */}
        <div className="h-full min-h-[100vh]  w-10/12 flex flex-col items-center">
          <nav className="h-20 w-full flex items-center justify-between relative border-b-[1px] border-[rgba(255,255,255,0.25)]">
            <h1 className="text-3xl font-medium">NFT-gated voting system 🦄🌌</h1>
            <ConnectButton />
          </nav>
          {/* Header displays Info and shows the user NFT. */}
          <Header
            accountData={accountData}
            loadingAccount={loadingAccount}
            voteNotif={voteNotif}
            // setVoteNotif={setVoteNotif}
          />
          <main className="h-full w-full flex flex-col">
            <section className="w-full">
              <div className="flex justify-between items-center my-4">
                <h2 className="text-2xl font-medium">Projects being voted:</h2>
              </div>
              {!loadingAccount &&
                accountData &&
                !loadingFetchedProposals &&
                fetchedProposals.length > 0 && (
                  <>
                    {fetchedProposals.map(proposal => (
                      <article
                        key={proposal.id}
                        className={`border-t-[1px] border-[rgba(255,255,255,0.25)] pt-6 2xl:pt-7 mb-8`}
                      >
                        <div className="flex items-center justify-between w-full mb-3">
                          <h3 className="text-xl font-medium">
                            {proposal.id}# - {proposal.title}
                          </h3>
                        </div>
                        <div className="h-full w-full flex items-center ">
                          <OptionsGroup
                            accountData={accountData}
                            loadingAccount={loadingAccount}
                            options={proposal.options}
                            ballotWithSigner={ballotsWithSigners[proposal.id - 1]}
                            setVoteNotif={setVoteNotif}
                          />
                          <Chart options={proposal.options} />
                        </div>
                      </article>
                    ))}
                  </>
                )}
              {!loadingFetchedProposals && !fetchedProposals && (
                <p>Error ocurred at fetching options</p>
              )}
              {loadingFetchedProposals && <p>loading options...</p>}
            </section>
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Index;

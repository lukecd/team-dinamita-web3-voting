import React, { useState, useEffect } from "react";
import { proposalsData } from "../utils/proposals.js";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import OptionsGroup from "/components/OptionsGroup.jsx";
import Chart from "../components/Chart.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

import { useAccount, useContract, useProvider, useSigner } from "wagmi";
import abi from "../smart-contracts/abi/BallotAbi.json";
import { createBytes } from "../utils/functions.js";

const API_KEY = "Z_ZtzOdwRjDpqbmrKXYR6RrIzoUZPwA4";

export const nftAddress = "0x4Eed0b565D57DB5D7A103Dc751104e03897cfcA0"; // nft contract
const ballot1Address = "0x7529C3E807d35B04241486e52796830eDB20EA8c";
const ballot2Address = "0xd46f127d31f1BDb5Adb03A8cF363d89a8CBdd04c";
const ballot3Address = "0x590c8AEE99943Eb65817D461ED1d3c23119aA2F0";
const ballotAbi = abi;

const Index = () => {
  const proposals = proposalsData;
  const [options, setOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [NFT, setNFT] = useState([]);
  const [loadingNFT, setLoadingNFT] = useState(true);

  // manage access
  const { data: accountData, isError, isLoading: isAccountLoading } = useAccount();
  const [user, setUser] = useState(undefined);
  useEffect(() => {
    if (accountData && !isAccountLoading) {
      setUser(accountData.address);
    } else setUser(undefined);
  }, [accountData]);

  // fetch nft
  const fetchNFT = async () => {
    const baseURL = `https://polygon-mumbai.g.alchemyapi.io/v2/${API_KEY}/getNFTs/`;
    var requestOptions = {
      method: "GET",
    };
    const fetchURL = `${baseURL}?owner=${user}&contractAddresses%5B%5D=${nftAddress}`;
    let response = await fetch(fetchURL, requestOptions);
    response = await response.json();
    return response;
  };
  useEffect(() => {
    if (user) {
      setLoadingNFT(true);
      fetchNFT()
        .then(data => {
          console.log(data.ownedNfts[0].metadata);
          setNFT(data.ownedNfts[0].metadata);
        })
        .catch(error => {
          console.log(error);
          setNFT(undefined);
        })
        .finally(() => {
          setLoadingNFT(false);
        });
    }
  }, [user]);

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
  useEffect(() => {
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
  }, []);

  return (
    <>
      <div className="h-full bg-gradient w-full flex items-center justify-center font-Inter text-white">
        {/* page container -> aprox 80% width.  */}
        <div className="h-full w-10/12 flex flex-col items-center">
          <nav className="h-20 w-full flex items-center justify-between relative border-b-[1px] border-[rgba(255,255,255,0.25)]">
            <h1 className="text-3xl font-medium">NFT-gated voting system 🦄🌌</h1>
            <ConnectButton />
          </nav>
          {/* Header displays Info and shows the user NFT. */}
          <Header user={user} NFT={NFT} loadingNFT={loadingNFT} />
          <main className="h-full w-full flex flex-col">
            <section className="w-full">
              <div className="flex justify-between items-center my-4">
                <h2 className="text-2xl font-medium">Projects being voted:</h2>
              </div>
              {!loadingOptions && options && (
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
                      </div>
                      <div className="h-full w-full flex items-center ">
                        <OptionsGroup
                          user={accountData?.address}
                          options={proposal.options}
                          ballotWithSigner={ballotsWithSigners[index]}
                        />
                        <Chart options={proposal.options} />
                      </div>
                    </article>
                  ))}
                </>
              )}
              {!loadingOptions && !options && <p>Error ocurred at fetching options</p>}
              {loadingOptions && <p>loading options...</p>}
            </section>
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Index;

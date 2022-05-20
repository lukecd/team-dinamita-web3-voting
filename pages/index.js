import React, { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import OptionsGroup from "/components/OptionsGroup.jsx";
import Chart from "../components/Chart.jsx";
import Verification from "../components/Verification";
import MyDialog from "../components/MyDialog";
import { proposalsData } from "../utils/proposals.js";
import { useAccount } from "wagmi";
import Informative from "../components/Informative.jsx";

const proposals = proposalsData;

const Index = () => {
  const account = useAccount();
  const { data, isError, isLoading } = account;

  const [user, setUser] = useState(undefined);
  const [isVerified, setIsVerified] = useState(false);
  const [userHasVoted, setUserHasVoted] = useState(false);
  const [loadingVerification, setLoadingVerification] = useState(true);

  useEffect(() => {
    console.log(account);
    if (data?.address) {
      setUser(data.address);
    } else {
      setUser(undefined);
    }
  }, [account]);

  const openModal = () => {
    setUserHasVoted(true);
  };

  const closeModal = () => {
    setUserHasVoted(false);
  };

  return (
    <>
      <div className="h-full bg-gradient w-full flex items-center justify-center font-Inter text-white">
        {/* page container -> aprox 80% width.  */}
        <div className="h-100 w-10/12 flex flex-col items-center">
          {userHasVoted && <MyDialog isOpen={userHasVoted} closeModal={closeModal} />}
          {/* navbar */}
          <nav className="h-20 w-full flex items-center justify-between relative border-b-[1px] border-[rgba(255,255,255,0.25)]">
            {/* justify-center */}
            <h1 className="text-3xl font-medium">NFT-gated Voting system</h1>
            <div className="">
              {/* absolute right-0 */}
              <ConnectButton />
            </div>
          </nav>

          <main className="h-full w-full flex flex-col items-center">
            <section className="w-full">
              <div className="flex justify-between items-center my-4">
                <h2 className="text-2xl font-medium">Projects being voted:</h2>
                {user && (
                  <Verification
                    user={user}
                    isVerified={isVerified}
                    setIsVerified={setIsVerified}
                    loadingVerification={loadingVerification}
                    setLoadingVerification={setLoadingVerification}
                  />
                )}
              </div>
              {proposals.map((proposal, index) => (
                <article
                  key={index}
                  className={`border-t-[1px] border-[rgba(255,255,255,0.25)] pt-6 2xl:pt-7 mb-8`}
                >
                  <h3 className="text-xl font-medium mb-3">
                    {proposal.id}# - {proposal.title}
                  </h3>
                  <div className="h-full w-full flex items-center ">
                    <OptionsGroup
                      user={user}
                      openModal={openModal}
                      options={proposal.options}
                      isVerified={isVerified}
                      loadingVerification={loadingVerification}
                    />
                    <Chart options={proposal.options} />
                  </div>
                </article>
              ))}
            </section>
          </main>
          <footer className="border-t-[1px] border-white/10 w-[100vw] h-[300px] box-border flex items-center justify-center">
            <div className="w-10/12 flex items-center justify-between">
              <Informative />
              <h1 className="border-2">hola</h1>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Index;

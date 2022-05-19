import React, { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import OptionsGroup from "/components/OptionsGroup.jsx";
import Chart from "../components/Chart.jsx";
import Verification from "../components/Verification";
import MyDialog from "../components/MyDialog";

const proposals = [
  {
    title: "Topic for the next hackaton",
    id: 1,
    timeEnd: 13213213,
    options: [
      {
        name: "optionName1",
        id: 1,
        description: "description of optionName1",
        votes: 2,
      },
      {
        name: "optionName2",
        id: 2,
        description: "description of optionName2",
        votes: 4,
      },
      {
        name: "optionName3",
        id: 3,
        description: "description of optionName3",
        votes: 6,
      },
    ],
  },
  {
    title: "Prizes for the next hackaton",
    id: 2,
    timeEnd: 1321321,
    options: [
      {
        name: "optionName1",
        id: 1,
        description: "description of optionName1",
        votes: 5,
      },
      {
        name: "optionName2",
        id: 2,
        description: "description of optionName2",
        votes: 8,
      },
      {
        name: "optionName3",
        id: 3,
        description: "description of optionName3",
        votes: 3,
      },
    ],
  },
];

const Index = () => {
  const [userHasVoted, setUserHasVoted] = useState(false);

  const handleVote = () => {
    setUserHasVoted(true);
  };

  return (
    <>
      <div className="h-full bg-gradient w-full flex items-center justify-center font-Inter text-white ">
        {userHasVoted && <MyDialog />}
        {/* {document && ReactDOM.createPortal(<MyDialog />, div)} */}
        {/* page container -> aprox 80% width.  */}
        <div className="h-100 w-10/12 flex flex-col items-center">
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
                <Verification />
              </div>
              {proposals.map((proposal, index) => (
                <article
                  key={index}
                  className={`border-t-[1px] border-[rgba(255,255,255,0.25)] pt-6 mb-8`}
                >
                  <h3 className="text-xl font-medium">
                    {proposal.id}# - {proposal.title}
                  </h3>
                  <div className=" h-full w-full flex items-center ">
                    <OptionsGroup
                      closeModal={handleVote}
                      options={proposal.options}
                    />
                    <Chart options={proposal.options} />
                  </div>
                </article>
              ))}
            </section>
          </main>
        </div>
      </div>
    </>
  );
};

export default Index;

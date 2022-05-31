import React, { useEffect, useMemo } from "react";
import Countdown from "react-countdown";
import { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { Tooltip } from "@nextui-org/react";
import { useRouter } from "next/router";

function OptionsGroup({ accountData, loadingAccount, options, ballotWithSigner, setVoteNotif }) {
  const router = useRouter();
  const [voteError, setVoteError] = useState(null);
  const [voting, setVoting] = useState(false);
  const [voted, setVoted] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isTimeLeft, setIsTimeLeft] = useState(true);
  const [time, setTime] = useState(0);

  const vote = async (optionID, contract) => {
    const data = await contract.vote(optionID, {
      gasLimit: 5999999,
    });
    console.log(data);
    let receipt = await data.wait();
    console.log(receipt);
    return receipt;
  };

  useEffect(() => {
    const countDownDate = new Date("May 31, 2022 16:45:00").getTime();
    const now = new Date().getTime();
    setTime(Date.now() + (countDownDate - now));
  }, []);

  const handleSelect = option => {
    if (accountData) {
      setSelected(option);
    }
  };

  const handleVote = async () => {
    if (accountData && selected) {
      setVoted(false);
      const selectedOption = await options.find(option => option.id === selected);
      setVoting(true);
      console.log(selectedOption.id - 1);
      vote(selectedOption.id - 1, ballotWithSigner)
        .then(result => {
          console.log(result);
          setVoted(true);
          setVoteNotif(Math.random() * 2);
          router.reload();
          setVoteError(null);
        })
        .catch(error => {
          console.log(error);
          setVoteError(error.reason);
        })
        .finally(() => {
          setVoting(false);
        });
    }
  };

  return (
    <div className={`w-full`}>
      <div className="mx-auto w-full max-w-md">
        <RadioGroup value={selected} onChange={handleSelect}>
          <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
          <div className="space-y-3">
            {options.map(option => (
              <RadioGroup.Option
                key={option.id}
                value={option.id}
                className={({ active, checked }) =>
                  `${active ? "" : ""}
                  ${
                    checked
                      ? "bg-[rgba(255,174,0,0.7)] border-[2px] border-[rgb(255,174,0)]/[1] drop-shadow-[0_0_5px_rgba(255,174,0,1)] text-white"
                      : "bg-white"
                  }
                    relative flex cursor-pointer rounded-lg px-5 py-3.5 shadow-md focus:outline-0`
                }
              >
                {({ active, checked }) => (
                  <>
                    <div className="flex w-full items-center justify-between ">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <RadioGroup.Label
                            as="span"
                            className={`font-medium text-base mb-2 flex ${
                              checked ? "text-white" : "text-gray-700"
                            }`}
                          >
                            <p className="mr-[16rem]">{option.name}</p>
                            <p>votes: {option.votes}</p>
                          </RadioGroup.Label>
                          <RadioGroup.Description
                            as="span"
                            className={`flex ${checked ? "text-sky-100" : "text-gray-900"}`}
                          >
                            <p className="">{option.description}</p>
                          </RadioGroup.Description>
                        </div>
                      </div>
                      {checked && (
                        <div className="shrink-0 text-white">
                          <CheckIcon className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
        <div className="flex justify-between mt-5">
          {isTimeLeft ? (
            <>
              {/* votation still going on */}
              <Tooltip
                shadow={true}
                placement="bottom"
                content={
                  accountData ? (
                    !voted ? (
                      !voting ? (
                        !voteError ? (
                          selected ? (
                            "Click to emit the vote!"
                          ) : (
                            "Select an option to emit a vote"
                          )
                        ) : (
                          "Error. check if you hold the nft or if you have already voted."
                        )
                      ) : (
                        "Voting on the blockchain..."
                      )
                    ) : (
                      <span className="flex items-center justify-center flex-col">
                        <p className="font-medium">Vote succesfully stored in the blockchain</p>
                        <p className="font-medium">
                          You NFT evolved, refresh metadata in OpenSea to see it.
                        </p>
                      </span>
                    )
                  ) : (
                    "Connect wallet to emit a vote."
                  )
                }
                css={{
                  borderRadius: "$sm",
                  padding: "$4 $8",
                  fontWeight: "$medium",
                }}
              >
                <button
                  onClick={() => handleVote()}
                  className="font-semibold w-48 py-2 rounded-lg cursor-pointer
                    bg-[rgba(255,174,0,0.7)] border-[2px] border-[rgb(255,174,0)]/[1] drop-shadow-[0_0_5px_rgba(255,174,0,1)]"
                >
                  {voted
                    ? "Voted!"
                    : voting
                    ? "Voting..."
                    : voteError
                    ? "Error. Try Again"
                    : "Vote"}
                </button>
              </Tooltip>
            </>
          ) : (
            // votation has ended => show winner
            <button
              disabled
              className="w-full cursor-default font-semibold py-2 rounded-lg border-[2px] border-[rgb(255,174,0)]/[1] drop-shadow-[0_0_5px_rgba(255,174,0,1)]"
            >
              VOTE HAS ENDED
            </button>
          )}

          {isTimeLeft && (
            <div className="cursor-default font-semibold py-2 w-[10.75rem] flex items-center justify-center rounded-lg drop-shadow-[0_0_5px_rgba(75,192,192,1)]">
              <p className="font-semibold">
                Time left:{" "}
                {time != 0 && <Countdown date={time} onComplete={() => setIsTimeLeft(false)} />}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(OptionsGroup);

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

import React, { useEffect } from "react";
import Countdown from "react-countdown";
import { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { Tooltip } from "@nextui-org/react";

export default function OptionsGroup({
  user,
  openModal,
  options,
  className,
  isVerified,
  loadingVerification,
  userHasVoted,
}) {
  const [selected, setSelected] = useState(null);
  const [isTimeLeft, setIsTimeLeft] = useState(true);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const countDownDate = new Date("May 22, 2022 23:59:59").getTime();
    const now = new Date().getTime();

    setTime(Date.now() + (countDownDate - now));
  }, []);

  const handleSelect = (option) => {
    if (user) {
      setSelected(option);
    }
  };

  const handleVote = () => {
    // to be able to vote the user has to be connected, be verified as a holder, and have a selected option.
    if (user && isVerified && selected) {
      openModal();
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="mx-auto w-full max-w-md">
        <RadioGroup value={selected} onChange={handleSelect}>
          <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
          <div className="space-y-3">
            {options.map((option) => (
              <RadioGroup.Option
                key={option.name}
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
                            as="p"
                            className={`font-medium text-base mb-1  ${
                              checked ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {option.name}
                          </RadioGroup.Label>
                          <RadioGroup.Description
                            as="span"
                            className={`inline ${
                              checked ? "text-sky-100" : "text-gray-500"
                            }`}
                          >
                            <span className="mr-8">{option.description}</span>
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
          {user && !loadingVerification && isVerified && (
            <>
              {isTimeLeft ? (
                // votation still going on
                <Tooltip
                  shadow={true}
                  placement="bottom"
                  content={selected ? "" : "Select an option to vote"}
                  css={{
                    borderRadius: "$sm",
                    padding: "$4 $8",
                    fontWeight: "$medium",
                  }}
                >
                  <button
                    disabled={userHasVoted}
                    onClick={handleVote}
                    className="font-semibold w-48 py-2 rounded-lg cursor-pointer
                    bg-[rgba(255,174,0,0.7)] border-[2px] border-[rgb(255,174,0)]/[1] drop-shadow-[0_0_5px_rgba(255,174,0,1)]"
                  >
                    {userHasVoted ? "You're already voted" : "Vote!"}
                  </button>
                </Tooltip>
              ) : (
                // votation has ended => show winner
                <button
                  disabled
                  className="w-full cursor-default font-semibold py-2 rounded-lg border-[2px] border-[rgb(255,174,0)]/[1] drop-shadow-[0_0_5px_rgba(255,174,0,1)]"
                >
                  VOTE HAS ENDED
                </button>
              )}
            </>
          )}
          {user && !loadingVerification && !isVerified && (
            <>
              {isTimeLeft ? (
                // votation still going on
                <Tooltip
                  shadow={true}
                  placement="bottom"
                  content={"You need to have the NFT to be able to vote."}
                  css={{
                    borderRadius: "$sm",
                    padding: "$4 $8",
                    fontWeight: "$medium",
                  }}
                >
                  <button
                    disabled={userHasVoted}
                    className="font-semibold w-48 py-2 rounded-lg
                    bg-[rgba(255,174,0,0.7)] border-[2px] border-[rgb(255,174,0)]/[1] drop-shadow-[0_0_5px_rgba(255,174,0,1)] cursor-pointer"
                  >
                    {userHasVoted ? "You're already voted" : "Vote!"}
                  </button>
                </Tooltip>
              ) : (
                //votation has finished
                <button
                  disabled
                  className="w-full cursor-default font-semibold py-2 rounded-lg border-[2px] border-[rgb(255,174,0)]/[1] drop-shadow-[0_0_5px_rgba(255,174,0,1)]"
                >
                  VOTE HAS ENDED
                </button>
              )}
            </>
          )}
          {user && loadingVerification && (
            <Tooltip
              shadow={true}
              placement="bottom"
              content={"Verifiyng in the blockchain if you have the NFT.."}
              css={{
                borderRadius: "$sm",
                padding: "$4 $8",
                fontWeight: "$medium",
              }}
            >
              <button
                className="cursor-default font-semibold w-36 py-2 rounded-lg
                bg-[rgba(255,174,0,0.7)] border-[2px] border-[rgb(255,174,0)]/[1] drop-shadow-[0_0_5px_rgba(255,174,0,1)]"
              >
                Loading...
              </button>
            </Tooltip>
          )}
          {!user && (
            <Tooltip
              shadow={true}
              placement="bottom"
              content={"Verifiyng in the blockchain if you have the NFT.."}
              css={{
                borderRadius: "$sm",
                padding: "$4 $8",
                fontWeight: "$medium",
              }}
            >
              <button
                className="cursor-default font-semibold w-36 py-2 rounded-lg
                bg-[rgba(255,174,0,0.7)] border-[2px] border-[rgb(255,174,0)]/[1] drop-shadow-[0_0_5px_rgba(255,174,0,1)]"
              >
                LOGIN
              </button>
            </Tooltip>
          )}
          {isTimeLeft && (
            <div className="cursor-default font-semibold py-2 w-[10.75rem] flex items-center justify-center rounded-lg drop-shadow-[0_0_5px_rgba(75,192,192,1)]">
              <p className="font-semibold">
                Time left:{" "}
                {time != 0 && (
                  <Countdown
                    date={time}
                    onComplete={() => setIsTimeLeft(false)}
                  />
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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

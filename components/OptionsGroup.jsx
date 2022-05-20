import React from "react";
import ReactDOM from "react-dom";
import Countdown from "react-countdown";
import { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { Tooltip } from "@nextui-org/react";

export default function OptionsGroup({
  user,
  closeModal,
  options,
  className,
  isVerified,
  loadingVerification,
}) {
  const [selected, setSelected] = useState(null);

  const handleSelect = option => {
    if (user) {
      setSelected(option);
    }
  };

  const handleVote = () => {
    // to be able to vote the user has to be connected, be verified as a holder, and have a selected option.
    if (user && isVerified && selected) {
      console.log(options[selected - 1]);
      alert(JSON.parse(selected));
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="mx-auto w-full max-w-md">
        <RadioGroup value={selected} onChange={handleSelect}>
          <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
          <div className="space-y-3">
            {options.map(option => (
              <RadioGroup.Option
                key={option.name}
                value={option.id}
                className={({ active, checked }) =>
                  `${
                    active
                      ? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300"
                      : ""
                  }
                  ${checked ? "bg-sky-900 bg-opacity-75 text-white" : "bg-white"}
                    relative flex cursor-pointer rounded-lg px-5 py-3.5 shadow-md focus:outline-none`
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
                            className={`inline ${checked ? "text-sky-100" : "text-gray-500"}`}
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
                onClick={handleVote}
                className={`font-semibold w-36 py-2 border-[2px] rounded-lg cursor-default
                      bg-[rgba(153,102,255,0.35)] border-[rgb(153,102,255)]/[1]
                      ${
                        selected &&
                        "!cursor-pointer hover:bg-[rgba(126,69,241,0.35)] hover:border-[rgb(127,63,255)]/[1]"
                      }`}
              >
                Vote!
              </button>
            </Tooltip>
          )}
          {user && !loadingVerification && !isVerified && (
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
                className="cursor-default font-semibold w-36 py-2 border-[2px] rounded-lg
                      bg-[rgba(153,102,255,0.35)] border-[rgb(153,102,255)]/[1]"
              >
                Vote!
              </button>
            </Tooltip>
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
                className="cursor-default font-semibold w-36 py-2 border-[2px] rounded-lg
                      bg-[rgba(153,102,255,0.35)] border-[rgb(153,102,255)]/[1]
                      hover:bg-[rgba(126,69,241,0.35)] hover:border-[rgb(127,63,255)]/[1]"
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
                className="cursor-default font-semibold w-36 py-2 border-[2px] rounded-lg
                      bg-[rgba(153,102,255,0.35)] border-[rgb(153,102,255)]/[1]
                      hover:bg-[rgba(126,69,241,0.35)] hover:border-[rgb(127,63,255)]/[1]"
              >
                Loading...
              </button>
            </Tooltip>
          )}
          <div className="cursor-default font-semibold py-2 w-[10.75rem] border-[2px] flex items-center justify-center rounded-lg bg-[rgba(63,234,234,0.5)] border-[rgb(75,192,192)]/[1]">
            <p className="font-semibold">Time left: {<Countdown date={Date.now() + 1000000} />}</p>
          </div>
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

import React from "react";
import ReactDOM from "react-dom";
import Countdown from "react-countdown";
import { useState } from "react";
import { RadioGroup } from "@headlessui/react";

export default function OptionsGroup({
  closeModal,
  options,
  className,
  isVerified,
  loadingVerification,
}) {
  const [selected, setSelected] = useState(options[0]);

  // console.log(options.find(option => option.id === selected))

  return (
    <div className={`w-full ${className}`}>
      <div className="mx-auto w-full max-w-md">
        <RadioGroup value={selected} onChange={setSelected}>
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
                            {/* <span>votes: {option.votes}</span> */}
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
          {!loadingVerification && isVerified && (
            <button
              onClick={() => {
                isVerified ? alert("vota dale") : alert("no podes vota");
              }}
              title="hola"
              className="font-semibold w-36 py-2 border-[2px] rounded-lg
                      bg-[rgba(153,102,255,0.35)] border-[rgb(153,102,255)]/[1]
                      hover:bg-[rgba(126,69,241,0.35)] hover:border-[rgb(127,63,255)]/[1]"
            >
              Vote!
            </button>
          )}
          {!loadingVerification && !isVerified && (
            <button
              title="hola"
              onClick={() => {
                isVerified ? alert("vota dale") : alert("no podes vota");
              }}
              className="font-semibold w-36 py-2 border-[2px] rounded-lg
                      bg-[rgba(153,102,255,0.35)] border-[rgb(153,102,255)]/[1]
                      hover:bg-[rgba(126,69,241,0.35)] hover:border-[rgb(127,63,255)]/[1]"
            >
              Vote!
            </button>
          )}
          {loadingVerification && (
            <button
              title="hola"
              onClick={() => {
                isVerified ? alert("vota dale") : alert("no podes vota");
              }}
              className="font-semibold w-36 py-2 border-[2px] rounded-lg
                      bg-[rgba(153,102,255,0.35)] border-[rgb(153,102,255)]/[1]
                      hover:bg-[rgba(126,69,241,0.35)] hover:border-[rgb(127,63,255)]/[1]"
            >
              Vote!
            </button>
          )}
          <div className="font-semibold py-2 px-4 border-[2px] rounded-lg bg-[rgba(63,234,234,0.5)]  border-[rgb(75,192,192)]/[1]">
            <p>Time left: {<Countdown date={Date.now() + 1000000} />}</p>
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

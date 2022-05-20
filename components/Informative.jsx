import { Disclosure, Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";
import { useRef } from "react";

const items = [
  {
    content:
      "The objetive is to enpower the members of a community allowing the active membe that holds an untransferable NFT to vote proposals.",
    label: "What is the objetive of this voting system?",
  },
  {
    content:
      "Yes. We made the smart contract flexible enought to be used by any NFT-gated community. You can also provide a list of different NFT's that allows voting.",
    label: "is this protocol escalable to be used with any NFT?",
  },
  {
    content:
      "We are using Next.js, Tailwind, wagmi, Rainbowkit and ethers.js for the frontend. The backend is completly made on Solidity.",
    label: "How is this build?",
  },
];

export default function Informative() {
  const buttonRefs = useRef([]);
  const openedRef = useRef(null);

  const clickRecent = index => {
    const clickedButton = buttonRefs.current[index];
    if (clickedButton === openedRef.current) {
      openedRef.current = null;
      return;
    }
    if (Boolean(openedRef.current?.getAttribute("data-value"))) {
      openedRef.current?.click();
    }
    openedRef.current = clickedButton;
  };

  return (
    <div className="">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-purple-700/20 border-[2px] border-purple-700/75 py-5">
        {items.map((item, idx) => (
          <Disclosure key={item.id} className="py-1 px-6">
            {({ open }) => (
              <div>
                <Disclosure.Button as="div">
                  <button
                    data-value={open}
                    ref={ref => {
                      buttonRefs.current[idx] = ref;
                    }}
                    onClick={() => clickRecent(idx)}
                    className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                  >
                    <span>{item.label}</span>
                    <ChevronUpIcon
                      className={`${open ? "rotate-180 transform" : ""} h-5 w-5 text-purple-500`}
                    />
                  </button>
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 pl-2 pt-3 pb-2 text-sm text-white">
                  {item.content}
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>
        ))}

    
      </div>
    </div>
  );
}

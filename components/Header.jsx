import React, { useEffect, useState } from "react";
// import WarningIcon from "../components/WarningIcon.jsx";
import MintNFT from "../components/MintNFT";
import { useContract, useSigner } from "wagmi";
import nAbi from "../smart-contracts/artifacts/contracts/Web3Citizen.sol/Web3Citizen.json";
import { Loading } from "@nextui-org/react";

const nftAbi = nAbi.abi;
const nftAddress = "0x4Eed0b565D57DB5D7A103Dc751104e03897cfcA0"; // nft contract

const Header = ({ accountData = undefined, loadingAccount = true, voteNotif }) => {
  const [votes, setVotes] = useState("");

  const [NFT, setNFT] = useState([]);
  const [loadingNFT, setLoadingNFT] = useState(true);

  const [mintingNft, setMintingNft] = useState(false);
  const [mintingNftError, setMintingNftError] = useState(null);
  const [minted, setMinted] = useState(false);

  const { data: signer, isError: isSignerError, isLoading: isSignerLoading } = useSigner();
  const nftWithSigner = useContract({
    addressOrName: nftAddress,
    contractInterface: nftAbi,
    signerOrProvider: signer,
  });

  // get user NFT.
  const fetchNFT = async () => {
    // console.log('fetching nft')
    const baseURL = `https://polygon-mumbai.g.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_API_KEY}/getNFTs/`;
    var requestOptions = {
      method: "GET",
    };
    console.log('refetching')
    const fetchURL = `${baseURL}?owner=${accountData.address}&contractAddresses%5B%5D=${nftAddress}&refreshCache=true`;
    let response = await fetch(fetchURL, requestOptions);
    response = await response.json();
    console.log(response)
    return response;
  };
  useEffect(() => {
    setLoadingNFT(true);
    fetchNFT()
      .then(data => {
        if (data.ownedNfts.length > 0) {
          setNFT(data.ownedNfts[0].metadata);
        } else {
          setNFT(undefined);
        }
      })
      .catch(error => {
        console.log(error);
        setNFT(undefined);
      })
      .finally(() => {
        setLoadingNFT(false);
      });
  }, [accountData, minted, voteNotif]);

  // get user vote count
  const getVoteCount = async contract => {
    const data = await contract.getVoteCount();
    const votes = await data.toNumber();
    return votes;
  };
  useEffect(() => {
    if (!loadingAccount && accountData && !isSignerLoading && signer && !isSignerError) {
      getVoteCount(nftWithSigner)
        .then(data => {
          // console.log("getVoteCount - has voted", data, "times");
          setVotes(data);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [signer]);

  // mint nft
  const mintNft = async () => {
    console.log("calling mint");
    const data = await nftWithSigner.mint({
      gasLimit: 5000000,
    });
    console.log("called mint");
    console.log(data);
    let receipt = await data.wait();
    console.log(receipt);
    return receipt;
  };

  const handleMintNft = () => {
    setMintingNft(true);
    mintNft()
      .then(result => {
        console.log("handleMintNft- successfull!", result);
        setMintingNftError(null);
        setMinted(true);
      })
      .catch(error => {
        console.log("handleMintNft - error ", error.reason);
        console.log(error);
        setMintingNftError(error.message);
      })
      .finally(() => {
        setMintingNft(false);
      });
  };

  return (
    <header className="w-full border-b-[1px] border-white/25 py-6 flex items-center">
      <div className="w-10/12">
        <h3 className="text-2xl 2xl:text-3xl font-medium mb-4 ">Intructions</h3>
        <p className="text-[1.15rem] 2xl:text-xl font-medium mb-1 2xl:mb-4">
          <span className="text-cyan-300">Claim our free NFT </span> to be part of the community and
          be able to vote on proposals.
        </p>
        <p className="text-[1.15rem] 2xl:text-xl font-medium mb-1 2xl:mb-4">
          Each time you vote <span className="text-cyan-300">your NFT will evolve</span>. Active
          members will have a greater NFT as their a proof-of-participation.
        </p>
        <p className="text-[1.15rem] 2xl:text-xl font-medium mb-1 2xl:mb-4">
          The nft evolution will take a while to be shown here.
        </p>
        <p className="text-[1.15rem] 2xl:text-xl font-medium mb-7 2xl:mb-9">
          You can see the evolution faster in{" "}
          <a
            className="text-cyan-300"
            target="_blank"
            rel="noreferrer"
            href={`https://testnets.opensea.io/${accountData?.address}`}
          >
            OpenSea
          </a>{" "}
          (refresh metadata)
        </p>
        {/* <span className="flex items-center mb-2">
          <span className="text-cyan-400 relative top-[1px]">
            <WarningIcon />
          </span>
          <p className="text-lg 2xl:text-xl text-cyan-400">
            We are facing a development UI error, if you dont see the available options to vote,
            connect and disconnect you wallet in the button from above. Thanks.
          </p>
        </span> */}
        <p className="text-[1.1rem] 2xl:text-[1.15rem] font-medium mb-4 2xl:mb-8">
          Claim free Mumbai $MATIC to use this dapp:{" "}
          <a className="text-cyan-400" href="https://faucet.polygon.technology/" target="_blank">
            https://faucet.polygon.technology/
          </a>
        </p>
      </div>
      <div className="w-3/12 2xl:w-2/12">
        {/* if the user is not connected, show nothing.  */}
        {accountData && !loadingAccount && !loadingNFT && NFT && (
          <div className="flex flex-col items-center bg-gray-800 rounded-xl shadow-xl overflow-hidden">
            <span className="text-center py-1 my-1.5">
              <p className="text-xl font-medium text-purple-100">{NFT.name}</p>
            </span>
            {/* <p className="text-purple-600 font-medium">{NFT.description}</p> */}
            <div className="w-full relative">
              <img className="bg-purple-700/20 rounded-b-xl" src={NFT.image} alt=""></img>
              {/* <span className="text-white bg-white/10 rounded-full px-3 py-1 absolute top-[10px] right-[10px] opacity-80 ">
                <span className="text-cyan-300">owned by you </span>
              </span> */}
              <span className="text-white bg-white/10 rounded-full px-3 py-1 absolute bottom-[10px] right-[10px] 2xl:bottom-[15px] 2xl:right-[15px] opacity-80">
                <span className="text-cyan-300">{votes} </span>
                votes
              </span>
            </div>
          </div>
        )}
        {accountData && !loadingAccount && !loadingNFT && !NFT && (
          <div className="w-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl pt-4 pb-8 shadow-[2px_2px_25px_rgba(1,1,1,0.3)]">
            <p className="text-lg font-medium mb-3">You are not a member yet.</p>
            <MintNFT
              minted={minted}
              setMinted={minted}
              mintingNft={mintingNft}
              setMintingNft={setMintingNft}
              mintingNftError={mintingNftError}
              setMintingNftError={setMintingNftError}
              handleMintNft={handleMintNft}
            />
          </div>
        )}
        {loadingNFT && (
          <div className="w-full h-full flex items-center justify-center">
            <Loading color="secondary" size="xl" />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

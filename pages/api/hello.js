useEffect(() => {
  let buyMeACoffee;
  isWalletConnected();
  getMemos();

  const onNewMemo = (from, timestamp, name, message) => {
    setMemos(prevState => [
      ...prevState,
      {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message: message,
        name: name,
      },
    ]);
  };

  const { ethereum } = window;

  // Listen for new memo events.
  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum, "any");
    const signer = provider.getSigner();
    buyMeACoffee = new ethers.Contract(contractAddress, contractABI, signer);

    buyMeACoffee.on("NewMemo", onNewMemo);
  }

  return () => {
    if (buyMeACoffee) {
      buyMeACoffee.off("NewMemo", onNewMemo);
    }
  };
}, []);

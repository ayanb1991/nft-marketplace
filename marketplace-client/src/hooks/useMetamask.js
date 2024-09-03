import { useState, useEffect } from "react";
import { ethers} from "ethers";

export const useMetaMask = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    checkMetaMaskConnection();
    // monitor account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);

      // Clean up the event listener when the component unmounts
      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      };
    }
  }, []);

  const checkMetaMaskConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);
      } catch (error) {
        console.error("Failed to connect to MetaMask:", error);
      }
    } else {
      console.log("Please install MetaMask!");
    }
  };

  const connectWallet = async () => {
    if (!provider) {
      console.log("Please install MetaMask!");
      return;
    }
    try {
      const accounts = await provider.send("eth_requestAccounts", []);
      const metaMaskAccount = accounts[0];
      console.log("metaMaskAccount", metaMaskAccount);
      setAccount(metaMaskAccount);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    } else {
      setAccount(null);
    }
  };

  

  return { account, provider, connectWallet };
};

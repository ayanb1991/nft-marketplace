import React, { useState, useEffect } from "react";
import { Button, Typography } from "@mui/material";
import { useMetaMask } from "../../hooks/useMetamask";
import { nftMarketPlaceAbi } from "../../utilities/abi";
import { connectToContract } from "../../utilities";
import { MarketplaceApi } from "../../api";
import { ethers } from "ethers";

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

const MyProfile = () => {
  const { account, provider: metamaskProvider, connectWallet } = useMetaMask();
  const [userBalance, set_userBalance] = useState(0);

  useEffect(() => {
    connectWallet();
  }, []);

  const rechargeMtoken = async (e) => {
    e.preventDefault();
    try {
      const metamaskSigner = await metamaskProvider.getSigner();
      const contract = await connectToContract(
        contractAddress,
        nftMarketPlaceAbi,
        metamaskSigner
      );

      const txHash = await contract.buyTokens({
        value: ethers.parseEther("0.5"),
      });
      console.log("txHash", txHash);
    } catch (e) {
      console.log("error", e);
    }
  };

  const getBalance = async (e) => {
    e.preventDefault();
    try {
      const txSigner = await metamaskProvider.getSigner();
      const contract = await connectToContract(
        contractAddress,
        nftMarketPlaceAbi,
        txSigner
      );
      const balance = await contract.getMTokenBalance(account);
      set_userBalance(parseInt(balance));
    } catch (e) {
      console.log("error", e);
    }
  };

  const getOwnedAssets = async (e) => {
    e.preventDefault();
    try {
      const assets = await MarketplaceApi.getOwnedAssets(account);
      console.log("my assets:", assets);
    } catch (e) {
      console.log("error", e);
    }
  };

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Your Profile
      </Typography>
      <Typography variant="h2" component="h1">
        MToken Balance: {userBalance}
      </Typography>
      <Typography variant="subtitle1" component="h1" gutterBottom>
        Connected Account: {account}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={rechargeMtoken}
      >
        Recharge MToken
      </Button>
    </div>
  );
};

export default MyProfile;

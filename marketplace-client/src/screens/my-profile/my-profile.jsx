import React, { useState, useEffect, useCallback, useContext } from "react";
import { Button, Typography } from "@mui/material";
import { useMetaMask } from "../../hooks/useMetamask";
import { nftMarketPlaceAbi } from "../../utilities/abi";
import { connectToContract, getLocalSigner } from "../../utilities";
import { ethers } from "ethers";
import { useAuth } from "../../context/auth.context";
import AlertContext from "../../context/alert.context";

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

const MyProfile = () => {
  const { provider: metamaskProvider, connectWallet } = useMetaMask();
  const [userBalance, set_userBalance] = useState(0);
  const { user } = useAuth();
  const { showAlert } = useContext(AlertContext);

  const rechargeMtoken = async (e) => {
    e.preventDefault();
    try {
      // we are preferring the logged in user's balance to be fetched, for other connected accounts, it should throw an error
      const preferredAddress = user.eoaAddress;
      const metamaskSigner = await metamaskProvider.getSigner(preferredAddress);
      const contract = await connectToContract(
        contractAddress,
        nftMarketPlaceAbi,
        metamaskSigner
      );

      const tx = await contract.buyTokens({
        value: ethers.parseEther("10"),
      });
      await tx.wait();
      console.log("txHash", tx);
      
      await getBalance(preferredAddress);
    } catch (e) {
      console.log("error", e);
      showAlert({
        message: e.message,
        severity: "error",
      });
    }
  };

  const getBalance = useCallback(async (account) => {
    try {
      const txSigner = await getLocalSigner();
      const contract = await connectToContract(
        contractAddress,
        nftMarketPlaceAbi,
        txSigner
      );
      const balance = await contract.getMTokenBalance(account);
      set_userBalance(parseInt(balance));
    } catch (e) {
      console.log("error", e);
      showAlert({
        message: e.message,
        severity: "error",
      });
    }
  }, []);

  useEffect(() => {
    if (metamaskProvider) {
      connectWallet();
    }
  }, [metamaskProvider, connectWallet]);

  useEffect(() => {
    if (user.eoaAddress) {
      getBalance(user.eoaAddress);
    }
  }, [user, getBalance]);

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Your Profile
      </Typography>
      <Typography variant="h2" component="h1">
        MToken Balance: {userBalance}
      </Typography>
      <Typography variant="subtitle1" component="h1" gutterBottom>
        Connected Account: {user.eoaAddress}
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

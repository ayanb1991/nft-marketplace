import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { useMetaMask } from "../../hooks/useMetamask";
import { nftMarketPlaceAbi } from "../../utilities/abi";
import { connectToContract } from "../../utilities";
import { MarketplaceApi } from "../../api";

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

const AssetListing = () => {
  const { provider: metamaskProvider, connectWallet } = useMetaMask();

  useEffect(() => {
    connectWallet();
  }, []);

  const getAllListedAssets = async (e) => {
    e.preventDefault();
    try {
      const assets = await MarketplaceApi.getListedAssets();
      console.log("assets:", assets);
    } catch (e) {
      console.log("error", e);
    }
  };

  const removeListing = async (e) => {
    e.preventDefault();
    try {
      const metamaskSigner = await metamaskProvider.getSigner();
      const contract = await connectToContract(
        contractAddress,
        nftMarketPlaceAbi,
        metamaskSigner
      );

      const res = await contract.removeAsset(10001);
      console.log("res:", res);
    } catch (e) {
      console.log("error", e);
    }
  };

  const buyAsset = async (e) => {
    e.preventDefault();
    try {
      const metamaskSigner = await metamaskProvider.getSigner();
      const contract = await connectToContract(
        contractAddress,
        nftMarketPlaceAbi,
        metamaskSigner
      );

      const res = await contract.transferAssetOwnership(10002);
      console.log("res:", res);
    } catch (e) {
      console.log("error", e);
    }
  };

  return (
    <div>
      <h1>Store</h1>
      <Button
        type="button"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        onClick={getAllListedAssets}
      >
        Store Listing
      </Button>
      <Button
        type="button"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        onClick={removeListing}
      >
        Remove Listing
      </Button>
      <Button
        type="button"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        onClick={buyAsset}
      >
        Buy 10001
      </Button>
    </div>
  );
};

export default AssetListing;

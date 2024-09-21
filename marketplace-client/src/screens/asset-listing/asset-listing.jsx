import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useMetaMask } from "../../hooks/useMetamask";
import { nftMarketPlaceAbi } from "../../utilities/abi";
import { connectToContract } from "../../utilities";
import { MarketplaceApi } from "../../api";
import {
  Typography,
  Box,
} from "@mui/material";
import NoContent from "../../components/no-content";
import AssetItem from "../../components/asset-item";
import AlertContext from "../../context/alert.context";

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

const AssetListing = () => {
  const { provider: metamaskProvider, connectWallet } = useMetaMask();
  const [listedAssets, set_listedAssets] = useState([]);
  const { showAlert } = useContext(AlertContext);
  const navigate = useNavigate();

  const getAllListedAssets = async () => {
    try {
      const res = await MarketplaceApi.getListedAssets();
      set_listedAssets(res.data);
    } catch (e) {
      console.log("error", e);
      showAlert({
        message: e.message,
        severity: "error",
      });
    }
  };

  const removeListing = async (assetId) => {
    try {
      const metamaskSigner = await metamaskProvider.getSigner();
      const contract = await connectToContract(
        contractAddress,
        nftMarketPlaceAbi,
        metamaskSigner
      );

      const res = await contract.removeAsset(assetId);
      console.log("res:", res);
    } catch (e) {
      console.log("error", e);
    }
  };

  const buyAsset = async (assetId) => {
    try {
      const metamaskSigner = await metamaskProvider.getSigner();
      const contract = await connectToContract(
        contractAddress,
        nftMarketPlaceAbi,
        metamaskSigner
      );

      const tx = await contract.transferAssetOwnership(assetId);
      await tx.wait();

      console.log("tx:", tx);
      showAlert({
        message: "Transaction successfull!",
        severity: "success",
      });
      // navigate to my-assets page
      navigate("/my-assets");

    } catch (e) {
      console.log("error", e);
      showAlert({
        message: e.message,
        severity: "error",
      });
    }
  };

  const assetActionHandler = (action, asset) => {
    switch (action) {
      case "remove":
        removeListing(asset?.tokenId);
        break;
      case "buy":
        buyAsset(asset?.tokenId);
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    if (metamaskProvider) {
      connectWallet();
    }
  }, [metamaskProvider, connectWallet]);

  useEffect(() => {
    getAllListedAssets();
  }, []);

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Fresh recommendations
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {listedAssets.length > 0 ? (
          listedAssets.map((asset) => (
            <AssetItem key={asset.id} asset={asset} onAction={assetActionHandler} />
          ))
        ) : (
          <NoContent message="No assets found" />
        )}
      </Box>
    </div>
  );
};

export default AssetListing;

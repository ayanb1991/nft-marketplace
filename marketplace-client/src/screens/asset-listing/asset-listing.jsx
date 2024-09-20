import React, { useEffect, useState } from "react";
import { useMetaMask } from "../../hooks/useMetamask";
import { nftMarketPlaceAbi } from "../../utilities/abi";
import { connectToContract } from "../../utilities";
import { MarketplaceApi } from "../../api";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
} from "@mui/material";
import NoContent from "../../components/no-content";

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

const AssetListing = () => {
  const { provider: metamaskProvider, connectWallet } = useMetaMask();
  const [listedAssets, set_listedAssets] = useState([]);

  const getAllListedAssets = async () => {
    try {
      const res = await MarketplaceApi.getListedAssets();
      set_listedAssets(res.data);
    } catch (e) {
      console.log("error", e);
    }
  };

  // const removeListing = async () => {
  //   try {
  //     const metamaskSigner = await metamaskProvider.getSigner();
  //     const contract = await connectToContract(
  //       contractAddress,
  //       nftMarketPlaceAbi,
  //       metamaskSigner
  //     );

  //     const res = await contract.removeAsset(10001);
  //     console.log("res:", res);
  //   } catch (e) {
  //     console.log("error", e);
  //   }
  // };

  const buyAsset = async () => {
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
        {listedAssets.length > 0 ? listedAssets.map((asset) => (
          <Card key={asset.id} sx={{ flexBasis: 300 }}>
            <CardMedia
              component="img"
              height="140"
              image={asset.image}
              alt={asset.name}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {asset.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {asset.subtitle}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "flex-end" }}>
              <Button size="small" onClick={buyAsset}>
                Buy
              </Button>
              </CardActions>
            </Card>
          )) : (
          <NoContent message="No assets found" />
        )}
      </Box>
    </div>
  );
};

export default AssetListing;

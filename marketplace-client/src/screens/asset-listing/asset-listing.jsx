import React, { useEffect } from "react";
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

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

const assets = [
  {
    id: 1,
    image: "https://picsum.photos/seed/picsum/200/300",
    title: "Asset 1",
    subtitle: "Subtitle 1",
  },
  {
    id: 2,
    image: "https://picsum.photos/seed/picsum/200/300",
    title: "Asset 2",
    subtitle: "Subtitle 2",
  },
];

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
      <Typography variant="h4" sx={{ mb: 2 }}>
        Fresh recommendations
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {assets.map((asset) => (
          <Card key={asset.id} sx={{ flexBasis: 300 }}>
            <CardMedia
              component="img"
              height="140"
              image={asset.image}
              alt={asset.title}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {asset.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {asset.subtitle}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "flex-end" }}>
              <Button size="small">Buy</Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </div>
  );
};

export default AssetListing;

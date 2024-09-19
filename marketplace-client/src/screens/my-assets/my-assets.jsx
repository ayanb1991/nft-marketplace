import React, { useEffect, useState } from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Box,
} from "@mui/material";
import { MarketplaceApi } from "../../api";
import { useMetaMask } from "../../hooks/useMetamask";

const MyAssets = () => {
  const { account, provider: metamaskProvider, connectWallet } = useMetaMask();
  const [myassets, set_myassets] = useState([]);

  const getOwnedAssets = async (account) => {
    try {
      const res = await MarketplaceApi.getOwnedAssets(account);
      set_myassets(res.data);
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
    getOwnedAssets(account);
  }, [account]);

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>
        My Assets
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {myassets.map((asset) => (
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
            </CardActions>
          </Card>
        ))}
      </Box>
    </div>
  );
};

export default MyAssets;

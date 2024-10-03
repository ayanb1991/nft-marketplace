import React, { Fragment, useEffect, useState } from "react";
import { Typography, Box, Button } from "@mui/material";
import { MarketplaceApi } from "../../api";
import { useMetaMask } from "../../hooks/useMetamask";
import NoContent from "../../components/no-content";
import AssetItem from "../../components/asset-item";
import { useNavigate } from "react-router-dom";

const MyAssets = () => {
  const { account, provider: metamaskProvider, connectWallet } = useMetaMask();
  const [myassets, set_myassets] = useState([]);
  const navigate = useNavigate();

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
    if (account) {
      getOwnedAssets(account);
    }
  }, [account]);

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>
        My Assets
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {myassets.length > 0 ? (
          myassets.map((asset) => (
            <AssetItem
              key={asset.id}
              asset={asset}
              actionRenders={() => {
                return (
                  <Fragment>
                    <Button
                      size="small"
                      sx={{ mr: 10 }}
                      onClick={() => navigate(`/asset/update/${asset.id}`)}
                    >
                      Put On Sale
                    </Button>
                  </Fragment>
                );
              }}
            />
          ))
        ) : (
          <NoContent message="No assets found" />
        )}
      </Box>
    </div>
  );
};

export default MyAssets;

import React, { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { Typography, Box, Button } from "@mui/material";
import { MarketplaceApi } from "../../api";
import { useMetaMask } from "../../hooks/useMetamask";
import NoContent from "../../components/no-content";
import { useNavigate } from "react-router-dom";
import AlertContext from "../../context/alert.context";
import MyAssetItem from "../../components/my-asset-item";

const MyAssets = () => {
  const { account, provider: metamaskProvider, connectWallet } = useMetaMask();
  const { showAlert } = useContext(AlertContext);
  const [myassets, set_myassets] = useState([]);
  const navigate = useNavigate();

  const getOwnedAssets = useCallback(async () => {
    try {
      if (!account) throw new Error("EOA account not found!");
      const res = await MarketplaceApi.getOwnedAssets(account);
      set_myassets(res.data);
    } catch (e) {
      console.log("error", e);
      showAlert({
        message: e.message,
        severity: "error",
      });
    }
  }, [account, showAlert]);

  useEffect(() => {
    if (metamaskProvider) {
      connectWallet();
    }
  }, [metamaskProvider, connectWallet]);

  useEffect(() => {
    if (account) {
      getOwnedAssets(account);
    }
  }, [account, getOwnedAssets]);

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>
        My Assets
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {myassets.length > 0 ? (
          myassets.map((asset) => (
            // TODO: put on sale will only work if the asset is not already on sale
            <MyAssetItem
              key={asset.tokenId}
              asset={asset}
              actionRenders={() => {
                return (
                  <Fragment>
                    <Button
                      size="small"
                      onClick={() => navigate(`/asset/update/${asset.tokenId}`)}
                    >
                      Put On Sale
                    </Button>
                    <Button
                      size="small"
                      onClick={() => navigate(`/asset/history/${asset.tokenId}`)}
                    >
                      History
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

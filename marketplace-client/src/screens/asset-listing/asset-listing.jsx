import React, { useEffect, useState, useContext, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useMetaMask } from "../../hooks/useMetamask";
import { nftMarketPlaceAbi } from "../../utilities/abi";
import { compareAddress, connectToContract } from "../../utilities";
import { MarketplaceApi } from "../../api";
import { Typography, Box, Button } from "@mui/material";
import NoContent from "../../components/no-content";
import AssetItem from "../../components/store-asset-item";
import AlertContext from "../../context/alert.context";
import { useAuth } from "../../context/auth.context";
import If from "../../components/if";

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

const AssetListing = () => {
  const { provider: metamaskProvider } = useMetaMask();
  const [listedAssets, set_listedAssets] = useState([]);
  const { showAlert } = useContext(AlertContext);
  const { user } = useAuth();

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
      const preferredAddress = user?.eoaAddress;
      const metamaskSigner = await metamaskProvider.getSigner(preferredAddress);
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
      const preferredAddress = user?.eoaAddress;
      const metamaskSigner = await metamaskProvider.getSigner(preferredAddress);
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
      navigate("/asset/owned");
    } catch (e) {
      console.log("error", e);
      showAlert({
        message: e.message,
        severity: "error",
      });
    }
  };

  useEffect(() => {
    getAllListedAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Fresh recommendations
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {listedAssets.length > 0 ? (
          listedAssets.map((asset) => {
            return (
              <AssetItem
                key={asset.tokenId}
                asset={asset}
                actionRenders={() => {
                  return (
                    <Fragment>
                      <If
                        condition={
                          !compareAddress(user?.eoaAddress, asset?.currentOwner)
                        }
                      >
                        <Button
                          size="small"
                          onClick={() => buyAsset(asset?.tokenId)}
                        >
                          Buy
                        </Button>
                      </If>
                      <If
                        condition={compareAddress(
                          user?.eoaAddress,
                          asset?.currentOwner
                        )}
                      >
                        <Button
                          size="small"
                          onClick={() => removeListing(asset?.tokenId)}
                        >
                          Remove
                        </Button>
                      </If>
                      <Button
                        size="small"
                        onClick={() =>
                          navigate(`/asset/history/${asset.tokenId}`)
                        }
                      >
                        History
                      </Button>
                    </Fragment>
                  );
                }}
              />
            );
          })
        ) : (
          <NoContent message="No assets found" />
        )}
      </Box>
    </div>
  );
};

export default AssetListing;

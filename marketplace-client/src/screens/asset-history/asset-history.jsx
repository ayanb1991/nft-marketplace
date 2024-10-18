import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import marketplaceApi from "../../api/marketplace.api";
import AlertContext from "../../context/alert.context";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";

const AssetHistory = () => {
  const { assetId } = useParams();
  const { showAlert } = useContext(AlertContext);
  const [ownershipHistory, set_ownershipHistory] = useState([]);
  const [currentOwner, set_currentOwner] = useState(null);

  const getAssetOwnershipHistory = async (assetId) => {
    try {
      const res = await marketplaceApi.getAssetOwnershipHistory(assetId);
      const { currentOwner, history } = res.data;
      console.log("ownershipHistory", history);
      set_ownershipHistory(history);
      set_currentOwner(currentOwner);
    } catch (error) {
      showAlert({
        message: error.message,
        severity: "error",
      });
    }
  };

  useEffect(() => {
    if (assetId) {
      getAssetOwnershipHistory(assetId);
    }
  }, []);

  const getNode = (transaction) => {
    return (
      <Card sx={{ maxWidth: 600, mb: 0 }}>
        <CardContent>
          <Typography
            gutterBottom
            sx={{ color: "text.secondary", fontSize: 14 }}
          >
            Owner: {transaction.fromOwner}
          </Typography>
          <Typography
            gutterBottom
            sx={{ color: "text.secondary", fontSize: 14 }}
          >
            To: {transaction.toOwner}
          </Typography>
          <Typography variant="body2">
            Transaction Hash: {transaction.transactionHash}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Asset Ownership History
      </Typography>
      <Box>
        <Card sx={{ maxWidth: 600 }}>
          <CardContent>
            <Typography
              gutterBottom
              sx={{ color: "text.secondary", fontSize: 14 }}
            >
              Start
            </Typography>
          </CardContent>
        </Card>
        <Box sx={{ borderLeft: "2px solid grey", height: "20px", ml: 1 }} />
        {ownershipHistory.map((transaction, index) => (
          <Box
            key={index}
            sx={{ display: "flex", flexDirection: "column", mb: 0 }}
          >
            {getNode(transaction)}
            {index < ownershipHistory.length - 1 && (
              <Box
                sx={{ borderLeft: "2px solid grey", height: "20px", ml: 1 }}
              />
            )}
          </Box>
        ))}
      </Box>
    </div>
  );
};

export default AssetHistory;

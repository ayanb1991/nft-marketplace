import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Typography,
  Grid2 as Grid,
  TextField,
  MenuItem,
  Box,
} from "@mui/material";
import { useMetaMask } from "../../hooks/useMetamask";
import { nftMarketPlaceAbi } from "../../utilities/abi";
import { connectToContract } from "../../utilities";
import { IPFSApi } from "../../api";
import { PhotoCamera } from "@mui/icons-material";
import AlertContext from "../../context/alert.context";
import marketplaceApi from "../../api/marketplace.api";

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

const CreateAsset = () => {
  const { provider: metamaskProvider, connectWallet } = useMetaMask();
  const { showAlert } = useContext(AlertContext);
  const navigate = useNavigate();
  const { assetId } = useParams();

  // check if this is an update action
  const isUpdateAction = !!assetId;

  const categories = ["Car", "Mobile", "Arts", "Stationary", "Electronics"];
  const [newAsset, set_newAsset] = useState({
    name: "",
    category: "",
    description: "",
    price: 0,
    imgUrl: "https://picsum.photos/seed/picsum/200/300",
  });

  useEffect(() => {
    if (isUpdateAction && assetId) {
      // fetch asset data
      fetchAssetDetails(assetId);
    }
  }, []);

  const fetchAssetDetails = async (assetId) => {
    try {
      const res = await marketplaceApi.getAssetById(assetId);
      const asset = res.data.asset;
      console.log("asset", asset);
    } catch (error) {
      showAlert({
        message: error.message,
        severity: "error",
      });
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    set_newAsset((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    set_newAsset({
      name: "",
      category: "",
      description: "",
      price: 0,
      imgUrl: null,
    });
  };

  const validateForm = () => {
    const { name, category, description, price, imgUrl } = newAsset;
    if (!name || !category || !description || !price || !imgUrl) {
      showAlert({
        message: "All fields are required",
        severity: "error",
      });
      return false;
    }

    return true;
  };

  const handleCreateAsset = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    await connectWallet();
    await createAsset(e);
  };

  const createAsset = async () => {
    try {
      const metamaskSigner = await metamaskProvider.getSigner();
      const contract = await connectToContract(
        contractAddress,
        nftMarketPlaceAbi,
        metamaskSigner
      );
      // save data to ipfs and obtain url
      const ipfsURI = (await IPFSApi.createItem(newAsset)).data?.path;
      console.log("ipfsURI", ipfsURI);

      if (!ipfsURI) throw new Error("failed to obtain ipfs url");

      const tx = await contract.createAsset(
        parseInt(newAsset.price),
        ipfsURI
      );
      await tx.wait();

      showAlert({
        message: "Asset created successfully",
        severity: "success",
      });
      // refresh the form
      resetForm();
      navigate("/asset/listing");
    } catch (e) {
      console.log("error", e);
      showAlert({
        message: e.message,
        severity: "error",
      });
    }
  };

  const relistAsset = async (e) => {
    try {
      if (!validateForm()) return;

      await connectWallet();
      const metamaskSigner = await metamaskProvider.getSigner();
      const contract = await connectToContract(
        contractAddress,
        nftMarketPlaceAbi,
        metamaskSigner
      );
      // save data to ipfs and obtain url
      const ipfsURI = (await IPFSApi.createItem(newAsset)).data?.path;
      console.log("ipfsURI", ipfsURI);

      if (!ipfsURI) throw new Error("failed to obtain ipfs url");

      const tx = await contract.reListAsset(
        assetId,
        parseInt(newAsset.price),
        ipfsURI
      );
      await tx.wait();

      showAlert({
        message: "Asset posted to store successfully",
        severity: "success",
      });
      // refresh the form
      resetForm();
      navigate("/asset/listing");
    } catch (e) {
      console.log("error", e);
      showAlert({
        message: e.message,
        severity: "error",
      });
    }
  };

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {isUpdateAction ? "Update Asset" : "Create New Asset"}
      </Typography>
      <Grid container spacing={2}>
        <Grid size={6}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            border="2px dashed"
            borderColor={"grey.500"}
            borderRadius="4px"
            height="100%"
            onClick={() => document.getElementById("fileInput").click()}
            sx={{ cursor: "pointer" }}
          >
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={(e) => console.log(e.target.files[0])}
            />
            <PhotoCamera fontSize="large" />
          </Box>
        </Grid>
        <Grid size={6}>
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            margin="normal"
            sx={{ mt: 0 }}
            name="name"
            value={newAsset.name}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            select
            label="Category"
            name="category"
            variant="outlined"
            margin="normal"
            value={newAsset.category}
            onChange={handleInputChange}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            margin="normal"
            multiline
            rows={4}
            name="description"
            value={newAsset.description}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            label="Price"
            variant="outlined"
            margin="normal"
            type="number"
            name="price"
            value={newAsset.price}
            onChange={handleInputChange}
          />
          {!isUpdateAction ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateAsset}
            >
              Create Asset
            </Button>
          ) : null}
          {isUpdateAction ? (
            <Button variant="contained" color="primary" onClick={relistAsset}>
              Put On Store
            </Button>
          ) : null}
        </Grid>
      </Grid>
    </div>
  );
};

export default CreateAsset;

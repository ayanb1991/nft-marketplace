import React, { useEffect } from "react";
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

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

const CreateAsset = () => {
  const { provider: metamaskProvider, connectWallet } = useMetaMask();
  const categories = ["Car", "Mobile", "Arts"];

  useEffect(() => {
    connectWallet();
  }, []);

  const createAsset = async (e) => {
    e.preventDefault();
    try {
      const metamaskSigner = await metamaskProvider.getSigner();
      const contract = await connectToContract(
        contractAddress,
        nftMarketPlaceAbi,
        metamaskSigner
      );
      // save data to ipfs and obtain url
      const price = 5;
      const newAsset = {
        name: "My Old Laptop",
        description: "Item description",
        imgUrl: "https://picsum.photos/200/300",
      };
      const ipfsURI = (await IPFSApi.createItem(newAsset)).data?.path;
      console.log("ipfsURI", ipfsURI);

      if (!ipfsURI) throw new Error("failed to obtain ipfs url");

      const txHash = await contract.createAsset(price, ipfsURI);
      console.log("txHash", txHash);
    } catch (e) {
      console.log("error", e);
    }
  };

  return (
    <div>
      <Typography variant="h4" sx={{mb: 2}}>Create new assets</Typography>
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
            sx={{mt: 0}}
          />
          <TextField
            fullWidth
            select
            label="Category"
            variant="outlined"
            margin="normal"
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
          />
          <TextField
            fullWidth
            label="Price"
            variant="outlined"
            margin="normal"
            type="number"
          />
          <Button variant="contained" color="primary" onClick={createAsset}>
            Create Asset
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default CreateAsset;

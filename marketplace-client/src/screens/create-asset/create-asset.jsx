import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { useMetaMask } from "../../hooks/useMetamask";
import { nftMarketPlaceAbi } from "../../utilities/abi";
import { connectToContract } from "../../utilities";
import { IPFSApi } from "../../api";

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

const CreateAsset = () => {
  const { provider: metamaskProvider, connectWallet } = useMetaMask();

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
      <h1>Create new assets</h1>
      <Button
        type="button"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        onClick={createAsset}
      >
        Create Asset
      </Button>
    </div>
  );
};

export default CreateAsset;

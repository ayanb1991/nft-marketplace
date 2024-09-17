import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { TextField, Button, Container, Box, Typography } from '@mui/material';
import { Person, Lock } from '@mui/icons-material';
import { useMetaMask } from '../../hooks/useMetamask';
import { nftMarketPlaceAbi } from '../../utilities/abi';
import { connectToContract, getLocalSigner } from '../../utilities';
import {IPFSApi, MarketplaceApi} from "../../api";
import { ethers } from 'ethers';

// const ipfsURI = "ipfs://QmXyNMhV8bQFp6wzoVpkz3NqDi7Fj72Deg7KphAuHP6Dod";
// TODO: load contract address from .env
const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userBalance, set_userBalance] = useState(0);
  const { account, provider:metamaskProvider, connectWallet } = useMetaMask();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login submitted', { username, password });
  };

  const createAsset = async (e) => {
    e.preventDefault();
    try {
      const metamaskSigner = await metamaskProvider.getSigner();
      const contract = await connectToContract(contractAddress, nftMarketPlaceAbi, metamaskSigner);
      // save data to ipfs and obtain url
      const price = 5;
      const newAsset = {
        name: "My Old Laptop",
        description: "Item description",
        imgUrl: "https://picsum.photos/200/300",
      }
      const ipfsURI = (await IPFSApi.createItem(newAsset)).data?.path;
      console.log("ipfsURI", ipfsURI);

      if (!ipfsURI) throw new Error("failed to obtain ipfs url");

      const txHash = await contract.createAsset(price, ipfsURI);
      console.log("txHash", txHash);
    } catch (e) {
      console.log("error", e);
    }
  };

  const buyAsset = async (e) => {
    e.preventDefault();
    try {
      const metamaskSigner = await metamaskProvider.getSigner();
      const contract = await connectToContract(contractAddress, nftMarketPlaceAbi, metamaskSigner);

      const res = await contract.transferAssetOwnership(10002);
      console.log("res:", res)

    } catch (e) {
      console.log("error", e);
    }
  }

  const removeListing = async (e) => {
    e.preventDefault();
    try {
      const metamaskSigner = await metamaskProvider.getSigner();
      const contract = await connectToContract(contractAddress, nftMarketPlaceAbi, metamaskSigner);

      const res = await contract.removeAsset(10001);
      console.log("res:", res)

    } catch (e) {
      console.log("error", e);
    }
  }

  const generateMtoken = async (e) => {
    e.preventDefault();
    try {
      // here runner or signer is contract deployer from hardhat predefined accounts
      const localSigner = await getLocalSigner();
      const contract = await connectToContract(contractAddress, nftMarketPlaceAbi, localSigner);
      const txHash = await contract.generateMTOKENS(account, 100);
      console.log("txHash", txHash);
    } catch (e) {
      console.log("error", e);
    }
  };

  const rechargeMtoken = async (e) => {
    e.preventDefault();
    try {
      const metamaskSigner = await metamaskProvider.getSigner();
      const contract = await connectToContract(contractAddress, nftMarketPlaceAbi, metamaskSigner);

      const txHash = await contract.buyTokens({ value: ethers.parseEther("0.5") });
      console.log("txHash", txHash);
    } catch (e) {
      console.log("error", e);
    }
  };

  const getBalance = async (e) => {
    e.preventDefault();
    try {
      const txSigner = await metamaskProvider.getSigner();
      const contract = await connectToContract(contractAddress, nftMarketPlaceAbi, txSigner);
      const balance = await contract.getMTokenBalance(account);
      set_userBalance(parseInt(balance));
    } catch (e) {
      console.log("error", e);
    }
  };

  const getAllListedAssets = async (e) => {
    e.preventDefault();
    try {
      const assets = await MarketplaceApi.getListedAssets();
      console.log("assets:", assets);
    } catch (e) {
      console.log("error", e);
    }
  }

  const getOwnedAssets = async (e) => {
    e.preventDefault();
    try {
      const assets = await MarketplaceApi.getOwnedAssets(account);
      console.log("my assets:", assets);
    } catch (e) {
      console.log("error", e);
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          User Balance: {userBalance}
        </Typography>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              startAdornment: <Person sx={{ color: 'action.active', mr: 1, my: 0.5 }} />,
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: <Lock sx={{ color: 'action.active', mr: 1, my: 0.5 }} />,
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit}
          >
            Login
          </Button>
          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={connectWallet}
          >
            Connect Wallet
          </Button>
          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={createAsset}
          >
            Create Asset
          </Button>
          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={generateMtoken}
          >
            Generate 100 MTOKENS
          </Button>
          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={rechargeMtoken}
          >
            Recharge
          </Button>
          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={getBalance}
          >
            Get Balance
          </Button>
          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={getOwnedAssets}
          >
            My Assets
          </Button>
          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={getAllListedAssets}
          >
            Store Listing
          </Button>
          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={buyAsset}
          >
            Buy 10001
          </Button>
          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={removeListing}
          >
            Remove Listing
          </Button>
        </Box>
        <Box>
          <Typography variant="body2">
            Do not have an account?{" "}
            <Link to="/signup">
              Signup
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
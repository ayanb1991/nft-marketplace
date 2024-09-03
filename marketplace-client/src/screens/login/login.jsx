import React, { useState } from 'react';
import { TextField, Button, Container, Box, Typography } from '@mui/material';
import { Person, Lock } from '@mui/icons-material';
import { useMetaMask } from '../../hooks/useMetamask';
import { nftMarketPlaceAbi } from '../../utilities/abi';
import { connectToContract, getLocalSigner } from '../../utilities';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { account, provider:metamaskProvider, connectWallet } = useMetaMask();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login submitted', { username, password });
  };

  const createAsset = async (e) => {
    e.preventDefault();
    const price = 5;
    const ipfsURI = "ipfs://QmXyNMhV8bQFp6wzoVpkz3NqDi7Fj72Deg7KphAuHP6Dod";
    const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    console.log("contractAddress", contractAddress);

    try {
      // const metamaskSigner = await metamaskProvider.getSigner();
      const localSigner = await getLocalSigner();
      const contract = await connectToContract(contractAddress, nftMarketPlaceAbi, localSigner);
      const txHash = await contract.createAsset(price, ipfsURI);
      console.log("txHash", txHash);
    } catch (e) {
      console.log("error", e);
    }
  };

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
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Typography, TextField, Button, Box } from "@mui/material";
import { useMetaMask } from "../../hooks/useMetamask";
import { nftMarketPlaceAbi } from "../../utilities/abi";
import { connectToContract, getLocalSigner } from "../../utilities";

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

const Signup = () => {
  const { account, connectWallet } = useMetaMask();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    connectWallet();
  }, []);

  const generateMtoken = async () => {
    try {
      // here runner or signer is contract deployer from hardhat predefined accounts
      const localSigner = await getLocalSigner();
      const contract = await connectToContract(
        contractAddress,
        nftMarketPlaceAbi,
        localSigner
      );
      const txHash = await contract.generateMTOKENS(account, 100);
      console.log("txHash", txHash);
    } catch (e) {
      console.log("error", e);
    }
  };

  const handleSignup = async () => {
    // Handle signup logic here
    await generateMtoken();
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Signup
        </Typography>
        <TextField
          label="Fullname"
          fullWidth
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Password"
          fullWidth
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3, mb: 2 }}
          onClick={handleSignup}
        >
          Signup
        </Button>
        <Box>
          <Typography variant="body2">
            Already have an account? <Link to="/login">Login</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Signup;

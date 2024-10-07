import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { TextField, Button, Container, Box, Typography } from '@mui/material';
import { Person, Lock } from '@mui/icons-material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../utilities/firebase';
import { useAuth } from '../../context/auth.context';

const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  if (user) {
    navigate('/asset/listing');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Login submitted', { username, password });
      const loginRes = await signInWithEmailAndPassword(auth, username, password);
      console.log('loginRes', loginRes);
      // redirect to '/store' after successful login
      navigate('/asset/listing');
    } catch (error) {
      console.error("Error signing in:", error.message);
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
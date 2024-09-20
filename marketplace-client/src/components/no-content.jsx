import React from 'react';
import { Box, Typography } from '@mui/material';
import { SentimentDissatisfied } from '@mui/icons-material';

const NoContent = ({ message }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      width="100%"
      height="400px"
      padding={4}
      border="1px solid #e0e0e0"
      borderRadius="8px"
    >
      <SentimentDissatisfied sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h6" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

NoContent.defaultProps = {
  message: "There's no content here...",
};

export default NoContent;

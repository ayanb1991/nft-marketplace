import React from "react";
import { Container, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const ErrorPage = ({ title, message }) => {
  const errorTitle = title || "Error!";
  const errorMessage = message || "Oops! Something went wrong.";

  return (
    <Container style={{ textAlign: "center", marginTop: "20vh" }}>
      <ErrorOutlineIcon style={{ fontSize: 100, color: "red" }} />
      <Typography variant="h4" gutterBottom>
        {errorTitle}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {errorMessage}
      </Typography>
    </Container>
  );
};

export default ErrorPage;

import React from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
} from "@mui/material";

const assets = [
  {
    id: 1,
    image: "https://picsum.photos/seed/picsum/200/300",
    title: "Asset 1",
    subtitle: "Subtitle 1",
  },
  {
    id: 2,
    image: "https://picsum.photos/seed/picsum/200/300",
    title: "Asset 2",
    subtitle: "Subtitle 2",
  },
];

const MyAssets = () => {
  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>
        My Assets
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {assets.map((asset) => (
          <Card key={asset.id} sx={{ flexBasis: 300 }}>
            <CardMedia
              component="img"
              height="140"
              image={asset.image}
              alt={asset.title}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {asset.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {asset.subtitle}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "flex-end" }}>
              <Button size="small">Buy</Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </div>
  );
};

export default MyAssets;

import React from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

const AssetItem = (props) => {
  const { asset, actionRenders } = props;
  return (
    <Card key={asset.id} sx={{ flexBasis: 300 }}>
      <CardMedia
        component="img"
        height="140"
        image={`${process.env.PUBLIC_URL}/used-laptop.jpg`}
        alt={asset?.name}
      />
      <CardContent>
        <Typography gutterBottom variant="body2" component="div">
          {asset?.name}
        </Typography>
        <Typography gutterBottom variant="h6" component="div">
          {asset?.price} MTOKEN
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {asset?.description}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end" }}>
        {actionRenders && actionRenders(asset)}
      </CardActions>
    </Card>
  );
};

AssetItem.defaultProps = {
  asset: {},
  actionRenders: () => null,
};

export default AssetItem;

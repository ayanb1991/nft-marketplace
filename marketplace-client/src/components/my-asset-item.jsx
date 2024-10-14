import React from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

const MyAssetItem = (props) => {
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

MyAssetItem.defaultProps = {
  asset: {},
  actionRenders: () => null,
};

export default MyAssetItem;

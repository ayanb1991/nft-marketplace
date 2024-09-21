import React from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";

const AssetItem = (props) => {
  const { asset, onAction, showActions } = props;
  return (
    <Card key={asset.id} sx={{ flexBasis: 300 }}>
      <CardMedia
        component="img"
        height="140"
        image={asset?.imgUrl}
        alt={asset?.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {asset?.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {asset?.description}
        </Typography>
      </CardContent>
      {showActions ? (
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button size="small" onClick={() => onAction("buy", asset)}>
            Buy
          </Button>
        </CardActions>
      ) : null}
    </Card>
  );
};

AssetItem.defaultProps = {
  showActions: true,
  asset: {},
  onAction: () => {},
};

export default AssetItem;

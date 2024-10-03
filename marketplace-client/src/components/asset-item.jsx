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

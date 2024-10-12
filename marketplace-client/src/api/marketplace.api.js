import axiosInstance from "./axios";

const marketplaceApi = {
  getAssetById: (assetId) => axiosInstance.get(`/asset/${assetId}`),

  getListedAssets: () => axiosInstance.get(`/asset/listed`),

  getOwnedAssets: (ownerAddress) => axiosInstance.get(`/asset/owned/${ownerAddress}`),

  getAssetOwnershipHistory: (assetId) => axiosInstance.get(`/asset/history/${assetId}`),
};

export default marketplaceApi;

import axiosInstance from "./axios";

const marketplaceApi = {
  createAsset: (assetData) => axiosInstance.post(`/asset`, assetData),
  
  getAssetById: (assetId) => axiosInstance.get(`/asset/${assetId}`),
  
  getListedAssets: () => axiosInstance.get(`/asset/listed`),
  
  getOwnedItems: () => axiosInstance.get(`/asset/owned`),
  
  removeAsset: (assetId) => axiosInstance.delete(`/asset/${assetId}`),
  
  transferAssetOwnership: (assetId, transferData) => 
    axiosInstance.post(`/asset/transfer/${assetId}`, transferData),
  
  buyMTokens: (tokenData) => axiosInstance.post(`/mtoken/buy`, tokenData),
};

export default marketplaceApi;

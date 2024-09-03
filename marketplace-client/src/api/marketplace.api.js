import axiosInstance from "./axios";

const marketplaceApi = {
  // Blockchain write operation, TX will be generated and sent to API
  createAsset: (assetData) => axiosInstance.post(`/asset`, assetData),
  
  getAssetById: (assetId) => axiosInstance.get(`/asset/${assetId}`),
  
  getListedAssets: () => axiosInstance.get(`/asset/listed`),
  
  getOwnedItems: () => axiosInstance.get(`/asset/owned`),
  
  // Blockchain write operation, TX will be generated and sent to API
  removeAsset: (assetId) => axiosInstance.delete(`/asset/${assetId}`),
  
  // Blockchain write operation, TX will be generated and sent to API
  transferAssetOwnership: (assetId, transferData) => 
    axiosInstance.post(`/asset/transfer/${assetId}`, transferData),
};

export default marketplaceApi;

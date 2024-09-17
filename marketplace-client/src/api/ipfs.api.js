import axiosInstance from "./axios";

const ipfsAPI = {
  createItem: (data) => axiosInstance.post(`/ipfs`, data),
};

export default ipfsAPI;

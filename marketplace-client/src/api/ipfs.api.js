import { axiosInstance_IPFS } from "./axios";

const ipfsAPI = {
  createItem: (data) => axiosInstance_IPFS.post(`/ipfs`, data),
};

export default ipfsAPI;

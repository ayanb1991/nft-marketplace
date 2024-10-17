import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const IPFS_BASE_URL = process.env.REACT_APP_IPFS_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

export const axiosInstance_IPFS = axios.create({
  baseURL: IPFS_BASE_URL,
});

export default axiosInstance;
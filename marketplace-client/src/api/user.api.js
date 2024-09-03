import axiosInstance from "./axios";

const userApi = {
  // Blockchain write operation, but will use contract deployer address
  signup: (userData) => axiosInstance.post(`/user/signup`, userData),

  logout: () => axiosInstance.post(`/user/logout`),

  getBalance: () => axiosInstance.get(`/user/balance`),

  // Blockchain write operation, TX will be generated and sent to API
  recharge: (amount) => axiosInstance.post(`/user/recharge`, { amount }),
};

export default userApi;

import axiosInstance from "./axios";

const userApi = {
  // Blockchain write operation, but will use contract deployer address
  signup: (userData) => axiosInstance.post(`/user/signup`, userData),

  logout: () => axiosInstance.post(`/user/logout`),

  getBalance: () => axiosInstance.get(`/user/balance`),

};

export default userApi;

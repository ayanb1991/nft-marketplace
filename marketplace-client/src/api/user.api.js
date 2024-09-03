import axiosInstance from "./axios";

const userApi = {
  signup: (userData) => axiosInstance.post(`/user/signup`, userData),

  logout: () => axiosInstance.post(`/user/logout`),

  getBalance: () => axiosInstance.get(`/user/balance`),

  recharge: (amount) => axiosInstance.post(`/user/recharge`, { amount }),
};

export default userApi;

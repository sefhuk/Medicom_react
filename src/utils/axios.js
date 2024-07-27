import axios, { request } from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL
  // headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axiosInstance.get('/refresh-token');
        const newToken = data.token;
        localStorage.setItem('token', newToken);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (e) {
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export const userLogin = async (email, password) => {
    try{
      const response = await axiosInstance.post('/login', {email, password});
      const token = response.headers['authorization'];
      const userId = response.data.userId;
      localStorage.setItem('token', token);
      axiosInstance.defaults.headers.common['Authorization'] = `${token}`;
      return { token, userId };
    } catch (error)
    {
      throw error;
    }
};





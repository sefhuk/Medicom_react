import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL
  // headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});
export const userLogin = async (email, password) => {
    try{
      const response = await axiosInstance.post('/login', {email, password});
      const token = response.headers['authorization'];
      localStorage.setItem('token', token);
      axiosInstance.defaults.headers.common['Authorization'] = `${token}`;
      return response.data;
    } catch (error)
    {
      throw error;
    }
};




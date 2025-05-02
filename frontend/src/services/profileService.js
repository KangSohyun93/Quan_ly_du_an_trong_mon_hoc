import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

export const fetchUserProfile = async (userId) => {
  const response = await axios.get(`${API_URL}/${userId}`);
  return response.data;
};

export const updateUserProfile = async (userId, data) => {
  const response = await axios.put(`${API_URL}/${userId}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const changePassword = async (userId, passwordData) => {
  const response = await axios.post(`${API_URL}/${userId}/change-password`, passwordData);
  return response.data;
};
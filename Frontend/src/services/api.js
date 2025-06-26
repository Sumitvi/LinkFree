import axios from 'axios';

// const API_BASE_URL = 'http://localhost:8080/api';

export const getUserLinks = async (username) => {
  try {
    const res = await axios.get(`http://localhost:8080/api/links/${username}`);
    return res.data;
  } catch (err) {
    console.error("API error:", err);
    return [];
  }
};




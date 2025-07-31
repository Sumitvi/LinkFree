import axios from 'axios';

const API_BASE_URL = 'https://linkfree-huz0.onrender.com';
axios.defaults.withCredentials = true;

// ✅ Set default headers when token is available
const setAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// Call once on load
setAuthHeader();

// Call this after Google login too if needed
export const refreshAuthHeader = () => {
  setAuthHeader();
};

// ===================== API CALLS =======================

export const getUserLinks = async (username) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/links/${username}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching user links:", err);
    throw err;
  }
};

export const getLinkAnalytics = async (linkId) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/links/${linkId}/analytics`);
    return res.data;
  } catch (err) {
    console.error("Error fetching link analytics:", err);
    return 0;
  }
};

export const getUserInfo = async (username) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/users/${username}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching user info:", err);
    throw err;
  }
};

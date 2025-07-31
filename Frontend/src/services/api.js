import axios from 'axios';

export const API_BASE_URL = "https://linkfree-huz0.onrender.com";
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

// ✅ Get user links
export const getUserLinks = async (username) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/links/${username}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching user links:", err);
    throw err;
  }
};

// ✅ Get analytics for a specific link
export const getLinkAnalytics = async (linkId) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/links/${linkId}/analytics`);
    return res.data;
  } catch (err) {
    console.error("Error fetching link analytics:", err);
    return 0;
  }
};

// ✅ Get user profile info
export const getUserInfo = async (username) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/users/${username}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching user info:", err);
    throw err;
  }
};

// ✅ (Optional) Get click summary for dashboard
export const getClickSummary = async (username) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/links/clicks-summary/${username}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching click summary:", err);
    throw err;
  }
};

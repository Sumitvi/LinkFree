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

export const getLinkAnalytics = async (linkId) => {
  const res = await fetch(`http://localhost:8080/api/links/${linkId}/analytics`);
  if (!res.ok) throw new Error("Failed to fetch analytics");
  return await res.json(); // returns number
};






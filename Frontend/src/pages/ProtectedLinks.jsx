import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProtectedLinks = () => {
  const [links, setLinks] = useState([]);
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchLinks = async () => {
      const res = await axios.get(`http://localhost:8080/api/links/${username}`);
      setLinks(res.data);
    };
    fetchLinks();
  }, [username]);

  const handlePasswordUpdate = async (id, password) => {
    try {
      await axios.put(`http://localhost:8080/api/links/${id}/password`, { password });
      alert("Password updated!");
    } catch (err) {
      console.error("Error updating password", err);
      alert("Failed to update password.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">🔐 Password Protected Links</h2>
      {links.length === 0 ? <p>No links found.</p> :
        links.map(link => (
          <div key={link.id} className="mb-4 border-b pb-3">
            <p><strong>Title:</strong> {link.title}</p>
            <p><strong>URL:</strong> {link.url}</p>
            <form onSubmit={(e) => {
              e.preventDefault();
              const newPass = e.target.password.value;
              handlePasswordUpdate(link.id, newPass);
            }}>
              <input
                name="password"
                defaultValue={link.password || ""}
                placeholder="Set or update password"
                className="border p-2 mt-2 mr-2"
              />
              <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
                Save
              </button>
            </form>
          </div>
        ))
      }
    </div>
  );
};

export default ProtectedLinks;

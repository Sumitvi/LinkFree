import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QRCode from 'react-qr-code';

const DashboardQrPage = () => {
  const username = localStorage.getItem('username');
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/links/${username}`);
        setLinks(res.data);
      } catch (err) {
        console.error('Failed to load links:', err);
      }
    };

    fetchLinks();
  }, [username]);

  const toggleQr = async (id, currentState) => {
    try {
      await axios.put(`http://localhost:8080/api/links/${id}/qr?enabled=${!currentState}`);
      setLinks((prev) =>
        prev.map((link) => (link.id === id ? { ...link, qrEnabled: !currentState } : link))
      );
    } catch (err) {
      console.error('Error toggling QR:', err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 mt-5">🔲 QR Code Management</h2>
      {links.length === 0 ? (
        <p>No links available.</p>
      ) : (
        <div className="space-y-6">
          {links.map((link) => (
            <div key={link.id} className="p-4 bg-white shadow rounded">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{link.title || link.url}</p>
                  <p className="text-sm text-gray-500">{link.url}</p>
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={link.qrEnabled}
                    onChange={() => toggleQr(link.id, link.qrEnabled)}
                  />
                  <span className="text-sm">Enable QR</span>
                </label>
              </div>

              {link.qrEnabled && (
                <div className="mt-4">
                  <QRCode
                    value={`http://localhost:8080/api/links/redirect/${link.id}`}
                    size={128}
                    fgColor="#1e3a8a"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardQrPage;

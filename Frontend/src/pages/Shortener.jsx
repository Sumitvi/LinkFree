import React, { useState, useEffect } from 'react';
import { Trash2, Link as LinkIcon } from "lucide-react";
import axios from 'axios';
import FlashMessage from '../components/FlashMessage'; // ✅ Adjust path if needed

const Shortener = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [history, setHistory] = useState([]);
  const [flash, setFlash] = useState(null);

  const username = localStorage.getItem("username");
  const API_BASE = "http://localhost:8080";
  const FRONT_BASE = window.location.origin;

  const handleShorten = async () => {
    if (!originalUrl) return;

    try {
      const res = await axios.post(`${API_BASE}/api/shorten`, {
        username,
        originalUrl,
      });

      const code = res.data.shortCode || res.data.code || res.data.shortUrl?.split('/').pop();
      const fullShortUrl = `${FRONT_BASE}/s/${code}`;
      setShortUrl(fullShortUrl);
      setOriginalUrl('');
      setFlash({ type: 'success', message: '✅ Link shortened successfully!' });
      fetchLinks();
    } catch (err) {
      console.error(err);
      setFlash({ type: 'error', message: '❌ Failed to shorten URL' });
    }
  };

  const fetchLinks = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/shorten/all/${username}`);
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching history", err);
      setFlash({ type: 'error', message: '❌ Failed to fetch history' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/shorten/${id}`);
      setHistory((prev) => prev.filter((link) => link.id !== id));
      setFlash({ type: 'success', message: '✅ Short link deleted' });
    } catch (err) {
      console.error("Delete failed", err);
      setFlash({ type: 'error', message: '❌ Failed to delete short link' });
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 sm:p-8 bg-white rounded-2xl shadow-md space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <LinkIcon className="text-orange-500" />
        <h2 className="text-2xl font-bold text-orange-600">Link Shortener</h2>
      </div>

      {flash && <FlashMessage type={flash.type} message={flash.message} />}

      <div className="space-y-4">
        <input
          type="text"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          placeholder="Paste long URL..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleShorten}
          className="bg-orange-400 hover:bg-orange-600 text-white px-4 py-2 rounded w-full transition"
        >
          Generate Short Link
        </button>

        {shortUrl && (
          <div className="p-3 rounded bg-green-50 border border-green-200 text-sm">
            <p className="text-green-700 font-medium">Shortened Link:</p>
            <a
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline break-all"
            >
              {shortUrl}
            </a>
          </div>
        )}
      </div>

      {/* History Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">📜 Your Short Links</h3>

        {history.length === 0 ? (
          <p className="text-gray-500 text-sm">No links yet.</p>
        ) : (
          <div className="  block w-full sm: grid-cols-2 gap-4 ">
            {history.map((item) => {
              const fullShort = `${FRONT_BASE}/s/${item.shortCode}`;
              return (
                <div
                  key={item.id}
                  className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-xl shadow hover:shadow-lg transition relative"
                >
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="absolute top-3 right-3 text-red-600 hover:text-red-800"
                    title="Delete link"
                  >
                    <Trash2 size={18} />
                  </button>

                  <p className="text-sm mb-1 break-all text-gray-800">
                    <strong>Original:</strong>{' '}
                    <a href={item.originalUrl} target="_blank" rel="noreferrer" className="underline text-blue-600">
                      {item.originalUrl}
                    </a>
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Short:</strong>{' '}
                    <a href={fullShort} target="_blank" rel="noreferrer" className="text-blue-600 underline block w-full">
                      {fullShort}
                    </a>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Visits: {item.visitCount}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shortener;

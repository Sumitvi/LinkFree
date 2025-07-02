import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FlashMessage from '../components/FlashMessage';
import { Save, Shield, Eye, EyeOff } from 'lucide-react';

const ProtectedLinks = () => {
  const [links, setLinks] = useState([]);
  const [flash, setFlash] = useState(null);
  const [visible, setVisible] = useState({}); // Track visibility by link ID

  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/links/${username}`);
        setLinks(res.data);
      } catch (err) {
        console.error("Error fetching links", err);
        setFlash({ type: 'error', message: '❌ Failed to load links' });
      }
    };
    fetchLinks();
  }, [username]);

  const handlePasswordUpdate = async (id, password) => {
    try {
      await axios.put(`http://localhost:8080/api/links/${id}/password`, { password });
      setFlash({ type: 'success', message: '✅ Password updated!' });
    } catch (err) {
      console.error("Error updating password", err);
      setFlash({ type: 'error', message: '❌ Failed to update password.' });
    }
  };

  const toggleVisibility = (id) => {
    setVisible(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 p-4 sm:p-6 bg-white rounded-2xl shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="text-orange-500" size={28} />
        <h2 className="text-2xl font-bold text-orange-600">Password Protected Links</h2>
      </div>

      {flash && <FlashMessage type={flash.type} message={flash.message} />}

      {links.length === 0 ? (
        <p className="text-gray-500 text-center mt-4">No protected links found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {links.map(link => (
            <div
              key={link.id}
              className="border-l-4 border-orange-500 rounded-xl p-5 bg-gradient-to-b from-white to-orange-50 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-gray-800 truncate">{link.title}</h3>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-words text-sm mt-1 inline-block"
              >
                {link.url}
              </a>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const newPass = e.target.password.value;
                  handlePasswordUpdate(link.id, newPass);
                }}
                className="mt-4 flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    name="password"
                    type={visible[link.id] ? "text" : "password"}
                    defaultValue={link.password || ""}
                    placeholder="Set or update password"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => toggleVisibility(link.id)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-600 hover:text-gray-800"
                    tabIndex={-1}
                    title={visible[link.id] ? "Hide password" : "Show password"}
                  >
                    {visible[link.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <button
                  type="submit"
                  className="text-white bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition"
                  title="Save password"
                >
                  <Save size={18} />
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProtectedLinks;

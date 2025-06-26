import React, { useEffect, useState } from 'react';
import { getUserLinks } from '../services/api';
import LinkRow from '../components/LinkRow';
import AddLink from '../components/AddLink';

const MyLinks = () => {
  const [links, setLinks] = useState([]);
  const username = localStorage.getItem("username"); // Or from context

  const fetchLinks = async () => {
    try {
      const data = await getUserLinks(username);
      setLinks(data);
    } catch (err) {
      console.error("Failed to load links", err);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleDelete = (deletedId) => {
    setLinks(prev => prev.filter(link => link.id !== deletedId));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Links</h1>

      <AddLink username={username} onLinkAdded={fetchLinks} />

      {links.length === 0 ? (
        <p>No links found. Add some!</p>
      ) : (
        <table className="w-full border mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="text-left p-2">Title</th>
              <th className="text-left p-2">URL</th>
              <th className="text-left p-2">Clicks</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.map(link => (
              <LinkRow
                key={link.id}
                link={link}
                onDelete={handleDelete}
                onUpdate={fetchLinks}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyLinks;

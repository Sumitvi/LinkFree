import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserLinks } from '../services/api';
import LinkCard from '../components/LinkCard';
import { themes } from '../themes';

const PublicPage = () => {
  const { username } = useParams();
  const [links, setLinks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const themeKey = user?.theme || "light";
  const theme = themes[themeKey] || themes["light"];

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const data = await getUserLinks(username);
        setLinks(data);
        if (data.length > 0 && data[0].user) {
          setUser(data[0].user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error loading links", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, [username]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!user) return <div className="text-center mt-10 text-red-500">User not found or no links available.</div>;

  return (
    <div className={`min-h-screen flex flex-col items-center justify-start p-4 ${theme.background} ${theme.text}`}>
      <div className="max-w-md w-full mt-6 text-center">
        <img
          src={user.avatarUrl || `https://ui-avatars.com/api/?name=${username}`}
          alt="avatar"
          className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white"
        />
        <h2 className="text-2xl font-bold">@{user.username}</h2>
        {user.bio && <p className="mt-2 text-gray-300">{user.bio}</p>}

        <div className="mt-6 space-y-3">
          {links.map((link) => (
            <LinkCard key={link.id} link={link} theme={theme} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicPage;

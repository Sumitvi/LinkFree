import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserLinks } from '../services/api';
import LinkCard from '../components/LinkCard';
import { themes } from '../themes';
import { FaGithub, FaLinkedin, FaInstagram, FaTwitter } from 'react-icons/fa';

const PublicPage = () => {
  const { username } = useParams();
  const [links, setLinks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);

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

  const {
    theme: themeKey = "light",
    buttonShape = "rounded",
    buttonSize = "md",
    buttonColor = "bg-white",
    fontStyle = "sans",
    backgroundGradient = "",
    backgroundImageUrl = "",
    logoUrl = "",
    customCss = ""
  } = user;

  const theme = themes[themeKey] || themes["light"];

  return (
    <div
      className={`
        min-h-screen flex flex-col items-center justify-start p-4 
        font-${fontStyle} 
        ${backgroundGradient ? `bg-gradient-to-b ${backgroundGradient}` : theme.background}
        ${theme.text}
      `}
      style={{
        backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Inject custom CSS if any */}
      {customCss && <style dangerouslySetInnerHTML={{ __html: customCss }} />}

      <div className="max-w-md w-full mt-6 text-center bg-white bg-opacity-80 p-4 rounded">
        {/* User Logo */}
        {logoUrl && (
          <img
            src={logoUrl}
            alt="Logo"
            className="w-20 h-20 object-contain mx-auto mb-3"
          />
        )}

        {/* Avatar and Username */}
        <img
          src={user.avatarUrl || `https://ui-avatars.com/api/?name=${username}`}
          alt="avatar"
          className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white"
        />
        <h2 className="text-2xl font-bold">@{user.username}</h2>
        {user.bio && <p className="mt-2 text-gray-700">{user.bio}</p>}

        {/* Social Icons */}
        <div className="flex justify-center space-x-4 text-2xl mt-4">
          {user.github && (
            <a href={user.github} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
              <FaGithub />
            </a>
          )}
          {user.linkedin && (
            <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
              <FaLinkedin />
            </a>
          )}
          {user.instagram && (
            <a href={user.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-pink-400">
              <FaInstagram />
            </a>
          )}
          {user.twitter && (
            <a href={user.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-sky-400">
              <FaTwitter />
            </a>
          )}
        </div>

        {/* Link Cards */}
        <div className="mt-6 space-y-3">
          {links.map(link => (
            <LinkCard
              key={link.id}
              link={link}
              theme={theme}
              shape={buttonShape}
              size={buttonSize}
              color={buttonColor}
              font={fontStyle}
              gradient={backgroundGradient}
            />
          ))}
        </div>

        {/* Contact Form Toggle */}
        <div className="mt-8 w-full">
          <button
            onClick={() => setShowContact(prev => !prev)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded w-full shadow font-semibold"
          >
            📥 Contact Me
          </button>

          {showContact && (
            <div className="mt-4 bg-white p-4 rounded shadow animate-fade-in">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const submission = {
                    username: user.username,
                    email: formData.get("email"),
                    phone: formData.get("phone"),
                  };
                  await fetch("http://localhost:8080/api/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(submission),
                  });
                  alert("✅ Thanks for contacting!");
                  e.target.reset();
                  setShowContact(false);
                }}
                className="space-y-3"
              >
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Your Email"
                  className="w-full border p-2 rounded"
                />
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="Your Phone"
                  className="w-full border p-2 rounded"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
                  Submit
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicPage;

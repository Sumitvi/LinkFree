import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserLinks } from '../services/api';
import LinkCard from '../components/LinkCard';
import { themes } from '../themes';
import { FaGithub, FaLinkedin, FaInstagram, FaTwitter } from 'react-icons/fa';
import FlashMessage from '../components/FlashMessage';

const PublicPage = () => {
  const { username } = useParams();
  const [links, setLinks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const [flash, setFlash] = useState(null);

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

  // Button Styles
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
  } = user || {};

  const theme = themes[themeKey] || themes["light"];

  const shapeClass = buttonShape === "square" ? "rounded-none" : "rounded-xl";
  const sizeClass =
    buttonSize === "sm"
      ? "text-sm py-2 px-3"
      : buttonSize === "lg"
        ? "text-lg py-4 px-6"
        : "text-base py-3 px-4";

  const fontClass =
    fontStyle === "serif"
      ? "font-serif"
      : fontStyle === "mono"
        ? "font-mono"
        : "font-sans";

  const isTailwindBg = buttonColor?.startsWith("bg-");
  const backgroundClass = backgroundGradient
    ? `bg-gradient-to-r ${backgroundGradient}`
    : isTailwindBg
      ? buttonColor
      : "";

  const textClass = !backgroundGradient && !isTailwindBg ? `text-[${buttonColor}]` : "text-white";

  const contactButtonClasses = `
    block w-full text-center shadow flex items-center justify-center gap-2 
    transition duration-300 hover:scale-[1.02] ${shapeClass} ${sizeClass} ${fontClass} ${backgroundClass} ${textClass}
  `;

  // 🌀 Loading Spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">
        User not found or no links available.
      </div>
    );
  }

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
      {customCss && <style dangerouslySetInnerHTML={{ __html: customCss }} />}

      <div className="max-w-md w-full mt-6 text-center bg-white bg-opacity-90 p-6 rounded-2xl shadow-lg backdrop-blur-md border border-gray-200">
        {flash && <FlashMessage type={flash.type} message={flash.message} onClose={() => setFlash(null)} />}

        {logoUrl && (
          <img src={logoUrl} alt="Logo" className="w-20 h-20 object-contain mx-auto mb-3" />
        )}

        <img
          src={user.avatarUrl || `https://ui-avatars.com/api/?name=${username}`}
          alt="avatar"
          className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow"
        />
        <h2 className="text-2xl font-bold text-gray-800">@{user.username}</h2>
        {user.bio && <p className="mt-2 text-gray-600 text-sm">{user.bio}</p>}

        <div className="flex justify-center space-x-4 text-xl mt-4">
          {user.github && <a href={user.github} target="_blank" rel="noopener noreferrer" className="hover:text-black"><FaGithub /></a>}
          {user.linkedin && <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600"><FaLinkedin /></a>}
          {user.instagram && <a href={user.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-pink-500"><FaInstagram /></a>}
          {user.twitter && <a href={user.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-sky-400"><FaTwitter /></a>}
        </div>

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

        <div className="mt-8 w-full">
          <button
            onClick={() => setShowContact(prev => !prev)}
            className={contactButtonClasses}
          >
            📥 Contact Me
          </button>

          {showContact && (
            <div className="mt-4 bg-white p-4 rounded-xl shadow animate-fade-in border border-gray-200">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const submission = {
                    username: user.username,
                    email: formData.get("email"),
                    phone: formData.get("phone"),
                  };
                  try {
                    await fetch("http://localhost:8080/api/contact", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(submission),
                    });
                    setFlash({ type: 'success', message: '✅ Thanks for contacting!' });
                    e.target.reset();
                    setShowContact(false);
                  } catch (err) {
                    setFlash({ type: 'error', message: '❌ Failed to send message' });
                  }
                }}
                className="space-y-3"
              >
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Your Email"
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:ring-blue-400"
                />
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="Your Phone"
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:ring-blue-400"
                />
                <button type="submit" className={contactButtonClasses}>
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

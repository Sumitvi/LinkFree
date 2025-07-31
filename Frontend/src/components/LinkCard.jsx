import React, { useState } from 'react';
import { FaInstagram, FaTwitter, FaLinkedin, FaGithub, FaYoutube } from 'react-icons/fa';
import FlashMessage from './FlashMessage';
import { API_BASE_URL } from '../services/api';

const LinkCard = ({
  link,
  theme,
  shape = "rounded",
  size = "md",
  color = "#1d4ed8",
  font = "sans",
  gradient = ""
}) => {
  if (!link || link?.isActive === false) return null;

  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [flash, setFlash] = useState(null);

  const backendBaseUrl = API_BASE_URL;

  const platformIcons = {
    instagram: <FaInstagram />,
    twitter: <FaTwitter />,
    linkedin: <FaLinkedin />,
    github: <FaGithub />,
    youtube: <FaYoutube />
  };

  const platform = Object.keys(platformIcons).find(p =>
    link.url?.toLowerCase().includes(p)
  );

  const label = link.title || (platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : 'Visit');
  const shapeClass = shape === "square" ? "rounded-none" : "rounded-xl";
  const sizeClass =
    size === "sm" ? "text-sm py-2 px-3" :
    size === "lg" ? "text-lg py-4 px-6" :
    "text-base py-3 px-4";
  const fontClass = font === "serif" ? "font-serif" : font === "mono" ? "font-mono" : "font-sans";
  const isTailwindBg = color?.startsWith("bg-");
  const backgroundClass = gradient
    ? `bg-gradient-to-r ${gradient}`
    : isTailwindBg ? color : "";
  const textClass = !gradient && !isTailwindBg ? `text-[${color}]` : "text-white";

  const finalClasses = `
    block w-full text-center shadow flex items-center justify-center gap-2 
    transition duration-300 hover:scale-[1.02] ${shapeClass} ${sizeClass} ${fontClass} ${backgroundClass} ${textClass} animate-slide-up
  `;

  const handleProtectedClick = async () => {
    if (!enteredPassword.trim()) {
      setFlash({ type: 'error', message: 'Please enter a password.' });
      return;
    }

    try {
      const res = await fetch(`${backendBaseUrl}/api/links/verify-password/${link.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: enteredPassword.trim() }),
      });

      if (res.ok) {
        const { redirectUrl } = await res.json();
        window.open(redirectUrl.startsWith("http") ? redirectUrl : `https://${redirectUrl}`, "_blank");
        setShowPasswordInput(false);
        setEnteredPassword("");
        setFlash({ type: 'success', message: '🔓 Access granted!' });
      } else {
        const err = await res.text();
        setFlash({ type: 'error', message: err || "Invalid password" });
      }
    } catch {
      setFlash({ type: 'error', message: "Something went wrong." });
    }
  };

  if (link.type === 'video') {
    const embedUrl = link.url.includes("youtube.com/watch?v=")
      ? link.url.replace("watch?v=", "embed/")
      : link.url;

    return (
      <div className="mb-4 w-full animate-slide-up">
        <iframe
          className={`w-full aspect-video ${shapeClass}`}
          src={embedUrl}
          title={label}
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="mb-4 animate-slide-up">
      {flash && <FlashMessage type={flash.type} message={flash.message} />}
      {!link.password ? (
        <a
          href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
          target="_blank"
          rel="noopener noreferrer"
          title={label}
          className={finalClasses}
        >
          {platform && <span className="text-lg">{platformIcons[platform]}</span>}
          <span>{label}</span>
        </a>
      ) : (
        <>
          {!showPasswordInput ? (
            <button onClick={() => setShowPasswordInput(true)} className={`${finalClasses} cursor-pointer`}>
              🔒 {label}
            </button>
          ) : (
            <div className="space-y-2 animate-fade-in">
              <input
                type="password"
                value={enteredPassword}
                onChange={(e) => setEnteredPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full border border-gray-300 p-2 rounded focus:ring focus:ring-blue-400"
              />
              <button onClick={handleProtectedClick} className={finalClasses}>
                Unlock
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LinkCard;

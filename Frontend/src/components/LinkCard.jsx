import React, { useState } from 'react';
import {
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaYoutube
} from 'react-icons/fa';

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
  const [error, setError] = useState('');

  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

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
    size === "sm"
      ? "text-sm py-2 px-3"
      : size === "lg"
        ? "text-lg py-4 px-6"
        : "text-base py-3 px-4";

  const fontClass =
    font === "serif"
      ? "font-serif"
      : font === "mono"
        ? "font-mono"
        : "font-sans";

  const isTailwindBg = color?.startsWith("bg-");
  const backgroundClass = gradient
    ? `bg-gradient-to-r ${gradient}`
    : isTailwindBg
      ? color
      : "";

  const textClass = !gradient && !isTailwindBg ? `text-[${color}]` : "text-white";

  const finalClasses = `
    block w-full text-center shadow flex items-center justify-center gap-2 
    transition ${shapeClass} ${sizeClass} ${fontClass} ${backgroundClass} ${textClass}
  `;

  const handleProtectedClick = async () => {
  if (!enteredPassword) {
    setError("Please enter a password.");
    return;
  }

  const trimmedPassword = enteredPassword.trim();
  console.log("Sending password:", JSON.stringify({ password: trimmedPassword }));

  try {
    const res = await fetch(`${backendBaseUrl}/api/links/verify-password/${link.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: trimmedPassword }),
    });

    if (res.ok) {
      const { redirectUrl } = await res.json();
      window.open(redirectUrl.startsWith("http") ? redirectUrl : `https://${redirectUrl}`, "_blank");
      setShowPasswordInput(false);
      setEnteredPassword("");
      setError("");
    } else {
      const err = await res.text();
      setError(err || "Invalid password");
    }
  } catch (err) {
    setError("Something went wrong.");
  }
};


  if (link.type === 'video') {
    const embedUrl = link.url.includes("youtube.com/watch?v=")
      ? link.url.replace("watch?v=", "embed/")
      : link.url;

    return (
      <div className="mb-4 w-full">
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
    <div className="mb-4">
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
            <button
              onClick={() => setShowPasswordInput(true)}
              className={`${finalClasses} cursor-pointer`}
            >
              🔒 {label}
            </button>
          ) : (
            <div className="space-y-2">
              <input
                type="password"
                value={enteredPassword}
                onChange={(e) => setEnteredPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full border p-2 rounded"
              />
              <button
                onClick={handleProtectedClick}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded"
              >
                Unlock
              </button>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LinkCard;

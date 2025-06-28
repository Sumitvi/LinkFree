import React from 'react';
import {
  FaInstagram, FaTwitter, FaLinkedin, FaGithub, FaYoutube
} from 'react-icons/fa';

const LinkCard = ({
  link,
  theme,
  shape = "rounded",
  size = "md",
  color = "#1d4ed8",                // fallback hex if not using bg class
  font = "sans",
  gradient = ""                     // optional: e.g. "from-purple-500 to-pink-500"
}) => {
  if (link?.isActive === false) return null;

  const getEmbeddedUrl = (url) => {
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    return url;
  };

  const iconMap = {
    instagram: <FaInstagram />,
    twitter: <FaTwitter />,
    linkedin: <FaLinkedin />,
    github: <FaGithub />,
    youtube: <FaYoutube />
  };

  const platform = Object.keys(iconMap).find(platform =>
    link.url.toLowerCase().includes(platform)
  );

  const label = link.title || (platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : 'Visit');

  const shapeClass = shape === "square" ? "rounded-none" : "rounded-xl";

  const sizeClass =
    size === "sm" ? "text-sm py-2 px-3" :
    size === "lg" ? "text-lg py-4 px-6" :
    "text-base py-3 px-4";

  const fontClass =
    font === "serif" ? "font-serif" :
    font === "mono" ? "font-mono" :
    "font-sans";

  // Color class handling
  const isTailwindBg = color?.startsWith("bg-");
  const backgroundClass = gradient
    ? `bg-gradient-to-r ${gradient}`
    : isTailwindBg
      ? color
      : "";
  const textClass = !gradient && !isTailwindBg ? `text-[${color}]` : "text-white";

  const finalClasses = `block w-full text-center shadow hover:opacity-90 flex items-center justify-center gap-2 
    transition ${shapeClass} ${sizeClass} ${fontClass} ${backgroundClass} ${textClass}`;

  if (link.type === 'video') {
    return (
      <div className="mb-4 w-full">
        <iframe
          className={`w-full aspect-video ${shapeClass}`}
          src={getEmbeddedUrl(link.url)}
          title={label}
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <a
      href={`http://localhost:8080/api/links/redirect/${link.id}`}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      className={finalClasses}
    >
      {platform && <span className="text-lg">{iconMap[platform]}</span>}
      <span>{label}</span>
    </a>
  );
};

export default LinkCard;

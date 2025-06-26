import React from 'react';

const LinkCard = ({ link, theme }) => {
  if (!link.isActive) return null;

  // Handle video embed
  if (link.type === 'video') {
    return (
      <div className="mb-4 w-full">
        <iframe
          className="w-full aspect-video rounded-xl"
          src={link.url.replace("watch?v=", "embed/")}
          title={link.title}
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block w-full text-center py-3 px-4 mb-4 rounded-xl font-semibold transition ${theme.button}`}
    >
      {link.title}
    </a>
  );
};

export default LinkCard;

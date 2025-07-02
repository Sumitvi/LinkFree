// components/FlashMessage.jsx
import React, { useEffect, useState } from 'react';

const FlashMessage = ({ message, type = "success", onClose, duration = 5000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose && onClose(), 300); // Wait for animation to finish
    }, duration);

    return () => clearTimeout(timeout);
  }, [onClose, duration]);

  const baseStyle = `
    fixed top-5 left-1/2 transform -translate-x-1/2 z-50
    px-5 py-3 rounded-lg shadow-lg text-sm font-medium
    transition-all duration-300 ease-in-out
    ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
  `;

  const colorStyle =
    type === "success"
      ? "bg-green-100 text-green-800 border border-green-300"
      : "bg-red-100 text-red-800 border border-red-300";

  return (
    <div className={`${baseStyle} ${colorStyle}`}>
      <div className="flex items-center justify-between gap-4">
        <span className="truncate">{message}</span>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(() => onClose && onClose(), 300);
          }}
          className="text-xs underline"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default FlashMessage;

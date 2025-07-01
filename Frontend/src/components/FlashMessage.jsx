// components/FlashMessage.jsx
import React from 'react';

const FlashMessage = ({ message, type = "success", onClose }) => {
  if (!message) return null;

  const baseStyle = "fixed top-5 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded shadow-lg text-sm font-medium transition duration-300";
  const colorStyle =
    type === "success"
      ? "bg-green-100 text-green-800 border border-green-300"
      : "bg-red-100 text-red-800 border border-red-300";

  return (
    <div className={`${baseStyle} ${colorStyle}`}>
      <div className="flex items-center justify-between gap-4">
        <span>{message}</span>
        <button onClick={onClose} className="text-xs underline">Close</button>
      </div>
    </div>
  );
};

export default FlashMessage;

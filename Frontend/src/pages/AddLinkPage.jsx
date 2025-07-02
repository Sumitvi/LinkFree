import React from 'react';
import AddLink from '../components/AddLink';

const AddLinkPage = () => {
  const username = localStorage.getItem("username");

  const handleRefresh = () => {
    
    console.log("Link added successfully!");
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Add New Link</h2>
      {username ? (
        <AddLink username={username} onLinkAdded={handleRefresh} />
      ) : (
        <p className="text-red-500">Error: Username not found in local storage.</p>
      )}
    </div>
  );
};

export default AddLinkPage;

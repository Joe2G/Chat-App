import React from 'react';

const Header = ({ chatId, setSelectedChatId }) => {
  const handleBackButtonClick = () => {
    setSelectedChatId(null);
  };

  return (
    <header className="header flex items-center justify-center p-2 border-b border-gray-300 relative">
      <button
        className="back-button text-xl text-blue-500 md:hidden absolute left-2"
        onClick={handleBackButtonClick}
      >
        ← Back
      </button>
      <h1 className={`text-2xl font-semibold mx-auto text-center`}>
        {chatId}
      </h1>
    </header>
  );
};

export default Header;
import { useEffect, useState } from 'react';

/**
 * Custom hook to manage and sync chat ID.
 *
 * @param {string|null} selectedChatId - The currently selected chat ID.
 * @returns {string|null} The current chat ID.
 */
const useChatIdHook = (selectedChatId) => {
  const [chatId, setChatId] = useState(selectedChatId || null); // Default to null

  useEffect(() => {
    setChatId(selectedChatId);
  }, [selectedChatId]);

  return chatId;
};

export default useChatIdHook;
import { useEffect, useState } from 'react';
import NewChat from './newChat';
import useUsernameHook from '../hooks/usernameHook';
import ChatAvatar from './ChatAvatar';
import useAppStore from '../stores/appStore';

export default function Sidebar({ onSelectChat }) {
  const [userChats, setUserChats] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const { setModal } = useAppStore(); // Get setModal from app store

  const sender = useUsernameHook();

  const handleChatClick = (chatId) => {
    onSelectChat(chatId);
  };

  const handleDarkModeToggle = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', newMode);
      return newMode;
    });
  };

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  const handleDeleteChat = async (chatId) => {
    try {
      const response = await fetch(`${apiUrl}/api/chats/${chatId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setUserChats((prevChats) => prevChats.filter((chat) => chat.chatId !== chatId));
      } else {
        console.error("Error deleting chat:", await response.json());
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const showDeleteConfirmation = (chatId) => {
    setModal({
      show: true,
      title: 'Confirm Delete',
      children: 'Are you sure you want to delete this chat?',
      onClick: () => handleDeleteChat(chatId),
    });
  };

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const fetchUserChats = async () => {
      if (sender.id) {
        try {
          const response = await fetch(`${apiUrl}/api/users/${sender.id}/chats/last-messages`);
          const chats = await response.json();
          setUserChats(chats);
        } catch (error) {
          console.error('Error fetching user chats:', error);
        }
      }
    };

    fetchUserChats();
  }, [sender.id]);

  return (
    <div className="w-full md:w-1/4 p-4 h-screen" style={{ color: 'var(--sidebar-text)', borderRight: '1px solid var(--sidebar-border)' }}>
      <header className="header p-1 flex justify-between items-center">
        <NewChat />
        <button
          type="button"
          className="flex items-center justify-center w-9 h-9 focus:outline-none"
          onClick={handleDarkModeToggle}
        >
          <svg
            data-toggle-icon="moon"
            className={`w-3.5 h-3.5 ${isDarkMode ? '' : 'hidden'}`}
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 18 20"
          >
            <path d="M17.8 13.75a1 1 0 0 0-.859-.5A7.488 7.488 0 0 1 10.52 2a1 1 0 0 0 0-.969A1.035 1.035 0 0 0 9.687.5h-.113a9.5 9.5 0 1 0 8.222 14.247 1 1 0 0 0 .004-.997Z"></path>
          </svg>
          <svg
            data-toggle-icon="sun"
            className={`w-3.5 h-3.5 ${isDarkMode ? 'hidden' : ''}`}
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-11a1 1 0 0 0 1-1V1a1 1 0 0 0-2 0v2a1 1 0 0 0 1 1Zm0 12a1 1 0 0 0-1 1v2a1 1 0 1 0 2 0v-2a1 1 0 0 0-1-1ZM4.343 5.757a1 1 0 0 0 1.414-1.414L4.343 2.929a1 1 0 0 0-1.414 1.414l1.414 1.414Zm11.314 8.486a1 1 0 0 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.414-1.414l-1.414-1.414ZM4 10a1 1 0 0 0-1-1H1a1 1 0 0 0 0 2h2a1 1 0 0 0 1-1Zm15-1h-2a1 1 0 1 0 0 2h2a1 1 0 0 0 0-2ZM4.343 14.243l-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414a1 1 0 0 0-1.414-1.414ZM14.95 6.05a1 1 0 0 0 .707-.293l1.414-1.414a1 1 0 1 0-1.414-1.414l-1.414 1.414a1 1 0 0 0 .707 1.707Z"></path>
          </svg>
          <span className="sr-only">Toggle dark/light mode</span>
        </button>
      </header>

      <div className="overflow-y-auto">
        {userChats.map((chat) => (
          <div
            key={chat.chatId}
            className="flex items-center mb-4 cursor-pointer hover:bg-gray-500 p-2 rounded-lg relative"
            onClick={() => handleChatClick(chat.chatId)}
          >
            <ChatAvatar chatId={chat.chatId} />
            <div className="ml-3 flex-1">
              <h2 className="text-lg font-semibold">{chat.chatId}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 message-text">
                {chat.lastMessage.length > 30
                  ? `${chat.lastMessage.substring(0, 33)}...`
                  : chat.lastMessage || "No messages yet."}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent chat selection when clicking delete
                showDeleteConfirmation(chat.chatId); // Call to show delete confirmation modal
              }}
              className="delete-button"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../stores/appStore';
import useUsernameHook from '../hooks/usernameHook';

export default function NewChat() {
  const { setModal } = useAppStore();
  const sender = useUsernameHook(); // Get the current user details
  const navigate = useNavigate(); // React Router hook for navigation

  const VIP_PASSWORD = "PaSS?HAha"; // Replace with your actual VIP password

  const generateNewChatId = async () => {
    const newChatId = uuidv4();
    await saveChat(newChatId, sender.id);
    navigate(`/Chat-App/?chatId=${newChatId}`); // Updated navigate call
  };

  const saveChat = async (chatId, userId) => {
    try {
      const response = await fetch('https://chat-app-indol-tau.vercel.app/api/chats', {
        method: 'POST',
        mode: 'no-cors',  // Add this line
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatId, userId }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save chat');
      }
    } catch (error) {
      console.error('Error saving chat:', error);
    }
  };  

  const createCustomChatId = () => {
    setModal({
      show: true,
      children: (
        <div className="p-1">
          <h2 className="p-1">Enter a chat ID (min 3 characters):</h2>
          <input
            type="text"
            id="customChatId"
            placeholder="Chat ID"
            className="input w-full p-1"
          />
          <h2 className="p-1">Enter VIP Password:</h2>
          <input
            type="password"
            id="vipPassword"
            placeholder="Password"
            className="input w-full p-1"
          />
        </div>
      ),
      onClick: async () => {
        const customChatId = document.getElementById('customChatId').value;
        const enteredPassword = document.getElementById('vipPassword').value;

        if (enteredPassword === VIP_PASSWORD && customChatId.trim().length >= 3) {
          await saveChat(customChatId.trim(), sender.id);
          navigate(`/Chat-App/?chatId=${customChatId.trim()}`); // Updated navigate call
        } else if (customChatId.trim().length < 3) {
          alert('Chat ID must be at least 3 characters long');
        } else {
          alert('Incorrect password. Please try again.');
        }
      },
    });
  };

  return (
    <div className="sidebar-buttons">
      <button onClick={generateNewChatId} className="new-chat">
        New Chat
      </button>
      <button onClick={createCustomChatId} className="custom-chat">
        +
      </button>
    </div>
  );
}

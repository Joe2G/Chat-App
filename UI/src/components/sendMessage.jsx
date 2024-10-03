import React from 'react';
import useUsernameHook from '../hooks/usernameHook';

export default function SendMessage({ socket, chatId }) {
  const sender = useUsernameHook();

  const sendMessage = () => {
    const messageElement = document.getElementById('New-Message');
    const message = messageElement.value;

    if (message && sender.name) {
      messageElement.value = '';

      // Define maximum length for each message
      const maxMessageLength = 2000; // Adjust this limit as needed
      const messages = [];

      // Split the message into chunks
      for (let i = 0; i < message.length; i += maxMessageLength) {
        messages.push(message.substring(i, i + maxMessageLength));
      }

      // Send each chunk as a separate message
      messages.forEach((text) => {
        const newMessage = {
          text,
          sender, // Includes both name and id
          chatId,
          timestamp: new Date().getTime(),
        };

        if (socket) { // Check if socket is initialized
          socket.emit('message', newMessage); // Send message to the backend
        } else {
          console.error('Socket is not connected');
        }
      });
    }
  };

  // Handle textarea resize and send message on "Enter"
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="send-message-container">
      <footer className="border-gray-300 p-4 flex justify-center w-full">
        <div className="flex items-center w-full max-w-100 bg-white p-2 rounded-full shadow-md">
          <textarea
            id="New-Message"
            type="text"
            placeholder="Type a message..."
            className="w-11/12 p-2 rounded-full border-none focus:outline-none resize-none flex-grow"
            rows="1"
            onKeyDown={handleKeyDown} // Handle Enter key press
            style={{ overflow: 'hidden' }}
          />
          <button
            className="text-white p-2 rounded-full ml-2 flex items-center justify-center flex-shrink-0"
            onClick={sendMessage}
            id="Send-Message"
            style={{ width: '15%' }}
          >
            <img src="https://imgs.search.brave.com/jtawhg1MpkNGhFAG1ceYiguChrQdqHYIRQm_Rajw3SA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pY29u/LWxpYnJhcnkuY29t/L2ltYWdlcy9zZW5k/LW1lc3NhZ2UtaWNv/bi9zZW5kLW1lc3Nh/Z2UtaWNvbi0xNi5q/cGc"
              alt='send' className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            </img>
          </button>
        </div>
      </footer>
    </div>
  );
}
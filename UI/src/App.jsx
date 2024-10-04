import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import useUsernameHook from './hooks/usernameHook';
import useSocketHook from './hooks/socketHook';
import useChatIdHook from './hooks/chatIdHook';
import MessagesContainer from './components/layout/messagesContainer';
import Sidebar from './components/sideBar';
import Header from './components/layout/header';
import Modal from './components/common/modal';
import useWindowResize from './hooks/useWindowResize';

function App() {
  const [messages, setMessages] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const windowWidth = useWindowResize();
  const sender = useUsernameHook();
  const chatId = useChatIdHook();
  const socket = useSocketHook(chatId);

  useEffect(() => {
    if (socket) {
      const messageHandler = (message) => {
        setMessages((prevMessages) => {
          if (prevMessages.some((msg) => msg.id === message.id && msg.text === message.text)) {
            return prevMessages;
          }
          return [...prevMessages, message];
        });
      };

      socket.on('message', messageHandler);

      return () => {
        socket.off('message', messageHandler);
      };
    }
  }, [socket]);

  const handleChatSelect = async (chatId) => {
    setSelectedChatId(chatId);
    setMessages([]);
    socket.emit('joinChat', chatId);
    socket.emit('getMessages', { chatId });
    socket.once('getMessages', (fetchedMessages) => {
      setMessages(fetchedMessages);
    });
  };

  return (
    <Router> {/* Wrap the entire application with Router */}
      <div className="flex h-screen">
        {(!selectedChatId || windowWidth > 768) && (
          <Sidebar messages={messages} onSelectChat={handleChatSelect} />
        )}
        {selectedChatId && (
          <div className="main-content flex flex-col w-full md:w-3/4">
            <Header chatId={selectedChatId} setSelectedChatId={setSelectedChatId} />
            <MessagesContainer messages={messages} sender={sender} chatId={selectedChatId} socket={socket} />
          </div>
        )}
        <Modal />
      </div>
    </Router>
  );
}

export default App;
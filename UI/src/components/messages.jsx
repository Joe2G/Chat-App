import React, { useEffect, useRef } from 'react';
import '../App.css';

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
};

export default function Messages({ messages, currentUser }) {
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  return (
    <div className="messages-container">
      {messages.map((message, index) => (
        <div key={message.id || `message-${index}`} className="flex flex-col mb-4">
          <div className={`flex ${message.sender === currentUser.name ? 'justify-end' : 'justify-start'} mb-2`}>
            <div className={`message-bubble ${message.sender === currentUser.name ? 'sender' : 'receiver'} rounded-lg`}>
              <p className="message-content">{message.text}</p>
              <p className="timestamp">{formatTimestamp(message.timestamp)}</p>
            </div>
          </div>
        </div>
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
}
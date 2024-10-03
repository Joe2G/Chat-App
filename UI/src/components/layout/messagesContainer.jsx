import React from 'react';
import Messages from '../messages';
import SendMessage from '../sendMessage';

const MessagesContainer = ({ messages, sender, chatId, socket }) => {
  return (
    <>
      <div className="messages-container flex-1 overflow-y-auto">
        <Messages messages={messages} currentUser={sender} />
      </div>
      <SendMessage sender={sender} chatId={chatId} socket={socket} />
    </>
  );
};

export default MessagesContainer;
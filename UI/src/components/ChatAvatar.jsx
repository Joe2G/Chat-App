import React from 'react';
import '../App.css';

export default function ChatAvatar({ chatId }) {
  return (
    <div className="avatar">
      <div className="avatar-placeholder">
        {chatId && chatId.charAt(0).toUpperCase()}
      </div>
    </div>
  );
}
import { useState } from 'react';

export default function useChatIdHook() {
    // For demonstration, we're just generating a random chat ID
    const [chatId] = useState(`chat_${Math.floor(Math.random() * 1000)}`);
    return chatId;
}

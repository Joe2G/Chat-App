import { io } from "socket.io-client";
import { useEffect, useState } from 'react';

export default function useSocketHook(chatId) {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (chatId) {
            // Use the server's URL (update this with your server URL)
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
            const newSocket = io(apiUrl, { query: { chatId } });

            setSocket(newSocket);

            // Clean up: disconnect the socket when the component unmounts or when chatId changes
            return () => {
                newSocket.disconnect();
            };
        }
    }, [chatId]); // Add chatId as a dependency

    return socket;
}
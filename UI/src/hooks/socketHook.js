import { io } from "socket.io-client";
import { useEffect, useState } from 'react';

export default function useSocketHook(chatId) {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (chatId) {
            // Initialize a new socket connection with the chatId in the query params
            const newSocket = io("/", { query: { chatId } });
            setSocket(newSocket);

            // Clean up: disconnect the socket when the component unmounts or when chatId changes
            return () => {
                newSocket.disconnect();
            };
        }
    }, [chatId]); // Add chatId as a dependency

    return socket;
}

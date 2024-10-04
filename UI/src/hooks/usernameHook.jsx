import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
import useAppStore from '../stores/appStore'; // Import the useAppStore hook

export default function useUsernameHook() {
  const [sender, setSender] = useState({ name: '', id: null });
  const { setModal } = useAppStore(); // Access the setModal function from useAppStore

  useEffect(() => {
    const storedSender = localStorage.getItem('sender');

    if (storedSender) {
      setSender(JSON.parse(storedSender)); // Use the stored name and ID if they exist
    } else {
      // Trigger modal when no sender is found
      setModal({
        show: true,
        children: (
          <div className="p-1">
            <p>Please enter your name:</p>
            <input
              type="text"
              id="usernameInput"
              placeholder="User"
              className="input w-full p-1"
            />
          </div>
        ),
        onClick: () => {
          let usernameInput = document.getElementById('usernameInput').value.trim();

          // Set default name to 'User' if input is empty
          if (!usernameInput) {
            usernameInput = 'User';
          }

          const newSender = { name: usernameInput, id: uuidv4() }; // Generate unique ID
          setSender(newSender);
          localStorage.setItem('sender', JSON.stringify(newSender));

          // Create a new user in the backend
          const newUser = {
            username: newSender.name,
            userId: newSender.id,
          };
          fetch('https://chat-app-khaki-zeta.vercel.app/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser),
          });

          // Close the modal after entering the name
          setModal({ show: false });
        },
      });
    }
  }, []); // Empty dependency array to run this effect only once

  return sender;
}
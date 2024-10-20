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
        onClick: async () => {
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
          };

          try {
            const response = await fetch('https://chat-app-indol-tau.vercel.app/api/users', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newUser),
            });

            if (!response.ok) {
              throw new Error(`Error creating user: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('User created:', data);

            // Close the modal on success
            setModal({ show: false });
          } catch (error) {
            console.error('Error creating user:', error);
            // You can display an error message to the user here if needed
          }
        },
      });
    }
  }, []); // Empty dependency array to run this effect only once

  return sender;
}
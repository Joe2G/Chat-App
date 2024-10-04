import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Make sure this file exists in the src folder
import './index.css'; // If you have styles

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // Ensure your index.html has a div with id='root'
);

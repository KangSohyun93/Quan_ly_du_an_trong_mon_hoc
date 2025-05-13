import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './css/global.css';

console.log("TEST ENV:", import.meta.env);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
// frontend/src/components/shared/NotificationDisplay.js
import React from 'react';
import { useNotification } from './NotificationContext';
import './NotificationDisplay.css'; // Sẽ tạo file CSS này

const NotificationDisplay = () => {
    const { notification, clearNotification } = useNotification();

    if (!notification) {
        return null;
    }

    const { message, type } = notification; // type: 'success', 'error', 'info'

    return (
        <div className={`notification-display notification-${type}`}>
            <p>{message}</p>
            <button onClick={clearNotification} className="notification-close-btn">×</button>
        </div>
    );
};

export default NotificationDisplay;
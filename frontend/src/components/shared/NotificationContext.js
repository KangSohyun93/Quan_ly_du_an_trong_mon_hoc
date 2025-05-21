// frontend/src/contexts/NotificationContext.js
import React, { createContext, useState, useCallback, useContext } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null); // { message, type: 'success' | 'error' | 'info' }

    const addNotification = useCallback((message, type = 'info') => {
        setNotification({ message, type });
        // Tự động ẩn sau một khoảng thời gian
        setTimeout(() => {
            setNotification(null);
        }, 3000); // 3 giây
    }, []);

    const clearNotification = useCallback(() => {
        setNotification(null);
    }, []);

    return (
        <NotificationContext.Provider value={{ notification, addNotification, clearNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};
import { useState } from 'react';
import './Notification.css';

function NotificationSystem() {
    const [notifications, setNotifications] = useState([]);

    const showNotification = (message, type = 'info') => {
        const id = Date.now();
        const newNotification = { id, message, type };
        
        setNotifications(prev => [...prev, newNotification]);

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            removeNotification(id);
        }, 5000);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    return (
        <div>
            {/* Your main content */}
            <button onClick={() => showNotification('Story completed!', 'success')}>
                Show Success
            </button>
            <button onClick={() => showNotification('Please try again', 'error')}>
                Show Error
            </button>
            <button onClick={() => showNotification('Loading...', 'info')}>
                Show Info
            </button>
            <button onClick={() => showNotification('Are you sure?', 'warning')}>
                Show Warning
            </button>

            {/* Notification Container */}
            <div className="notification-container">
                {notifications.map(notif => (
                    <div 
                        key={notif.id} 
                        className={`notification notification-${notif.type}`}
                        onClick={() => removeNotification(notif.id)}
                    >
                        <div className="notification-icon">
                            {notif.type === 'success' && '✓'}
                            {notif.type === 'error' && '✕'}
                            {notif.type === 'warning' && '⚠'}
                            {notif.type === 'info' && 'ℹ'}
                        </div>
                        <div className="notification-message">{notif.message}</div>
                        <button 
                            className="notification-close"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notif.id);
                            }}
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default NotificationSystem;
import './LogoutModal.css';

export default function LogoutModal({ isOpen, onConfirm, onCancel, userName }) {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop overlay */}
            <div className="logout-modal-overlay" onClick={onCancel}></div>
            
            {/* Modal content */}
            <div className="logout-modal">
                <div className="logout-modal-header">
                    <i className="fa-solid fa-door-open logout-icon"></i>
                    <h2>Confirm Logout</h2>
                </div>

                <div className="logout-modal-body">
                    <p>Are you sure you want to logout, <strong>{userName}</strong>?</p>
                    <p className="logout-subtitle">You will need to login again to access your account.</p>
                </div>

                <div className="logout-modal-footer">
                    <button 
                        className="logout-btn-cancel" 
                        onClick={onCancel}
                    >
                        <i className="fa-solid fa-times"></i> Cancel
                    </button>
                    <button 
                        className="logout-btn-confirm" 
                        onClick={onConfirm}
                    >
                        <i className="fa-solid fa-sign-out-alt"></i> Yes, Logout
                    </button>
                </div>
            </div>
        </>
    );
}
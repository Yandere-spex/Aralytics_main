import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import LogoutModal from '../../Logout/LogoutModal';
import './TeacherLayout.css';

export default function TeacherLayout() {
    const { user, logout }           = useAuth();
    const navigate                   = useNavigate();
    const [showLogout, setShowLogout] = useState(false);
    const [sidebarOpen, setSidebar]   = useState(true);

    const fullName = user ? `${user.firstName} ${user.lastName}` : 'Teacher';

    return (
        <div className={`teacher-shell ${sidebarOpen ? '' : 'collapsed'}`}>

            {/* Sidebar */}
            <aside className="teacher-sidebar">
                <div className="sidebar-brand">
                    <i className="fa-solid fa-graduation-cap"></i>
                    {sidebarOpen && <span>Aralytics</span>}
                </div>

                <nav className="sidebar-nav">
                    <button className="nav-item active" onClick={() => navigate('/teacher')}>
                        <i className="fa-solid fa-chart-line"></i>
                        {sidebarOpen && <span>Dashboard</span>}
                    </button>
                    <button className="nav-item" onClick={() => navigate('/teacher/students')}>
                        <i className="fa-solid fa-users"></i>
                        {sidebarOpen && <span>Students</span>}
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <div className="sidebar-avatar">
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </div>
                        {sidebarOpen && (
                            <div className="sidebar-user-info">
                                <div className="sidebar-user-name">{fullName}</div>
                                <div className="sidebar-user-role">Teacher</div>
                            </div>
                        )}
                    </div>
                    <button className="nav-item logout-nav" onClick={() => setShowLogout(true)}>
                        <i className="fa-solid fa-door-open"></i>
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>

                <button className="sidebar-toggle" onClick={() => setSidebar(!sidebarOpen)}>
                    <i className={`fa-solid fa-chevron-${sidebarOpen ? 'left' : 'right'}`}></i>
                </button>
            </aside>

            {/* Main content area */}
            <main className="teacher-main">
                <Outlet />
            </main>

            {/* Reuse your existing LogoutModal */}
            <LogoutModal
                isOpen={showLogout}
                onConfirm={logout}
                onCancel={() => setShowLogout(false)}
                userName={fullName}
            />
        </div>
    );
}
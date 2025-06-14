import React from 'react';
import { FaUserCircle, FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import './CustomerProfile.css';

const Customerprofile = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useUser();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="profile-container">
      <div className="content-wrapper">
        {loading ? (
          <div className="profile-card">
            <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
          </div>
        ) : !user ? (
          <div className="profile-card">
            <div className="profile-header">
              <FaUserCircle className="profile-icon" />
              <h2 className="profile-name">Guest User</h2>
              <p className="profile-email">Please log in to see your profile</p>
            </div>
            <div className="profile-options">
              <button onClick={() => navigate('/DeliveryAddress')}>Delivery Address</button>
              <button onClick={() => navigate('/support')}>Support Options</button>
            </div>
            <div className="logout-section">
              <button onClick={() => navigate('/')}>Go to Login</button>
            </div>
          </div>
        ) : (
          <div className="profile-card">
            <div className="profile-header">
              <FaUserCircle className="profile-icon" />
              <h2 className="profile-name">{user.name || user.fullName || 'User'}</h2>
              <p className="profile-email">{user.email}</p>
            </div>
            <div className="profile-options">
              <button onClick={() => navigate('/DeliveryAddress')}>Delivery Address</button>
              <button onClick={() => navigate('/support')}>Support Options</button>
            </div>
            <div className="logout-section">
              <button onClick={handleLogout}>Log Out</button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom navigation bar */}
      <div className="bottom-nav">
        <div className="nav-item" onClick={() => navigate('/home')}>
          <FaHome size={22} />
          <p>Home</p>
        </div>
      </div>
    </div>
  );
};

export default Customerprofile;

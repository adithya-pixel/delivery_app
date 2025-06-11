import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext'; // Import from parent directory
import './CustomerProfile.css';

const Customerprofile = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useUser();

  const handleLogout = () => {
    console.log('Logging out...');
    logout();
    navigate('/'); // Navigate back to login page
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <div style={{textAlign: 'center', padding: '20px'}}>Loading...</div>
        </div>
      </div>
    );
  }

  // If no user data, show default or redirect to login
  if (!user) {
    return (
      <div className="profile-container">
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
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Profile Info */}
        <div className="profile-header">
          <FaUserCircle className="profile-icon" />
          <h2 className="profile-name">{user.name || user.fullName || 'User'}</h2>
          <p className="profile-email">{user.email}</p>
        </div>

        {/* Action Buttons */}
        <div className="profile-options">
          <button onClick={() => navigate('/DeliveryAddress')}>Delivery Address</button>
          <button onClick={() => navigate('/support')}>Support Options</button>
        </div>

        {/* Logout */}
        <div className="logout-section">
          <button onClick={handleLogout}>Log Out</button>
        </div>
      </div>
    </div>
  );
};

export default Customerprofile;
import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import './CustomerProfile.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Customerprofile = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useUser();

  const handleLogout = () => {
    console.log('Logging out...');
    logout();

    toast.success('Logged out successfully', {
      position: 'top-center',
      autoClose: 2000,
      pauseOnHover: false,
      hideProgressBar: false,
    });

    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
        </div>
      </div>
    );
  }

  // Guest View
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

  // Logged-in View
  return (
    <div className="profile-container">
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
    </div>
  );
};

export default Customerprofile;

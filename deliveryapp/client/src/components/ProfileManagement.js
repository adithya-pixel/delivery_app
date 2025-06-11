import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css'; // Using the same CSS file
import { MdEmail, MdArrowBack } from 'react-icons/md';
import { FaPhone, FaUser, FaSave } from 'react-icons/fa';
import { useUser } from '../UserContext';

const ProfileManagement = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_no: '',
  });

  const [originalData, setOriginalData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const navigate = useNavigate();
  const { user, updateUser } = useUser();

  // Fetch user profile data on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const userData = response.data;
      const profileData = {
        name: userData.name || '',
        email: userData.email || '',
        phone_no: userData.phone_no || '',
      };

      setFormData(profileData);
      setOriginalData(profileData);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
      } else {
        toast.error('Failed to fetch profile data', {
          position: "bottom-center",
          autoClose: 3000,
        });
      }
    } finally {
      setFetchingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone_no) {
      newErrors.phone_no = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone_no)) {
      newErrors.phone_no = 'Invalid phone number (10 digits)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Check if any data has changed
    const hasChanges = Object.keys(formData).some(
      key => formData[key] !== originalData[key]
    );

    if (!hasChanges) {
      toast.info('No changes detected', {
        position: "bottom-center",
        autoClose: 2000,
      });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/api/user/profile',
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Update context with new user data
      if (updateUser) {
        updateUser({
          ...user,
          name: formData.name,
          email: formData.email,
        });
      }

      setOriginalData(formData);

      toast.success('Profile updated successfully!', {
        position: "bottom-center",
        autoClose: 3000,
      });

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage, {
        position: "bottom-center",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setErrors({});
  };

  const handleBackToProfile = () => {
    navigate('/customerprofile');
  };

  if (fetchingData) {
    return (
      <div className="in-body">
        <div className="log">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="in-body">
      <div className="log">
        <ToastContainer />
        
        {/* Header with back button */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '20px',
          cursor: 'pointer'
        }}>
          <MdArrowBack 
            size={24} 
            onClick={handleBackToProfile}
            style={{ marginRight: '10px', color: '#007BFF' }}
          />
          <h1 style={{ margin: 0 }}>Profile Management</h1>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="input-box">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            <FaUser className="icon" />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="input-box">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            <MdEmail className="icon" />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {/* Phone Number */}
          <div className="input-box">
            <input
              type="text"
              name="phone_no"
              placeholder="Phone Number"
              value={formData.phone_no}
              onChange={handleChange}
              className={errors.phone_no ? 'error' : ''}
              maxLength="10"
            />
            <FaPhone className="icon" />
            {errors.phone_no && <span className="error-message">{errors.phone_no}</span>}
          </div>

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            marginTop: '20px' 
          }}>
            <button 
              type="submit" 
              disabled={loading}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <FaSave size={16} />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            
            <button 
              type="button" 
              onClick={handleCancel}
              style={{
                flex: 1,
                backgroundColor: '#6c757d',
                border: 'none',
                padding: '10px',
                borderRadius: '5px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px'
              }}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Info Section */}
        <div style={{
          marginTop: '30px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#6c757d'
        }}>
          <p><strong>Note:</strong></p>
          <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
            <li>Phone number must be exactly 10 digits</li>
            <li>Email address must be valid and unique</li>
            <li>Changes will be saved immediately after clicking "Save Changes"</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;
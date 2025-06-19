import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css'; // reuse styling

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      toast.success('Reset link sent to your email');
    } catch (err) {
      const error = err.response?.data?.message || 'Failed to send reset link';
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="in-body">
      <div className="log">
        <ToastContainer />
        <h1>Forgot Password</h1>
        <form onSubmit={handleForgotPassword}>
          <div className="input-box">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
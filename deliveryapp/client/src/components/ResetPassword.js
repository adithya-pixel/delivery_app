import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

const handleReset = async (e) => {
  e.preventDefault();
  if (password !== confirm) {
    toast.error("Passwords do not match");
    return;
  }

  try {
    await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
    toast.success("Password reset successful. Redirecting to login...", {
      onClose: () => navigate('/')
    });
  } catch (err) {
    toast.error("Invalid or expired token");
  }
};


  return (
    <div className="in-body">
      <div className="log">
        <ToastContainer />
        <h1>Reset Password</h1>
        <form onSubmit={handleReset}>
          <div className="input-box">
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
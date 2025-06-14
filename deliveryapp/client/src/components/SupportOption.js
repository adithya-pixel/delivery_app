import React, { useState } from 'react';
import axios from 'axios';
import { FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './SupportOption.css';

const SupportOptions = () => {
  const navigate = useNavigate();
  const [activeOption, setActiveOption] = useState(null);
  const [complaint, setComplaint] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleComplaintSubmit = async () => {
    if (complaint.trim()) {
      try {
        const response = await axios.post(
          'http://localhost:5000/api/feedback',
          { complaints: complaint },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        console.log(response.data.message);
        setSubmitted(true);
        setComplaint('');
      } catch (error) {
        console.error('Failed to submit complaint:', error);
        alert('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="support-container">
      <h2>Support Options</h2>

      <div className="support-buttons">
        <button
          className={`support-button contact-button ${activeOption === 'contact' ? 'active' : ''}`}
          onClick={() => {
            setActiveOption('contact');
            setSubmitted(false);
          }}
        >
          Contact Us
        </button>

        <button
          className={`support-button complaint-button ${activeOption === 'complaint' ? 'active' : ''}`}
          onClick={() => {
            setActiveOption('complaint');
            setSubmitted(false);
          }}
        >
          Complaint
        </button>
      </div>

      <div className="support-content">
        {activeOption === 'contact' && (
          <div className="contact-info">
            <p><strong>Phone:</strong> +91 98765 43210</p>
            <p><strong>Email:</strong> support@deliveryapp.com</p>
          </div>
        )}

        {activeOption === 'complaint' && (
          <div className="complaint-form">
            {submitted ? (
              <p className="thank-you">✅ Complaint submitted successfully!</p>
            ) : (
              <>
                <textarea
                  placeholder="Write your complaint here..."
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                />
                <button className="submit-btn" onClick={handleComplaintSubmit}>
                  Submit
                </button>
              </>
            )}
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

export default SupportOptions;

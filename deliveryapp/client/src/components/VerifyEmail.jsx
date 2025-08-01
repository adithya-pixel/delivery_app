import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './VerifyEmail.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im';

const VerifyEmail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying...");
  const [status, setStatus] = useState("loading"); // 'loading' | 'success' | 'error'

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/verify-email/${token}`);
        setMessage(res.data.message || "Email verified successfully!");
        setStatus("success");
      } catch (err) {
        setMessage(err.response?.data?.message || "Verification failed or token expired.");
        setStatus("error");
      }
    };
    verify();
  }, [token]);

  return (
    <div className="verify-container">
      <div className="verify-box">
        {status === "loading" && <ImSpinner2 className="spinner" />}
        {status === "success" && <FaCheckCircle className="icon success" />}
        {status === "error" && <FaTimesCircle className="icon error" />}

        <h2>Email Verification</h2>
        <p className={`message ${status}`}>{message}</p>
      </div>
    </div>
  );
};

export default VerifyEmail;
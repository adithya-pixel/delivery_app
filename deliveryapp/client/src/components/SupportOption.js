import React, { useState } from 'react'; 
import './SupportOption.css'; 
const SupportOptions = () => { 
const [activeOption, setActiveOption] = useState(null); 
const [complaint, setComplaint] = useState(''); 
const [submitted, setSubmitted] = useState(false); 
const handleComplaintSubmit = () => { 
if (complaint.trim()) { 
console.log('Complaint submitted:', complaint); 
setSubmitted(true); 
      setComplaint(''); 
    } 
  }; 
 
  return ( 
    <div className="support-container"> 
      <h2>Support Options</h2> 
 
      <div className="support-buttons"> 
        <button 
          className={`support-button contact-button ${activeOption === 
'contact' ? 'active' : ''}`} 
          onClick={() => { 
            setActiveOption('contact'); 
            setSubmitted(false); 
          }} 
        > 
          Contact Us 
        </button> 
 
        <button 
          className={`support-button complaint-button ${activeOption 
=== 'complaint' ? 'active' : ''}`} 
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
              <p className="thank-you">   Complaint submitted 
successfully!</p> 
            ) : ( 
              <> 
                <textarea 
                  placeholder="Write your complaint here..." 
                  value={complaint} 
                  onChange={(e) => setComplaint(e.target.value)} 
                /> 
                <button className="submit-btn" 
onClick={handleComplaintSubmit}> 
                  Submit 
                </button> 
              </> 
            )} 
          </div> 
        )} 
      </div> 
    </div> 
  ); 
}; 
 
export default SupportOptions;
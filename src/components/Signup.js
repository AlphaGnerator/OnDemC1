// In src/components/Signup.js (FINAL, SIMPLIFIED - NO "YEARS OF EXPERIENCE")

import React, { useState } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://odc-api-289803954008.asia-south1.run.app/api';

const CheckmarkIcon = () => ( <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/><path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>);

function Signup() {
  const navigate = useNavigate();
  const [view, setView] = useState('form'); 
  const [formData, setFormData] = useState({ 
    full_name: '', phone_number: '', password: '', 
    address_line_1: '', city: '', pincode: ''
    // "years_of_experience" has been removed from the state
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      // --- THE PAYLOAD IS NOW SIMPLER ---
      const cookPayload = {
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        username: formData.phone_number,
        password: formData.password,
        // "years_of_experience" is no longer sent
        kyc_status: 'PENDING', // Set to PENDING as we have no KYC step
      };
      
      const cookResponse = await axios.post(`${API_URL}/cooks/`, cookPayload);
      const newCookId = cookResponse.data.id;

      const serviceAreaResponse = await axios.post(`${API_URL}/service-areas/`, {
        pincode: formData.pincode, city: formData.city, name: formData.address_line_1
      });
      const serviceAreaId = serviceAreaResponse.data.id;
      await axios.patch(`${API_URL}/cooks/${newCookId}/`, { service_area_ids: [serviceAreaId] });
      
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
      setView('success');

    } catch (err) {
      console.error("Submission Error:", err.response?.data || err.message);
      setError('An error occurred. A user with this phone number may already exist.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (view === 'success') {
    return (
      <div className="success-container">
        <CheckmarkIcon />
        <h2>Welcome Aboard! 🎉</h2>
        <p>Thank you for signing up. You're now part of the network!</p>
        <p className="small-link">You can now <button type="button" onClick={() => navigate('/login')} className="link-button">Login</button></p>
      </div>
    );
  }

  // This is the main form view
  return (
    <div>
        <header>
            <h1>Join Our Cook Network 👩‍🍳</h1>
            <p>Fill in your details below to get started.</p>
        </header>
        <form onSubmit={handleSubmit}>
            <div className="form-group"><label htmlFor="full_name">Full Name ✍️</label><input id="full_name" name="full_name" type="text" placeholder="e.g., Ramesh Kumar" value={formData.full_name} onChange={handleChange} required /></div>
            <div className="form-group"><label htmlFor="phone_number">Mobile Number (This will be your Login ID) 📱</label><input id="phone_number" name="phone_number" type="tel" placeholder="e.g., 9876543210" value={formData.phone_number} onChange={handleChange} required /></div>
            <div className="form-group"><label htmlFor="password">Create a Password</label><input id="password" name="password" type="password" placeholder="Choose a secure password" value={formData.password} onChange={handleChange} required /></div>
            <div className="form-group"><label htmlFor="address_line_1">Where are you based out of? 📍</label><input id="address_line_1" name="address_line_1" type="text" placeholder="Apartment, Street, or Area" value={formData.address_line_1} onChange={handleChange} required /><div className="city-pincode"><input name="city" type="text" placeholder="City" value={formData.city} onChange={handleChange} required /><input name="pincode" type="text" placeholder="Pincode" value={formData.pincode} onChange={handleChange} required /></div></div>
            
            {/* The "Years of Experience" input has been REMOVED */}
            
            {error && <p className="error-message">{error}</p>}
            
            <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Join the Network'}
            </button>
        </form>
        <p className="small-link" style={{marginTop: '30px'}}>
             Already have an account? <button type="button" onClick={() => navigate('/login')} className="link-button">Login here</button>
        </p>
    </div>
  );
}

export default Signup;
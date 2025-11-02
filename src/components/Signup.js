// In src/components/Signup.js

import React, { useState } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';

const GCS_BUCKET_NAME = 'odc-kyc-documents-project-cod-476918';
const API_URL = 'https://odc-api-289803954008.asia-south1.run.app/api';

const CheckmarkIcon = () => (
  <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
    <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
    <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
  </svg>
);

function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ 
    full_name: '', phone_number: '', password: '', 
    address_line_1: '', city: '', pincode: '', years_of_experience: '' 
  });
  const [kycFile, setKycFile] = useState(null);
  const initialAvailability = [
    { day: 'Monday', day_of_week: 0, active: false, slots: [{ start: '08:00', end: '11:00' }] }, 
    { day: 'Tuesday', day_of_week: 1, active: false, slots: [{ start: '08:00', end: '11:00' }] }, 
    { day: 'Wednesday', day_of_week: 2, active: false, slots: [{ start: '08:00', end: '11:00' }] }, 
    { day: 'Thursday', day_of_week: 3, active: false, slots: [{ start: '08:00', end: '11:00' }] }, 
    { day: 'Friday', day_of_week: 4, active: false, slots: [{ start: '08:00', end: '11:00' }] }, 
    { day: 'Saturday', day_of_week: 5, active: false, slots: [{ start: '08:00', end: '11:00' }] }, 
    { day: 'Sunday', day_of_week: 6, active: false, slots: [{ start: '08:00', end: '11:00' }] },
  ];
  const [availability, setAvailability] = useState(initialAvailability);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setKycFile(e.target.files[0]);
  const goBack = () => setStep(step - 1);
  const goToNextStep = (e) => { e.preventDefault(); setStep(step + 1); };

  const handleDayToggle = (index) => { const newAvailability = [...availability]; newAvailability[index].active = !newAvailability[index].active; setAvailability(newAvailability); };
  const handleSlotChange = (dayIndex, slotIndex, field, value) => { const newAvailability = [...availability]; newAvailability[dayIndex].slots[slotIndex][field] = value; setAvailability(newAvailability); };
  const addSlot = (dayIndex) => { const newAvailability = [...availability]; newAvailability[dayIndex].slots.push({ start: '13:00', end: '16:00' }); setAvailability(newAvailability); };

// In Signup.js (The Cleaned-Up handleSubmit)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStep(3); // CHANGE: Now this is the Submitting step
    setError('');

    try {
      // 1. Create Cook and get the ID (Payload is now clean)
      const cookPayload = {
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        username: formData.phone_number,
        password: formData.password,
        years_of_experience: Number(formData.years_of_experience) || 0,
        kyc_document_url: '', // Explicitly set to blank/empty
        kyc_status: 'PENDING', // The correct starting status
      };
      
      const cookResponse = await axios.post(`${API_URL}/cooks/`, cookPayload);
      const newCookId = cookResponse.data.id;

      // 2. Create Service Area and link (Remaining logic is unchanged)
      const serviceAreaPayload = {
        pincode: formData.pincode, city: formData.city, name: formData.address_line_1
      };
      const serviceAreaResponse = await axios.post(`${API_URL}/service-areas/`, serviceAreaPayload);
      const serviceAreaId = serviceAreaResponse.data.id;
      await axios.patch(`${API_URL}/cooks/${newCookId}/`, { service_area_ids: [serviceAreaId] });
      
// 4. Create Availability Slots (FIXED, ROBUST VERSION)
      const slotsToCreate = [];
      for (const day of availability) {
          if (day.active) {
              for (const slot of day.slots) {
// Inside the loop for slotsToCreate:
                    slotsToCreate.push({
                        cook: newCookId, 
                        day_of_week: day.day_of_week, 
                        start_time: slot.start + ':00', // <-- THE FIX: Add seconds
                        end_time: slot.end + ':00'      // <-- THE FIX: Add seconds
                    });
              }
          }
      }
      
      // Send the request. We don't care about the response, just that it doesn't crash.
      for (const slotPayload of slotsToCreate) {
          await axios.post(`${API_URL}/availability-slots/`, slotPayload);
      }
      // ----------------------------------------------------
      
      // 4. Success!
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
      setStep(4); // CHANGE: Success step is now 4
      
    } catch (err) {
      setError('An error occurred. A user with this phone number may already exist.');
      setStep(1);
    }
  };
  
  const renderContent = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={goToNextStep}>
            <div className="form-group"><label htmlFor="full_name">Full Name ✍️</label><input id="full_name" name="full_name" type="text" placeholder="e.g., Ramesh Kumar" value={formData.full_name} onChange={handleChange} required /></div>
            <div className="form-group"><label htmlFor="phone_number">Mobile Number (This will be your Login ID) 📱</label><input id="phone_number" name="phone_number" type="tel" placeholder="e.g., 9876543210" value={formData.phone_number} onChange={handleChange} required /></div>
            <div className="form-group"><label htmlFor="password">Create a Password</label><input id="password" name="password" type="password" placeholder="Choose a secure password" value={formData.password} onChange={handleChange} required /></div>
            <div className="form-group"><label htmlFor="address_line_1">Where are you based out of? 📍</label><input id="address_line_1" name="address_line_1" type="text" placeholder="Apartment, Street, or Area" value={formData.address_line_1} onChange={handleChange} required /><div className="city-pincode"><input name="city" type="text" placeholder="City" value={formData.city} onChange={handleChange} required /><input name="pincode" type="text" placeholder="Pincode" value={formData.pincode} onChange={handleChange} required /></div></div>
            <button type="submit" className="submit-btn">Next: Set Availability</button>
          </form>
        );
      // In Signup.js - The CORRECTED case 2 block

      case 2:
        return ( 
          <form onSubmit={handleSubmit}> {/* <-- Calls final handleSubmit */}
            <div className="availability-grid">
              {availability.map((day, dayIndex) => (
                <div key={dayIndex} className={`day-card ${day.active ? 'active' : ''}`}>
                  <div className="day-header" onClick={() => handleDayToggle(dayIndex)}>
                    <input type="checkbox" checked={day.active} readOnly />
                    <label>{day.day}</label>
                  </div>
                  {day.active && (
                    <div className="slots-container">
                      {day.slots.map((slot, slotIndex) => (
                        <div key={slotIndex} className="time-inputs">
                          <input type="time" value={slot.start} onChange={(e) => handleSlotChange(dayIndex, slotIndex, 'start', e.target.value)} />
                          <span>to</span>
                          <input type="time" value={slot.end} onChange={(e) => handleSlotChange(dayIndex, slotIndex, 'end', e.target.value)} />
                        </div>
                      ))}
                      <button type="button" className="add-slot-btn" onClick={() => addSlot(dayIndex)}>+ Add another slot</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="button-group">
                <button type="button" className="back-btn" onClick={goBack}>Back</button>
                <button type="submit" className="submit-btn">Finish Signup</button> {/* <-- Calls final submit */}
            </div>
          </form>
        );
      case 3:
        return <div className="spinner"></div>;
      case 4:
        return ( 
          <div className="success-container">
            <CheckmarkIcon />
            <h2>Welcome Aboard! 🎉</h2>
            <p>Thank you for signing up. You're now part of the network!</p>
            <p className="small-link">You can now <button type="button" onClick={() => navigate('/login')} className="link-button">Login</button></p>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div>
        <header>
            <h1>Join Our Cook Network 👩‍🍳</h1>
            {step === 1 && <p>Step 1: Your Profile & Login</p>}
            {step === 2 && <p>Step 2: Your Weekly Availability</p>}
            {step === 3 && <p>Step 3: Identity Verification</p>}
        </header>
        {renderContent()}
        <p className="small-link" style={{marginTop: '30px'}}>
             Already have an account? <button type="button" onClick={() => navigate('/login')} className="link-button">Login here</button>
        </p>
    </div>
  );
}

export default Signup;
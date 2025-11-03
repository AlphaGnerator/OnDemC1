// In src/components/SetAvailability.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://odc-api-289803954008.asia-south1.run.app/api';

function SetAvailability() {
    const navigate = useNavigate();
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
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    const handleDayToggle = (index) => { const newAvailability = [...availability]; newAvailability[index].active = !newAvailability[index].active; setAvailability(newAvailability); };
    const handleSlotChange = (dayIndex, slotIndex, field, value) => { const newAvailability = [...availability]; newAvailability[dayIndex].slots[slotIndex][field] = value; setAvailability(newAvailability); };
    const addSlot = (dayIndex) => { const newAvailability = [...availability]; newAvailability[dayIndex].slots.push({ start: '13:00', end: '16:00' }); setAvailability(newAvailability); };
    const removeSlot = (dayIndex, slotIndex) => { const newAvailability = [...availability]; newAvailability[dayIndex].slots.splice(slotIndex, 1); setAvailability(newAvailability); };

    const handleSave = async () => {
        setIsSaving(true);
        setError('');
        const token = localStorage.getItem('access_token');
        try {
            const slotsPayload = [];
            availability.filter(d => d.active).forEach(day => {
                day.slots.forEach(slot => {
                    slotsPayload.push({
                        day_of_week: day.day_of_week,
                        start_time: slot.start + ':00',
                        end_time: slot.end + ':00'
                    });
                });
            });
            
            await axios.post(`${API_URL}/cook/availability/`, { slots: slotsPayload }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            navigate('/dashboard'); // On success, go to the dashboard

        } catch (err) {
            setError('Failed to save your schedule. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div>
            <header>
                <h1>Set Your Weekly Schedule 🗓️</h1>
                <p>This is a one-time setup. You can change this later from your dashboard.</p>
            </header>
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
                          <button className="remove-slot-btn" onClick={() => removeSlot(dayIndex, slotIndex)}>×</button>
                        </div>
                      ))}
                      <button type="button" className="add-slot-btn" onClick={() => addSlot(dayIndex)}>+ Add another slot</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {error && <p className="error-message">{error}</p>}
            <button className="submit-btn" onClick={handleSave} disabled={isSaving} style={{marginTop: '20px'}}>
                {isSaving ? 'Saving...' : 'Save and Go to Dashboard'}
            </button>
        </div>
    );
}

export default SetAvailability;
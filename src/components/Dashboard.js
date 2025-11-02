// In src/components/Dashboard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://odc-api-289803954008.asia-south1.run.app/api';

function Dashboard({ onLogout }) {
    const navigate = useNavigate();
    const [summary, setSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) {
                if (onLogout) onLogout();
                return;
            }
            try {
                const response = await axios.get(`${API_URL}/cook-dashboard/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSummary(response.data);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    alert('Session expired. Please log in again.');
                    if (onLogout) onLogout();
                } else {
                    setError('Could not load dashboard data.');
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, [onLogout]);

    if (isLoading) { return <div className="spinner-dashboard"></div>; }
    if (error || !summary) { return ( <div className="error-container"><p className="error-message">{error || "No data available."}</p><button className="back-btn" onClick={onLogout}>Logout</button></div> ); }
    
    return (
        <div className="dashboard-container">
            <h2>Welcome Back, Cook! 🚀</h2>
            <div className="stats-cards">
                <div className="card"><h3>💰 Total Earnings</h3><p className="big-number">₹{summary.total_earnings}</p></div>
                <div className="card"><h3>🗓️ Upcoming Tasks</h3><p className="big-number">{summary.upcoming_schedule.length}</p></div>
            </div>
            <h3 style={{marginTop: '30px'}}>Your Next 5 Tasks:</h3>
            {summary.upcoming_schedule.length > 0 ? (
                <ul className="task-list">{summary.upcoming_schedule.map((task) => ( <li key={task.id} className="task-item"><p><strong>{task.dish.name}</strong> @ {task.start_time.substring(0, 5)} on {new Date(task.date).toDateString()}</p><button type="button" onClick={() => navigate(`/task/${task.id}`)} className="add-slot-btn">View Recipe Guide</button></li> )) }</ul>
            ) : ( <p>No tasks scheduled. Enjoy your rest! ☕</p> )}
            <button className="back-btn" onClick={onLogout} style={{marginTop: '40px'}}>Logout</button>
        </div>
    );
}

export default Dashboard;
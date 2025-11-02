// In admin-panel/src/App.js

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Signup from './components/Signup'; 
import Login from './components/Login';   
import Dashboard from './components/Dashboard';
import RecipeGuide from './components/RecipeGuide';
import './App.css';

const Portal = () => {
    const navigate = useNavigate();
    return (
        <div className="portal-container">
            <h1>Cook Network Access</h1>
            <p className="portal-subheading">Choose your path to the best home cooking platform.</p>
            <button className="submit-btn" onClick={() => navigate('/login')}>Cook Login 🔑</button>
            <button className="submit-btn back-btn" onClick={() => navigate('/signup')}>New Cook Signup 👩‍🍳</button>
        </div>
    );
};

const PrivateRoute = ({ children }) => {
    const isLoggedIn = !!localStorage.getItem('access_token');
    return isLoggedIn ? children : <Navigate to="/login" />;
};

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access_token'));

    const handleLoginSuccess = () => setIsLoggedIn(true);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsLoggedIn(false);
    };

    return (
        <BrowserRouter>
            <div className="container">
                <div className="form-container">
                    <Routes>
                        <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Portal />} />
                        <Route path="/login" element={!isLoggedIn ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/dashboard" />} />
                        <Route path="/signup" element={!isLoggedIn ? <Signup /> : <Navigate to="/dashboard" />} />
                        <Route path="/dashboard" element={<PrivateRoute><Dashboard onLogout={handleLogout} /></PrivateRoute>} />
                        <Route path="/task/:taskId" element={<PrivateRoute><RecipeGuide /></PrivateRoute>} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

// --- ALL YOUR SUNNY STYLES ARE HERE ---
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
  body { background-color: #FFF9E0; font-family: 'Poppins', sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
  .container { width: 100%; max-width: 550px; padding: 20px; }
  .form-container { background-color: #FFFFFF; padding: 40px 50px; border-radius: 16px; box-shadow: 0 8px 32px rgba(143, 85, 0, 0.08); text-align: center; }
  header h1, .portal-container h1, .login-container h2, .dashboard-container h2 { font-size: 28px; font-weight: 700; color: #4A2B00; margin-bottom: 8px; }
  header p, .portal-subheading { font-size: 16px; color: #8C6A42; margin-bottom: 30px; }
  .form-group { margin-bottom: 25px; text-align: left; }
  .form-group label { display: block; font-size: 14px; font-weight: 600; color: #634520; margin-bottom: 8px; }
  .form-group input { width: 100%; padding: 14px 16px; border: 1px solid #FFE6BF; border-radius: 8px; font-size: 16px; font-family: 'Poppins', sans-serif; box-sizing: border-box; transition: border-color 0.2s, box-shadow 0.2s; }
  .form-group input:focus { outline: none; border-color: #FF8C42; box-shadow: 0 0 0 3px rgba(255, 140, 66, 0.2); }
  .submit-btn { width: 100%; padding: 16px; border: none; border-radius: 8px; background: linear-gradient(90deg, #FFB86B 0%, #FF8C42 100%); color: white; font-size: 16px; font-weight: 600; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; margin-bottom: 10px; }
  .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(255, 140, 66, 0.4); }
  .back-btn { background: #EAEAEA; border: 1px solid #D1D1D1; color: #333; }
  .error-message { color: #D93025; font-size: 14px; text-align: center; }
  .portal-container { padding: 50px 0; }
  .link-button { background: none; border: none; color: #FF8C42; font-weight: 600; cursor: pointer; padding: 0; font-size: 16px; }
  .small-link { font-size: 14px; color: #6E7B96; margin-top: 20px; }
  .spinner-dashboard, .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #FF8C42; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 100px auto; }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  .dashboard-container { text-align: left; }
  .stats-cards { display: flex; gap: 20px; margin-top: 20px; }
  .card { flex: 1; background: #FFF9F0; padding: 20px; border-radius: 8px; border: 1px solid #FFE6BF; }
  .card h3 { margin-top: 0; font-size: 16px; color: #8C6A42; }
  .card .big-number { font-size: 32px; font-weight: 700; color: #4A2B00; margin: 0; }
  .task-list { list-style: none; padding: 0; margin-top: 20px; }
  .task-item { background: #FFF9F0; padding: 15px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #FFE6BF; }
  .task-item p { margin: 0; font-weight: 600; }
  .add-slot-btn { font-size: 12px; background: none; border: 1px dashed #FF8C42; color: #FF8C42; padding: 5px 10px; border-radius: 4px; cursor: pointer; }
  .availability-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
  .day-card { border: 1px solid #FFE6BF; border-radius: 8px; padding: 10px 15px; text-align: left; transition: all 0.2s; }
  .day-card.active { border-color: #FF8C42; background-color: #FFF9F0; }
  .day-header { display: flex; align-items: center; gap: 15px; font-weight: 600; cursor: pointer; font-size: 18px; }
  .slots-container { padding-top: 10px; margin-top: 10px; border-top: 1px solid #FFE6BF; }
  .time-inputs { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .time-inputs span { color: #8C6A42; }
  .subtitle { font-size: 12px; color: #8C6A42; margin-top: -10px; margin-bottom: 10px; }
  input[type="file"] { border: none; padding: 0; }
  .file-name { font-size: 12px; color: #007bff; margin-top: 5px; display: block; }
  .button-group { display: flex; gap: 10px; margin-top: 20px; }
  .success-container { text-align: center; padding: 20px 0; } .success-container h2 { color: #4A2B00; font-size: 24px; } .success-container p { color: #8C6A42; font-size: 16px; } .checkmark { width: 80px; height: 80px; stroke: #FF8C42; animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both; } .checkmark__circle { stroke: #FF8C42; animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards; } .checkmark__check { animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards; } @keyframes stroke { 100% { stroke-dashoffset: 0; } } @keyframes scale { 0%, 100% { transform: none; } 50% { transform: scale3d(1.1, 1.1, 1); } } @keyframes fill { 100% { box-shadow: inset 0px 0px 0px 40px #FFF9E0; } }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default App;
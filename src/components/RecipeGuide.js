// In src/components/RecipeGuide.js

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'https://odc-api-289803954008.asia-south1.run.app/api';

function RecipeGuide() {
    const { taskId } = useParams(); // Gets the task ID from the URL (e.g., /task/123)
    const [task, setTask] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTaskDetails = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) { /* handle logout */ return; }
            try {
                const response = await axios.get(`${API_URL}/tasks/${taskId}/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTask(response.data);
            } catch (err) {
                setError('Could not load task details.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchTaskDetails();
    }, [taskId]);

    if (isLoading) return <div className="spinner"></div>;
    if (error || !task) return <p className="error-message">{error}</p>;

    // --- The Recipe Guide UI ---
    return (
        <div className="recipe-guide">
            <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
            <h1>{task.dish.name}</h1>
            
            <div className="video-placeholder">
                {/* A simple placeholder, we can embed a real video player here later */}
                <p>▶️ Video Tutorial Placeholder</p>
                <small>Video URL: {task.dish.video_url || 'Not available'}</small>
            </div>

            <div className="details-grid">
                <div className="detail-item">
                    <h4>🕒 Time to Cook</h4>
                    <p>{task.dish.time_to_cook_minutes} mins</p>
                </div>
                <div className="detail-item">
                    <h4>🍳 Utensils</h4>
                    <p>{task.dish.required_utensils || 'Standard kitchen utensils'}</p>
                </div>
            </div>

            <h3>Ingredients</h3>
            <ul className="ingredient-list">
                {task.dish.ingredients.map(ing => (
                    <li key={ing.ingredient}>
                        {ing.quantity} {ing.unit} - {ing.ingredient_name}
                    </li>
                ))}
            </ul>

            <h3>Recipe Steps</h3>
            <div className="recipe-steps">
                {/* We use pre-wrap to respect newlines in the text */}
                <p style={{ whiteSpace: 'pre-wrap' }}>{task.dish.recipe_steps || 'No steps provided.'}</p>
            </div>
            
            <h3>Special Instructions</h3>
            <p>{task.dish.special_instructions || 'None'}</p>
        </div>
    );
}

export default RecipeGuide;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './questions.css';

const Questions = ({ username }) => {
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState('');
    const adminUsernames = ['Acb_admin@2026', 'admin2', 'admin3'];  // Example admin usernames

    useEffect(() => {
        console.log("Logged in as:", username);  // Debugging username
        axios.get('http://127.0.0.1:50012/questions')
            .then(response => {
                setQuestions(response.data);
            })
            .catch(error => {
                console.error('Error fetching questions:', error);
            });
    }, []);

    const addQuestion = () => {
        if (adminUsernames.includes(username)) {  // Check if the username is one of the admins
            axios.post('http://127.0.0.1:50012/questions', { question: newQuestion }, {
                headers: { 'Username': username }
            })
            .then(response => {
                setQuestions([...questions, { question: newQuestion }]);
                setNewQuestion('');  // Reset new question input
            })
            .catch(error => {
                console.error('Error adding question:', error);
                alert('You are not authorized to add questions.');
            });
        } else {
            alert('You are not authorized to add questions.');
        }
    };

    return (
        <div className="questions-container">
            <h1>Questions</h1>
            {questions.map((q, index) => (
                <div key={index} className="question-item">
                    <p>{q.question}</p>
                </div>
            ))}

            {adminUsernames.includes(username) && (
                <div className="add-question">
                    <textarea
                        value={newQuestion}
                        onChange={e => setNewQuestion(e.target.value)}
                        placeholder="Enter new question..."
                    />
                    <button onClick={addQuestion}>Add Question</button>
                </div>
            )}
        </div>
    );
};

export default Questions;

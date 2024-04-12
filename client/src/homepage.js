import React, { useState, useEffect } from 'react';
import './homepage.css';
import axios from 'axios';
import IDE from './IDE';
import Questions from './questions';  // Ensure filename case is consistent with import

const Homepage = () => {
    const [scores, setScores] = useState(0);
    const [addUsername, setAddUsername] = useState('');
    const [yourUsername, setYourUsername] = useState('');
    const [friendUsername, setFriendUsername] = useState('');
    const [friendAddStatus, setFriendAddStatus] = useState('');
    const [usernames, setUsernames] = useState([]);

    // Fetch usernames from the backend when component mounts
    useEffect(() => {
        const fetchUsernames = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:50012/get_usernames');
                setUsernames(response.data.usernames);
            } catch (error) {
                console.error('Error fetching usernames:', error);
            }
        };
        fetchUsernames();
    }, []);

    // Add username
    const handleAddUserName = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:50012/add_username', { username: yourUsername });
            if (response.data.success) {
                setAddUsername(yourUsername);
                setYourUsername('');
                // Re-fetch usernames after adding a new one
                setUsernames();  // Refactored to use the function defined above
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error adding username:', error);
        }
    };

    // Add friend
    const handleAddFriend = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:50012/add_friend', { friendUsername: friendUsername });
            setFriendAddStatus(response.data.message);
        } catch (error) {
            console.error('Error adding friend:', error);
        }
    };

    return (
        <div>
            <header className="header">
                <h2>Welcome to Alspencer Coding Bat (ACB)</h2>
            </header>
            <main className="main">
                <div className="input">
                    <p>Friend's Usernames: {usernames.join(', ')}</p>
                </div>
                <div className="action-buttons">
                    <p>Scores: {scores}</p>
                </div>
                <div className="input">
                    {addUsername ? (
                        <p>Your Username: {addUsername}</p>
                    ) : (
                        <>
                            <input
                                type="text"
                                placeholder="Add your username"
                                value={yourUsername}
                                onChange={(e) => setYourUsername(e.target.value)}
                            />
                            <button className="action-buttons" onClick={handleAddUserName}>
                                Add
                            </button>
                        </>
                    )}
                </div>
                <div className="input">
                    <input
                        type="text"
                        placeholder="Friend's username"
                        value={friendUsername}
                        onChange={(e) => setFriendUsername(e.target.value)}
                    />
                    <button className="action-buttons" onClick={handleAddFriend}>
                        Add Friend
                    </button>
                    {friendAddStatus && (
                        <p>{friendAddStatus}</p>
                    )}
                </div>
            </main>
            <div className="coding-challenge-container">
                <div className="question-pane">
                    <Questions username={yourUsername}/>  // Pass the current user's username
                </div>
                <div className="ide-container">
                    <IDE />
                </div>
            </div>
        </div>
    );
};

export default Homepage;

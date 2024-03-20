import React, { useState, useEffect } from 'react';
import './homepage.css';
import axios from 'axios';
import IDE from './IDE';

const Homepage = () => {
    const [scores, setScores] = useState(0);
    const [addUsername, setAddUsername] = useState('');
    const [yourUsername, setYourUsername] = useState('');
    const [friendUsername, setFriendUsername] = useState('');
    const [friendAddStatus, setFriendAddStatus] = useState('');

    const [usernames, setUsernames] = useState([]);

    // Fetch usernames from the backend on component mount
    useEffect(() => {
        const fetchUsernames = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:50012/get_usernames');
                setUsernames(response.data.usernames);
            } catch (error) {
                console.error('Error fetching usernames:', error.message);
            }
        };

        fetchUsernames();
    }, []);

    const handleAddUserName = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:50012/add_username', {
                username: yourUsername,
            });

            if (response.data.success) {
                setAddUsername(yourUsername);
                setYourUsername('');

                // Fetch updated usernames after adding a new one
                const updatedResponse = await axios.get('http://127.0.0.1:50012/get_usernames');
                setUsernames(updatedResponse.data.usernames);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error adding username:', error.message);
        }
    };

    const handleAddFriend = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:50012/add_friend', {
                friendUsername: friendUsername,
            });

            setFriendAddStatus(response.data.message);
        } catch (error) {
            console.error('Error adding friend:', error.message);
        }
    };

    return (
        <div>
            <header className="header">
                <h2>Welcome to Alspencer Coding bat (acb)</h2>
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
                            <button className='action-buttons' onClick={handleAddUserName}>
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
                    <button className='action-buttons' onClick={handleAddFriend}>
                        Add Friend
                    </button>
                    {friendAddStatus && (
                        <p>{friendAddStatus}</p>
                    )}
                </div>
            </main>
            <div className="ide-container">
                    <IDE />
            </div>
        </div>
    );
};

export default Homepage;

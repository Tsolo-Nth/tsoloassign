import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UsersManagement.css';

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ username: '', password: '' });
    const [updateUser, setUpdateUser] = useState({ oldUsername: '', newUsername: '', newPassword: '' });
    const [deleteUsername, setDeleteUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Fetch users from the database
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5300/users');
            setUsers(response.data);
        } catch (error) {
            setMessage('Error fetching users');
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Add a new user
    const addUser = async (e) => {
        e.preventDefault();
        if (!newUser.username || !newUser.password) {
            setMessage('Both username and password are required.');
            return;
        }
        setLoading(true);
        try {
            await axios.post('http://localhost:5300/users', newUser);
            fetchUsers(); // Refresh user list
            setMessage('User added successfully!');
            setNewUser({ username: '', password: '' });
        } catch (error) {
            setMessage(error.response?.data?.error || 'Error adding user');
        } finally {
            setLoading(false);
        }
    };

    // Update an existing user
    const updateExistingUser = async (e) => {
        e.preventDefault();
        if (!updateUser.oldUsername || !updateUser.newUsername || !updateUser.newPassword) {
            setMessage('All fields are required');
            return;
        }
        setLoading(true);
        try {
            await axios.put('http://localhost:5300/users', updateUser);
            fetchUsers(); // Refresh user list
            setMessage('User updated successfully!');
            setUpdateUser({ oldUsername: '', newUsername: '', newPassword: '' });
        } catch (error) {
            setMessage(error.response?.data?.error || 'Error updating user');
        } finally {
            setLoading(false);
        }
    };

    // Delete a user
    const deleteUser = async (e) => {
        e.preventDefault();
        if (!deleteUsername) {
            setMessage('Username is required to delete a user');
            return;
        }
        setLoading(true);
        try {
            await axios.delete('http://localhost:5300/users', { data: { username: deleteUsername } });
            fetchUsers(); // Refresh user list
            setMessage('User deleted successfully!');
            setDeleteUsername('');
        } catch (error) {
            setMessage(error.response?.data?.error || 'Error deleting user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="usersManagement">
            <h2>Users Management</h2>

            {/* Feedback Message */}
            {message && <div className="feedback-message">{message}</div>}

            {/* Add User Form */}
            <form id="addUserForm" onSubmit={addUser}>
                <label htmlFor="username">Username:</label>
                <input 
                    type="text" 
                    id="username" 
                    value={newUser.username} 
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} 
                    required 
                />
                <label htmlFor="password">Password:</label>
                <input 
                    type="password" 
                    id="password" 
                    value={newUser.password} 
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} 
                    required 
                />
                <button type="submit" disabled={loading}>Add User</button>
            </form>

            {/* Update User Form */}
            <form id="updateUserForm" onSubmit={updateExistingUser}>
                <label htmlFor="oldUsername">Old Username:</label>
                <input 
                    type="text" 
                    id="oldUsername" 
                    value={updateUser.oldUsername} 
                    onChange={(e) => setUpdateUser({ ...updateUser, oldUsername: e.target.value })} 
                    required 
                />
                <label htmlFor="newUsername">New Username:</label>
                <input 
                    type="text" 
                    id="newUsername" 
                    value={updateUser.newUsername} 
                    onChange={(e) => setUpdateUser({ ...updateUser, newUsername: e.target.value })} 
                    required 
                />
                <label htmlFor="newPassword">New Password:</label>
                <input 
                    type="password" 
                    id="newPassword" 
                    value={updateUser.newPassword} 
                    onChange={(e) => setUpdateUser({ ...updateUser, newPassword: e.target.value })} 
                    required 
                />
                <button type="submit" disabled={loading}>Update User</button>
            </form>

            {/* Delete User Form */}
            <form id="deleteUserForm" onSubmit={deleteUser}>
                <label htmlFor="deleteUsername">Username to delete:</label>
                <input 
                    type="text" 
                    id="deleteUsername" 
                    value={deleteUsername} 
                    onChange={(e) => setDeleteUsername(e.target.value)} 
                    required 
                />
                <button type="submit" disabled={loading}>Delete User</button>
            </form>

            {/* User List as Table */}
            <h3>Users List:</h3>
            <table id="usersList">
                <thead>
                    <tr>
                        <th>Username</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td>No users available</td>
                        </tr>
                    ) : (
                        users.map((user, index) => (
                            <tr key={index}>
                                <td>{user.username}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </section>
    );
};

export default UsersManagement;

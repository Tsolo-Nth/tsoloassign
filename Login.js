import React, { useState } from 'react';
import './styles.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false); // State to manage loading state
  const [errorMessage, setErrorMessage] = useState(''); // State to manage error message display

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the request is sent
    setErrorMessage(''); // Reset any previous error messages

    try {
      const response = await fetch('http://localhost:5300/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        onLogin(); // Calls the parent component's login function
        alert(data.message); // Display message from server
      } else {
        setErrorMessage(data.error || 'Login failed. Please try again.'); // Display error message if any
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An error occurred during login. Please try again later.');
    } finally {
      setLoading(false); // Set loading to false once the request is completed
    }
  };

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the request is sent
    setErrorMessage(''); // Reset any previous error messages

    // Validate fields before sending request
    if (!username || !password) {
      setErrorMessage('Username and password are required');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5300/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message); // Display success message
        setIsRegistering(false); // Switch to login mode
      } else {
        setErrorMessage(data.error || 'Registration failed. Please try again.'); // Display error message if any
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage('An error occurred during registration. Please try again later.');
    } finally {
      setLoading(false); // Set loading to false once the request is completed
    }
  };

  return (
    <section id="login">
      <h2>{isRegistering ? 'Register' : 'Login'}</h2>

      {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Display error message */}

      <form onSubmit={isRegistering ? handleRegister : handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : isRegistering ? 'Register' : 'Login'}
        </button>
      </form>

      <button onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? 'Have an account? Login' : 'No account? Register'}
      </button>
    </section>
  );
}

export default Login;

import './Login.css'; 
import React, { useState } from 'react';

function Login({ onLogin }) {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for authentication logic
    if (isCreatingAccount) {
      if (!username || !email || !password || password !== confirmPassword) {
        alert('Please fill all fields correctly for account creation.');
        return;
      }
      // Here you would add your logic to handle account creation
      console.log('Creating account...');
      // Assuming account creation is successful
      onLogin(true); // You might want to auto-login the user or redirect to a login page
    } else {
      if (username && password) {
        onLogin(true); // Trigger login success
      } else {
        alert('Please enter a username and password');
      }
    }
  };

  const toggleMode = () => {
    setIsCreatingAccount(!isCreatingAccount);
    // Reset fields when toggling
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>{isCreatingAccount ? 'Create Account' : 'Login'}</h2>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        {isCreatingAccount && (
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        )}
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {isCreatingAccount && (
          <div>
            <label>Verify Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        )}
        <button type="submit">{isCreatingAccount ? 'Create Account' : 'Login'}</button>
        <button type="button" onClick={toggleMode}>
          {isCreatingAccount ? 'Already have an account? Login' : 'Create an Account'}
        </button>
      </form>
    </div>
  );
}

export default Login;

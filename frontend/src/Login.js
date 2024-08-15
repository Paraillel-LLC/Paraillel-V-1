import React, { useState } from 'react';

function Login({ onLogin }) {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  
  const toggleMode = () => {
    setIsCreatingAccount(!isCreatingAccount);
  };

  return (
    <div className="flex-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        {isCreatingAccount ? (
          <CreateAccountForm onLogin={onLogin} toggleMode={toggleMode} />
        ) : (
          <LoginForm onLogin={onLogin} toggleMode={toggleMode} />
        )}
      </div>
    </div>
  );
}

function LoginForm({ onLogin, toggleMode }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      onLogin(true);
    } else {
      alert('Please enter a username and password');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <div>
        <label className="form-label">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input"
        />
      </div>
      <div>
        <label className="form-label">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />
      </div>
      <button type="submit" className="submit-button">
        Login
      </button>
      <button type="button" onClick={toggleMode} className="text-blue-500 hover:underline mt-4">
        
        Create an Account
      </button>
    </form>
  );
}

function CreateAccountForm({ onLogin, toggleMode }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !username || !email || !password || password !== confirmPassword) {
      alert('Please fill all fields correctly for account creation.');
      return;
    }
    console.log('Creating account...');
    onLogin(true); 
    toggleMode(); 
  };

  return (
    <form onSubmit={handleSubmit} className="form-container space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Create Account</h2>
      <div>
        <label className="form-label">First Name</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="input"
        />
      </div>
      <div>
        <label className="form-label">Last Name</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="input"
        />
      </div>
      <div>
        <label className="form-label">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input"
        />
      </div>
      <div>
        <label className="form-label">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />
      </div>
      <div>
        <label className="form-label">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />
      </div>
      <div>
        <label className="form-label">Verify Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input"
        />
      </div>
      <button type="submit" className="submit-button">
        Create Account
      </button>
      <button type="button" onClick={toggleMode} className="text-blue-500 hover:underline mt-4">
        Already have an account? Login
      </button>
    </form>
  );
}

export default Login;
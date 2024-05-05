import React from 'react';
import './LoginWrapper.css'; 

function LoginWrapper() {
  const handleCreateAccount = () => {
    window.location.href = '/CreateAccount.html';
  };

  const handleLogin = () => {
    window.location.href = '/Login.html';
  };

  return (
    <div className="login-wrapper-container">
      <h1>Login Or Create an Account</h1>
      <button onClick={handleCreateAccount}>Create Account</button>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LoginWrapper;

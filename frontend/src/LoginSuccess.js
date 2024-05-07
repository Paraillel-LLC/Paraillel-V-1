import React from 'react';
import './LoginSuccess.css';

function LoginSuccess({ onSubmit }) {
  const handleSubmit = () => {
    if (onSubmit) onSubmit();
  };

  return (
    <div className="container">
      <h1>Login Successful!</h1>
      <button onClick={handleSubmit}>Go to Home</button>
    </div>
  );
}

export default LoginSuccess;

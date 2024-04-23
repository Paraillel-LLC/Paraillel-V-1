import React from 'react';

function CreateAccountWrapper() {
  const handleLogin = () => {
    window.location.href = '/Login.html';
  };

  return (
    <div>
      <h1>Create Account</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default CreateAccountWrapper;

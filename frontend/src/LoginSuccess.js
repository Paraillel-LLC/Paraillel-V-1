import React from 'react';

function LoginSuccess({ onSubmit }) {
  const handleSubmit = () => {
    if (onSubmit) onSubmit();
  };

  return (
    <div className="flex-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
        <h1 className="text-2xl font-semibold mb-6">Login Successful!</h1>
          <button type="button" onClick={handleSubmit} className="text-blue-500 hover:underline mt-4">        
          Go to Home
        </button>
      </div>
    </div>
  );
}

export default LoginSuccess;

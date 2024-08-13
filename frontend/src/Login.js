import React, { useState } from 'react';

function Login({ onLogin }) {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  
  const toggleMode = () => {
    setIsCreatingAccount(!isCreatingAccount);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
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

  const validateLoginCredentials = async (username, password) => {
    try {
      const response = await fetch('http://localhost:5000/login', { 
          method: 'POST',
          headers: {
              'Content-Type' : 'application/json',
          },
          body: JSON.stringify({ username, password }),
      });

      if (response.ok) { 
          return true;
      } else {
          const data = await response.json();
          if (data && data.message) {
              alert(data.message);
              return false;
          }
      }
  } catch (error) {
      console.error('Error:', error);
  }
  return false;
  } 

  const handleSubmit = async (e) => {
    e.preventDefault();


    const isValidCredentials = await validateLoginCredentials(username, password);
    console.log("isValidCredentials: " + isValidCredentials);
      if (username && password && isValidCredentials) {
        onLogin(true);
        console.log("isValidCredentials: " + isValidCredentials);
        //window.location.href = '/home'; 
      } else {
      alert("Please enter a valid username and password.");
    }
    
    /*const isValidCredentials = await validateLoginCredentials(username, password, onLogin)
    
      if (username && password && isValidCredentials) {
        console.log(isValidCredentials)
        onLogin(true);
        window.location.href = '/home';
      } else {
      alert("Please enter a valid username and password.");
    }*/
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <div>
        <label className="block text-gray-700">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
        Login
      </button>
      <button type="button" onClick={toggleMode} className="w-full mt-4 text-blue-500 hover:underline">
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
  
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');

  function validateSignupCredentials() {
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setFirstNameError('');
    setLastNameError('');
    let noError = true;
   
    if (firstName.length < 1) {
      setUsernameError("firstname must be 1 characters or longer.");
      console.log("FirstName Error!")
      noError = false;
    }
    if (lastName.length < 1) {
      setUsernameError("LastName must be 1 characters or longer.");
      console.log("LastName Error!")
      noError = false;
    }
    if (username.length < 3) {
      setUsernameError("Username must be 3 characters or longer.");
      console.log("Username Error!")
      noError = false;
    }
    if (password.length < 8) {
      setPasswordError("Password must be 8 characters or longer.");
      console.log("Password Error!")
      noError = false;
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      console.log("Email error!")
      noError = false;
    }
    return noError;
  } 

  function createAccount() {
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    // Make a POST request to your Flask backend
    console.log("createAccount function called!");
    fetch('http://localhost:5000/create-account', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            firstname: firstname,
            lastname: lastname,
            username: username,
            password: password,
            email: email
        })
    })
    .then(response => {
      console.log('Response status:', response.status);
        if (response.ok) {
          onLogin(true);
          //console.log("isValidCredentials: " + isValidCredentials);
            //window.location.href = '/home';
        } else {
            return response.json();
        }
    })
    .then(data => {
        // If login is unsuccessful, show error message
        if (data && data.message) {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
  }

  
  /*function createAccount() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    // Make a POST request to your Flask backend
    console.log("createAccount function called!");

    fetch('http://localhost:5000/create-account', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password,
            email: email
        })
    })
    .then(response => {
      console.log('Response status:', response.status);
        if (response.ok) {
            window.location.href = '/home';
        } else {
            return response.json();
        }
    })
    .then(data => {
        // If login is unsuccessful, show error message
        if (data && data.message) {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
  }*/

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !username || !email || !password || password !== confirmPassword) {
      alert('Please fill all fields correctly for account creation.');
      return;
    }
    const isValidSignupCredentials = validateSignupCredentials();

    if (isValidSignupCredentials) {
      createAccount();
    } else {
      return;
    }
    console.log('Creating account...');
    onLogin(true); 
    toggleMode(); 
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Create Account</h2>
      <div>
        <label className="block text-gray-700">First Name</label>
        <input
          id="firstname"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-gray-700">Last Name</label>
        <input
          id="lastname"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-gray-700">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-gray-700">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-gray-700">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-gray-700">Verify Password</label>
        <input
          id="confirmpassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
        Create Account
      </button>
      <button type="button" onClick={toggleMode} className="w-full mt-4 text-blue-500 hover:underline">
        Already have an account? Login
      </button>
    </form>
  );
}

export default Login;

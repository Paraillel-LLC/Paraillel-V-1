import './Login.css'; 
import React, { useState } from 'react';

function Login({ onLogin }) {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  
  const toggleMode = () => {
    setIsCreatingAccount(!isCreatingAccount);
  };

  return (
    <div className="login-container">
      {isCreatingAccount ? (
        <CreateAccountForm onLogin={onLogin} toggleMode={toggleMode} />
      ) : (
        <LoginForm onLogin={onLogin} toggleMode={toggleMode} />
      )}
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
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Login</h2>
      <div>
        <label htmlFor='username'>Username</label>
        <input
          type="text"
          id='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor='password'>Password</label>
        <input
          type="password"
          id='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Login</button>
      <button type="button" onClick={toggleMode}>
        Create an Account
      </button>
    </form>
  );

}

function CreateAccountForm({ onLogin, toggleMode }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');

  function validateSignupCredentials() {
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    let noError = true;
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
    if (!username || !email || !password || password !== confirmPassword) {
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
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Create Account</h2>
      <div>
        <label htmlFor='username'>Username</label>
        <input
          type="text"
          id='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <span className='credentials-error'>{usernameError}</span>
      </div>
      <div>
        <label htmlFor='email'>Email</label>
        <input
          type="email"
          id='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
         <span className='credentials-error'>{emailError}</span>
      </div>
      <div>
        <label htmlFor='password'>Password</label>
        <input
          type="password"
          id='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
         <span className='credentials-error'>{passwordError}</span>
      </div>
      <div>
        <label htmlFor='confirmPassword'>Verify Password</label>
        <input
          type="password"
          id='confirmPassword'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <button type="submit" onClick={handleSubmit}> Create Account</button>
      <button type="button" onClick={toggleMode}>
        Already have an account? Login
      </button>
    </form>
  );
}
export default Login;
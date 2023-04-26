import React, { useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <Router>
      <div>
      <div className="navbar">
        <Link className="logo" to="/">
          AgriSync
        </Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/get-user">Get User</Link>
          <Link to="/change-user-role">Change User Role</Link>
        </div>
        <div className="auth-links">
          <Link to="/sign-in">Sign In</Link>
          <Link to="/sign-up">Sign Up</Link>
        </div>
      </div>

        <Routes>
          <Route path="/" exact element={<RegisterUser />} />
          <Route path="/get-user" element={<GetUser />} />
          <Route path="/change-user-role" element={<ChangeUserRole />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
}

function RegisterUser() {
  const [formData, setFormData] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await axios.post("http://localhost:3000/owner/register-user", formData);
    alert("User registered successfully");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Name:
          <input type="text" name="name" onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          Location:
          <input type="text" name="location" onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          Role:
          <input type="text" name="role" onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          Address:
          <input type="text" name="address" onChange={handleChange} />
        </label>
      </div>
      <button type="submit">Register User</button>
    </form>
  );
}

function GetUser() {
  const [formData, setFormData] = useState({});
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await axios.get(`http://localhost:3000/owner/get-user/${formData.address}`);
    setUserData(response.data.details);
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Address:
            <input type="text" name="address" onChange={handleChange} />
          </label>
        </div>
        <button type="submit">Get User</button>
      </form>
      {userData && (
        <div className="user-info">
          <p>name: {userData[0]}</p>
          <p>Location: {userData[1]}</p>
          <p>role: {userData[2]}</p>
          <p>address: {userData[3]}</p>
        </div>
      )}
      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

function ChangeUserRole() {
  const [formData, setFormData] = useState({});
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.patch('http://localhost:3000/owner/change-user-role', formData);
      setSuccess(true);
      setError(null);
    } catch (error) {
      setSuccess(false);
      setError('Error changing user role');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Address:
            <input type="text" name="address" onChange={handleChange} />
          </label>
        </div>
        <div>
          <label>
            Role:
            <input type="text" name="role" onChange={handleChange} />
          </label>
        </div>
        <button type="submit">Change User Role</button>
      </form>
      {success && <p>User role changed successfully</p>}
      {error && <p>{error}</p>}
    </div>
  );
}

function SignIn() {
  const [email,setEmail]=useState('');
  const [password, setPassword]= useState('');
  const [error, setError]= useState(null);
  const navigate=useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call authentication API to sign in user
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <h2>Sign In</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}


function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      // Call authentication API to sign up user
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <h2>Sign Up</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}


export default App;

import React, { useState } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,

} from "react-router-dom";
import './styles/App.css';
import Owner from "./Components/Owner";
import Farmer from './Components/Farmer';
import Processor from "./Components/Processor";




function App() {
  return (
      <Router>
            <Routes>
              <Route path="/" exact element={<Home/>}/>
              <Route path="/register" element={<RegisterUser />} />
              <Route path="/get-user" element={<GetUser />} />
              <Route path="/change-user-role" element={<ChangeUserRole />} />
              <Route path="/sign-in" element={<SignIn />} />
              {/* <Route path="/page-a" element={<PageA />} />
              <Route path="/page-b" element={<PageB />} />
              <Route path="/page-c" element={<PageC />} />
              <Route path="/page-d" element={<PageD />} />
              <Route path="/page-e" element={<PageE />} /> */}
              <Route path="/farmer/*" element={<Farmer/>} />
              <Route path="/processor/*" element={<Processor/>} />
              <Route path="/owner/*" element={<Owner/>} />

            </Routes>
      </Router>
  );
}


function Home(){
  return(
      <div>
        <div>
          <div className="navbar">
            <Link className="logo" to="/">
              AgriSync
            </Link>
            {/* <div className="nav-links">
              <Link to="/register">Register</Link>
              <Link to="/get-user">Get User</Link>
              <Link to="/change-user-role">Change User Role</Link>
            </div> */}
            <div className="auth-links">
              <Link to="/sign-in">Sign In</Link>
              <Link to="/sign-up">Sign Up</Link>
            </div>
          </div>

          <center id="intro">
          <h1 margin-top="0px">Welcome to AgriSync</h1>
          </center>

        </div>

        <div>
          <div class="Row">
            {/* <div class="Column">
              <Link to="/owner"><img src="https://thumbor.forbes.com/thumbor/fit-in/x/https://www.forbes.com/advisor/in/wp-content/uploads/2022/03/pexels-pixabay-315788-scaled.jpg"/>
              </Link>
              <p>Owner</p>
            </div> */}

            <div class="Column">
              <Link to="/farmer"><img src="https://thumbs.dreamstime.com/b/indian-farmer-holding-crop-plant-his-wheat-field-indian-farmer-holding-crop-plant-his-wheat-field-123557695.jpg"/>
              </Link>
              <p>farmer</p>
            </div>

            <div class="Column">
              <Link to="/processor"><img src="https://cdn.thewire.in/wp-content/uploads/2017/12/28145521/agriculture-copy.jpg"/>
              </Link>
              <p>processor</p>
            </div>

            <div class="Column">
              <Link to="/Transporter"><img alt="" src="https://5.imimg.com/data5/SELLER/Default/2022/7/EO/NA/JP/114450031/vegetable-truck-transportation-service-500x500.jpg"/>
              </Link>
              <p>Transporter</p>
            </div>
      
          </div>

          <div class="Row">
            

            <div class="Column">
              <Link to="/Wholesaler"><img src="https://bsmedia.business-standard.com/_media/bs/img/article/2018-01/16/full/1516085884-7318.jpg?im=FeatureCrop,width=826,height=465"/>
              </Link>
              <p>Wholesaler</p>
            </div>

            <div class="Column">
              <Link to="/Retailer"><img src="https://im.rediff.com/money/2014/sep/19veg4.jpg?w=670&h=900"/>
              </Link>
              <p>Retailer</p>
            </div>

            <div class="Column"> 
              <Link to="/Customer"><img src="https://c.ndtvimg.com/2022-11/95b65ar_india-inflation-reuters_625x300_10_November_22.jpg?im=FitAndFill,algorithm=dnn,width=650,height=400"/>
              </Link>
              <p>Customer</p>
            </div>
          </div>

          {/* <div class="Row">
            
          </div> */}
        </div>
      </div>
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





export default App;
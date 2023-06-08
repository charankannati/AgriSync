import React, { useState, useEffect } from "react";
import Web3 from "web3";
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
import Processor from "./Components/processor";
import Transporter from "./Components/transporter";
import Wholesaler from "./Components/Wholesaler";
import Distributor from "./Components/Distributor";
import Retailer from "./Components/Retailer";



function App() {
  useEffect(() => {
    loadWeb3();
  }, []);

  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  return (
      <Router>
            <Routes>
              <Route path="/" exact element={<Home/>}/>
              {/* <Route path="/register" element={<RegisterUser />} />
              <Route path="/get-user" element={<GetUser />} />
              <Route path="/change-user-role" element={<ChangeUserRole />} /> */}
              <Route path="/sign-in" element={<SignIn />} />
              {/* <Route path="/page-a" element={<PageA />} />
              <Route path="/page-b" element={<PageB />} />
              <Route path="/page-c" element={<PageC />} />
              <Route path="/page-d" element={<PageD />} />
              <Route path="/page-e" element={<PageE />} /> */}
              <Route path="/owner/*" element={<Owner/>} />
              <Route path="/farmer/*" element={<Farmer/>} />
              <Route path="/processor/*" element={<Processor/>} />
              <Route path="/transporter/*" element={<Transporter/>} />
              <Route path="/wholesaler/*" element={<Wholesaler/>} />
              <Route path="/distributor/*" element={<Distributor/>} />
              <Route path="/retailer/*" element={<Retailer/>} />
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
              <p>Farmer</p>
            </div>

            <div class="Column">
              <Link to="/processor"><img src="http://localhost:3006/processor.jpg"/>
              </Link>
              <p>Processor</p>
            </div>

            <div class="Column">
              <Link to="/transporter"><img alt="" src="https://5.imimg.com/data5/SELLER/Default/2022/7/EO/NA/JP/114450031/vegetable-truck-transportation-service-500x500.jpg"/>
              </Link>
              <p>Transporter</p>
            </div>
      
          </div>

          <div class="Row">
            

            <div class="Column">
              <Link to="/wholesaler"><img src="https://bsmedia.business-standard.com/_media/bs/img/article/2018-01/16/full/1516085884-7318.jpg?im=FeatureCrop,width=826,height=465"/>
              </Link>
              <p>Wholesaler</p>
            </div>

            <div class="Column">
              <Link to="/distributor"><img src="http://localhost:3006/distributor.jpeg"/>
              </Link>
              <p>Distributor</p>
            </div>

            <div class="Column"> 
              <Link to="/retailer"><img src="http://localhost:3006/retailer.jpeg"/>
              </Link>
              <p>Retailer</p>
            </div>
          </div>

          {/* <div class="Row">
            
          </div> */}
        </div>
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
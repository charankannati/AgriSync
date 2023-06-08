import React, { useState,useEffect } from "react";
import { Routes, Route, Link} from "react-router-dom";
import { FaRupeeSign, FaEnvelope, FaChartLine } from 'react-icons/fa';
import axios from "axios";
import Web3 from "web3";
import Alert from "../utils/Alert";
// import CreateCrops from "../Functions/FarmerFunc/CreateCrops";
// import ViewRawMaterial from "../Functions/FarmerFunc/ViewRawMaterial";
// import RequestCrops from "../Functions/FarmerFunc/RequestCrops";
// import RecieveCrops from "../Functions/FarmerFunc/RecieveCrops";
// import ViewResponse from "../Functions/FarmerFunc/ViewResponse";
// import UseProfile from "../Functions/FarmerFunc/UserProfile";


// import {Table,Button, Card, Row, Col } from 'react-bootstrap';
// import { Grid, Typography, Stepper, Step, StepLabel } from '@material-ui/core';

//Navbar
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import { IconContext } from "react-icons";
import '../styles/Navbar.css';
import '../styles/App.css'
import { LineChart, Line,BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const salesData = [
  { name: 'Jan', sales: 50 },
  { name: 'Feb', sales: 80 },
  { name: 'Mar', sales: 70 },
  { name: 'Apr', sales: 60 },
  { name: 'May', sales: 90 },
  { name: 'Jun', sales: 100 },
];

// Define the chart data
const emailData = [
  { name: 'Mon', emails: 13 },
  { name: 'Tue', emails: 8 },
  { name: 'Wed', emails: 2 },
  { name: 'Thu', emails: 25 },
  { name: 'Fri', emails: 34 },
  { name: 'Sat', emails: 89 },
  { name: 'Sun', emails: 70 },
];

const web3 = new Web3(window.ethereum);

function Transporter() {
  const[account, setAccount] = useState(0);
  useEffect(() => {
    async function fetchAccount() {
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    }
    fetchAccount();
  }, []);


  return (
  <div>
    <div className="navbar">
    <Navbar/>
      <Link className="logo" to="/">
        AgriSync
      </Link>
    </div>
      <center id="intro">
          <h1 margin-top="0px">Welcome to Transporter's Page </h1>
    </center>
    <Routes>
         <Route path='/' element={<TransportersPage/>} />
          <Route path='/handlepackage' element={<HandlePackage account={account}/>} />
          <Route path='/userprofile' element={<UserProfile/>} />
        </Routes>
    </div>
  );
}

///////////////////////Functions////////////////////////////////////
function TransportersPage() {
  const [totalSales, setTotalSales] = useState(0);
  const [emailSubs, setEmailSubs] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);

  // Fetch the Transporter's stats from the backend API
  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await axios.get('/api/transporters/stats');
        setTotalSales(response.data.totalSales);
        setEmailSubs(response.data.emailSubs);
        setFollowers(response.data.followers);
        setTodayRevenue(response.data.todayRevenue);
      } catch (error) {
        console.error(error);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="container">
  <h1>Transporter Dashboard</h1>
  <div className="row">
    <div className="col-md-4">
      <div className="card card-primary">
        <div className="card-body">
          <h5 className="card-title"><FaRupeeSign /> Total Sales</h5>
          <p className="card-text">Rs. 34056</p>
        </div>
      </div>
    </div>
    <div className="col-md-4">
      <div className="card card-info">
        <div className="card-body">
          <h5 className="card-title"><FaEnvelope /> Email Subscriptions</h5>
          <p className="card-text">241</p>
        </div>
      </div>
    </div>
    <div className="col-md-4">
      <div className="card card-danger">
        <div className="card-body">
          <h5 className="card-title">Followers</h5>
          <p className="card-text">234</p>
        </div>
      </div>
    </div>
  </div>
  <div className="row">
    <div className="col-md-6">
      <div className="card card-success">
        <div className="card-body">
          <h5 className="card-title"><FaChartLine /> Sales Graph</h5>
          <LineChart width={400} height={300} data={salesData}>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="sales" stroke="#8884d8" />
            <Tooltip />
            <Legend />
          </LineChart>
        </div>
      </div>
    </div>
    <div className="col-md-6">
      <div className="card card-warning">
        <div className="card-body">
          <h5 className="card-title"><FaChartLine /> Email Subscriptions Graph</h5>
          <BarChart width={400} height={300} data={emailData}>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Tooltip />
            <Legend />
            <Bar dataKey="emails" fill="#8884d8" />
          </BarChart>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}

function HandlePackage(props){
    const [formData, setFormData] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
  
    const handleChange = (event) => {
      const { name, value } = event.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      try {
        const response = await axios.post(`http://localhost:3000/transporter/handle-package/${props.account}`, formData);
        setShowSuccess(true);
      } catch (error) {
        setShowError(true);
      }
    };

    const handleClose = () => {
      setShowSuccess(false);
      setShowError(false);
    };
  
    return (
      <div>
        <h2>Handle the package</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Package Address:
            <input type="text" name="address" onChange={handleChange} />
          </label>

          <label>
            Transporter type:
            <input type="number" name="Ttype" onChange={handleChange} />
          </label>

          <label>
            Cid:
            <input type="text" name="cid" onChange={handleChange} />
          </label>

          <button type="submit">Submit</button>
        </form>
        {showSuccess && (
        <Alert
          message="Package is Picked up successfully!"
          type="success"
          duration={5000}
          onClose={handleClose}
        />
      )}

      {showError && (
        <Alert
          message="Package pickup failed!"
          type="error"
          duration={5000}
          onClose={handleClose}
        />
      )}
      </div>
    );
}


function UserProfile(){
  const user = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    location: "234, Kalinga patnam, 234567",
    address: "0x4a9180B3FDAa6c9Ab058A32B2D116ab03185F4e0",
    profilePicUrl: `http://localhost:3006/${Math.floor(Math.random() * (14 - 1)) + 1}.jpeg`
  };

  return (
    <div className="UserProfile">
      <div className="UserProfile-image-container">
        <img src={user.profilePicUrl} alt="Profile" />
      </div>
      <div className="UserProfile-details-container">
        <div className="UserProfile-header">
          <h1>{user.name}</h1>
        </div>
        <div className="UserProfile-body">
          <p>Email: {user.email}</p>
          <p>Location: {user.email}</p>
          <p>Address: {user.email}</p>
        </div>
      </div>
    </div>
  );
}


//////////////////////// Navbar //////////////////////

function Navbar() {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <IconContext.Provider value={{ color: "undefined" }}>
        <div className="navbar">
          <Link to="#" className="menu-bars">
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
        </div>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            <li className="navbar-toggle">
            <div className="navbar">
                  <Link className="logo" to="/transporter">
                  Transporter
                  </Link>
                  
                </div>
              <Link to="#" className="menu-bars">
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

const SidebarData = [
  {
    title: "Handle Package",
    path: "/transporter/handlepackage",
    icon: <FaIcons.FaEnvelopeOpenText />,
    cName: "nav-text",
  },
  {
    title: "User Profile",
    path: "/transporter/userprofile",
    icon: <IoIcons.IoMdHelpCircle />,
    cName: "nav-text",
  },
];



export default Transporter;

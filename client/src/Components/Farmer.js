import React, { useState,useEffect } from "react";
import { Routes, Route, Link} from "react-router-dom";
import { FaRupeeSign, FaEnvelope, FaChartLine } from 'react-icons/fa';
import axios from "axios";
// import CreateCrops from "../Functions/FarmerFunc/CreateCrops";
// import ViewRawMaterial from "../Functions/FarmerFunc/ViewRawMaterial";
// import RequestCrops from "../Functions/FarmerFunc/RequestCrops";
// import RecieveCrops from "../Functions/FarmerFunc/RecieveCrops";
// import ViewResponse from "../Functions/FarmerFunc/ViewResponse";
// import UseProfile from "../Functions/FarmerFunc/UserProfile";


import {Table,Button, Card, Row, Col } from 'react-bootstrap';
import { Grid, Typography, Stepper, Step, StepLabel } from '@material-ui/core';

//Navbar
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import { IconContext } from "react-icons";
import '../styles/Navbar.css';
import '../styles/App.css'
import { LineChart, Line,BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Define the chart data
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

function Farmer() {
  return (
  <div>
    <div className="navbar">
    <Navbar/>
      <Link className="logo" to="/">
        AgriSync
      </Link>
    </div>
      <center id="intro">
          <h1 margin-top="0px">Welcome to Farmer's Page </h1>
    </center>
    <Routes>
          <Route path="/" element={<FarmerPage/>}/>
          <Route path='/createcrops' element={<CreateCrops/>} />
          <Route path='/viewcrops' element={<ViewCrops/>} />
          {/* <Route path='/requestcrops' element={<RequestCrops/>} />
          <Route path='/recievecrops'  exact element={<RecieveCrops/>} />
          <Route path='/viewresponse' element={<ViewResponse/>} /> */}
          <Route path='/userprofile' element={<UserProfile/>} />
          <Route path='/requests' element={<Requests/>}/>
        </Routes>
    </div>
  );
}

///////////////////////Functions////////////////////////////////////

function FarmerPage() {
  const [totalSales, setTotalSales] = useState(0);
  const [emailSubs, setEmailSubs] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);

  // Fetch the farmer's stats from the backend API
  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await axios.get('/api/farmer/stats');
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
  <h1>Farmer Dashboard</h1>
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


function CreateCrops(props) {
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/create-crop-package", formData);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Create Crop Package</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Description:
          <input type="text" name="description" onChange={handleChange} />
        </label>
        <label>
          Quantity:
          <input type="number" name = "quantity" onChange={handleChange} />
        </label>
        <label>
          Transporter Address:
          <input type="text" name="transporterAddress" onChange={handleChange} />
        </label>
        <label>
          Processor Address:
          <input type="text" name="processorAddress" onChange={handleChange} />
        </label>
        <button type="submit">Create</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}








function ViewCrops(){
  
  // const [cropDetails, setCropDetails] = useState([]);

  // useEffect(() => {
  //   async function fetchData() {
  //     //const response = await axios.get('http://localhost:3000/farmer/view-crops');
  //     //setCropDetails(response.cropDetails);
  //     setCropDetails([
  //       
  //     ]);
  //   }
  //   fetchData();
  // });

  const cropDetails = [
    {
      id: 1,
      name: 'Tomatoes',
      quantity: 1000,
      price: 5,
      farmer: '0x1234567890abcdef',
      requested: true,
      buyer: null,
      atFarmer:true,
      atProcessor:true,
      atTransporter:false
    },
    {
      id: 2,
      name: 'Potatoes',
      quantity: 2000,
      price: 3,
      farmer: '0x0987654321fedcba',
      requested: false,
      buyer: '0x567890abcdef1234',
      atFarmer:true,
      atProcessor:false,
      atTransporter:false
    },
    {
      id: 3,
      name: 'Carrots',
      quantity: 1500,
      price: 4,
      farmer: '0x1357908642acbedf',
      requested: true,
      buyer: '0xfedcba0987654321',
      atFarmer:true,
      atProcessor:true,
      atTransporter:false

    }
  ];

  const [activeStep, setActiveStep] = useState(0);
  

  const steps = ['Farmer', 'Transporter', 'Processor'];
  
  const handleSendPackage = async (cropAddress) => {
    try {
      const response = await axios.post(`/send-package/${cropAddress}`);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (

<Grid container spacing={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding:'30px'}}>
      {cropDetails.map((crop, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card className="crop-card mb-4">
            <Card.Body>
              <Typography variant="h5" component="h2">{crop.name}</Typography>
              <Typography variant="body1">
                <strong>Quantity:</strong> {crop.quantity} kg<br />
                <strong>Harvest Date:</strong> {crop.harvestDate}
              </Typography>
              <Stepper alternativeLabel activeStep={activeStep} className="mt-4">
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <div className="d-flex justify-content-between mt-4">
                <Link
                  to={'/farmer/requests'}
                  className="btn btn-primary"
                  disabled={crop.requested ? true : false}
                >
                  View Requests
                </Link>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleSendPackage(crop.cropAddress)}
                >
                  Send Package
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Grid>
      ))}
    </Grid>


  );

}

function Requests(){
  const requests = [
    {
      id: "0x123abc",
      cropAddress: "0x456def",
      requester: "0x789ghi",
      quantity: 10,
      unit: "kg",
      status: "pending",
    },
    {
      id: "0x456def",
      cropAddress: "0x789ghi",
      requester: "0x123abc",
      quantity: 5,
      unit: "ton",
      status: "approved",
    },
    {
      id: "0x789ghi",
      cropAddress: "0x123abc",
      requester: "0x456def",
      quantity: 2,
      unit: "bushels",
      status: "rejected",
    },
  ];
  const handleVerifySignature = async (requestId) => {
    try {
      const response = await axios.post(`/verifyBuyer/${requestId}`);
      console.log(response.data); // do something with the response
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="table-container">
  <h2 className="table-header">Requests</h2>
  <div className="table-wrapper">
    <Table responsive bordered hover className="request-table">
      <thead>
        <tr>
          <th>Request ID</th>
          <th>Requester</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Status</th>
          <th>Verify Signature</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((request) => (
          <tr key={request.requestId}>
            <td>{request.id}</td>
            <td>{request.requester}</td>
            <td>{request.quantity}</td>
            <td>{request.price}</td>
            <td>{request.status}</td>
            <td>
              <button
                onClick={() => handleVerifySignature(request.requestId)}
                disabled={request.status !== "pending"}
              >
                Verify
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>
</div>
  );
}


function UserProfile(){
  const user = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    location: "234, Kalinga patnam, 234567",
    address: "0x4a9180B3FDAa6c9Ab058A32B2D116ab03185F4e0",
    profilePicUrl: 'http://localhost:3006/farmer.jpeg'
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
          <p>Location: {user.location}</p>
          <p>Address: {user.address}</p>
        </div>
      </div>
    </div>
  );
}

//////////////////////// Navbar //////////////////////

function Navbar() {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);
  const closeSidebar = () => setSidebar(!sidebar);

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
                  <Link className="logo" to="/farmer">
                    Farmer
                  </Link>
                  
                </div>
              <Link to="#" className="menu-bars">
                <AiIcons.AiOutlineClose onClick={closeSidebar} />
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
    title: "Create Crops",
    path: "/farmer/createcrops",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "View Crops",
    path: "/farmer/viewcrops",
    icon: <IoIcons.IoIosPaper />,
    cName: "nav-text",
  },
  {
    title: "User Profile",
    path: "/farmer/userprofile",
    icon: <IoIcons.IoMdHelpCircle />,
    cName: "nav-text",
  },
];



export default Farmer;

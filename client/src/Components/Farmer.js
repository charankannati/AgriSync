import React, { useState,useEffect } from "react";
import { Routes, Route, Link,useLocation} from "react-router-dom";
import { FaRupeeSign, FaEnvelope, FaChartLine } from 'react-icons/fa';
import axios from "axios";
import Web3 from "web3";
// import CreateCrops from "../Functions/FarmerFunc/CreateCrops";
// import ViewRawMaterial from "../Functions/FarmerFunc/ViewRawMaterial";
// import RequestCrops from "../Functions/FarmerFunc/RequestCrops";
// import RecieveCrops from "../Functions/FarmerFunc/RecieveCrops";
// import ViewResponse from "../Functions/FarmerFunc/ViewResponse";
// import UseProfile from "../Functions/FarmerFunc/UserProfile";


import {Table,Button, Card, Row, Col } from 'react-bootstrap';
import {
  Grid,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@material-ui/core';

//Navbar
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import { IconContext } from "react-icons";
import '../styles/Navbar.css';
import '../styles/App.css'
import { LineChart, Line,BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Alert from "../utils/Alert";

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

const web3 = new Web3(window.ethereum);

function Farmer() {
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
          <h1 margin-top="0px">Welcome to Farmer's Page </h1>
    </center>
    <Routes>
          <Route path="/" element={<FarmerPage/>}/>
          <Route path='/createcrops' element={<CreateCrops account={account}/>} />
          <Route path='/viewcrops' element={<ViewCrops account={account}/>} />
          {/* <Route path='/requestcrops' element={<RequestCrops/>} />
          <Route path='/recievecrops'  exact element={<RecieveCrops/>} />
          <Route path='/viewresponse' element={<ViewResponse/>} /> */}
          <Route path='/userprofile' element={<UserProfile/>} />
          <Route path='/requests' element={<Requests account={account}/>}/>
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
  // useEffect(() => {
  //   async function fetchStats() {
  //     try {
  //       const response = await axios.get('/api/farmer/stats');
  //       setTotalSales(response.data.totalSales);
  //       setEmailSubs(response.data.emailSubs);
  //       setFollowers(response.data.followers);
  //       setTodayRevenue(response.data.todayRevenue);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  //   fetchStats();
  // }, []);

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
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(props.account)
      await axios.post(`http://localhost:3000/farmer/create-crop/${props.account}`, formData);
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
          <input type="text" name="transporterAddr" onChange={handleChange} />
        </label>
        <label>
          Processor Address:
          <input type="text" name="processorAddr" onChange={handleChange} />
        </label>
        <button type="submit">Create</button>
        {showSuccess && (
        <Alert
          message="Crop Created successfully!"
          type="success"
          duration={5000}
          onClose={handleClose}
        />
      )}

      {showError && (
        <Alert
          message="Crop Creation failed!"
          type="error"
          duration={5000}
          onClose={handleClose}
        />
      )}
      </form>
    </div>
  );
}








function ViewCrops(props){
  
  const [cropDetails, setCropDetails] = useState([]);
  

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(`http://localhost:3000/farmer/view-crops/${props.account}`);
      setCropDetails(response.data.cropDetails);
    }
    fetchData();
  },[]);

  
  

  const steps = ['Farmer', 'Transporter', 'Processor'];
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [signature, setSignature] = useState('');
  const [transporter, setTransporter] = useState('');
  const [cropD, setCropD] = useState('');
  const activeStep=cropD.status;

  const handleSendPackage = (crop) => {
    console.log(openDialog);
    setCropD(crop)
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSignature('');
    setTransporter('');
  };

  const handleConfirmDialog = async () => {
    try {
      const requestBody = {
        buyer: cropD[5],
        packageId: cropD[0],
        signature: signature,
        transporterAddress: transporter
      }
      await axios.post(`http://localhost:3000/farmer/send-package/${props.account}`, 
        requestBody
      );
      console.log(requestBody);
      setShowSuccess(true);
    } catch (error) {
      setShowError(true)
      console.error(error);
    }
    handleCloseDialog();
  };


  const handleClose = () => {
    setShowSuccess(false);
    setShowError(false);
  };

  return (
<div>
<Grid container spacing={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding:'30px'}}>
      {<h1>No Crops Created</h1> && cropDetails.map((crop, index) => {
        return (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card className="crop-card mb-4">
            <Card.Body>
              <Typography variant="h5" component="h2">{Web3.utils.hexToUtf8(crop[1]).trim()}</Typography>
              <Typography variant="body1">
                <strong>Crop Address:</strong> {crop[0]} <br />
                <strong>Quantity:</strong> {crop[2]} kg<br />
                <strong>Producer:</strong> {crop[3]}<br />
                <strong>Transporter:</strong> {crop[4]}<br />
                <strong>Processor:</strong> {crop[5]}<br />
                <strong>Transaction Contract:</strong>{crop[6]}
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
                  state={{ crop:crop[0]}}
                >
                  View Requests
                </Link>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleSendPackage(crop)}
                >
                  Send Package
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Grid>
      )})}
      
    </Grid>
    <Dialog open={openDialog} onClose={handleCloseDialog}>
      <DialogTitle>Send Package Signature</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          width="100%"
          label="Signature"
          value={signature}
          onChange={(event) => setSignature(event.target.value)}
        />
        <br/>
      <TextField
          autoFocus
          margin="dense"
          label="Transporter"
          width="100%"
          value={transporter}
          onChange={(event) => setTransporter(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleConfirmDialog} color="primary">
          Send
        </Button>
  </DialogActions>
  </Dialog>
    {showSuccess && (
        <Alert
          message="Package to delivery successful!"
          type="success"
          duration={500}
          onClose={handleClose}
        />
      )}

      {showError && (
        <Alert
          message="Package to delivery failed!"
          type="error"
          duration={500}
          onClose={handleClose}
        />
      )}
    </div>

  );

}

function Requests(props){
  const location = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
const [requests, setRequests] = useState([]);
const { crop } = location.state || [];

useEffect(() => {
  async function fetchData() {

    try {
      const response = await axios.get(
        `http://localhost:3000/events/requests/${props.account}/${crop}`
      );

      console.log(response);
      setRequests(response.data.requests);
      console.log(typeof requests);
    } catch (error) {
      console.log(error);
    }
  }

  fetchData();
}, [crop]);
  // const requests = [
  //   {
  //     id: "0x123abc",
  //     cropAddress: "0x456def",
  //     requester: "0x789ghi",
  //     quantity: 10,
  //     unit: "kg",
  //     status: "pending",
  //   },
  //   {
  //     id: "0x456def",
  //     cropAddress: "0x789ghi",
  //     requester: "0x123abc",
  //     quantity: 5,
  //     unit: "ton",
  //     status: "approved",
  //   },
  //   {
  //     id: "0x789ghi",
  //     cropAddress: "0x123abc",
  //     requester: "0x456def",
  //     quantity: 2,
  //     unit: "bushels",
  //     status: "rejected",
  //   },
  // ];
  
  const handleVerifySignature = async (request) => {
    try {
      const sellerSignature= prompt("Enter Signature: ");
      const requestBody = {
        buyer:request.buyer,
        packageId:request.packageAddr,
        buyerSignature:request.signature,
        sellerSignature:sellerSignature
      }
      console.log(requestBody);
      const response = await axios.post(`http://localhost:3000/events/verifybuyer/${props.account}`, 
        requestBody
      );
      setShowSuccess(true);

    } catch (error) {
      setShowError(true)
      console.error(error);
    }
  };
  const handleClose = () => {
    setShowSuccess(false);
    setShowError(false);
  };

  return (
    <div className="table-container">
  <h2 className="table-header">Requests</h2>
  <div className="table-wrapper">
    <Table responsive bordered hover className="request-table">
      <thead>
        <tr>
          <th>Buyer</th>
          <th>seller</th>
          <th>Package Address</th>
          <th>signature</th>
          <th>timestamp</th>
          <th>Verify Signature</th>
        </tr>
      </thead>
      <tbody>
        {requests.length === 0 ? (<tr><td colSpan="6">No requests</td></tr>) : (requests.map((request) => (
          <tr >
            <td>{request.returnValues.buyer}</td>
            <td>{request.returnValues.seller}</td>
            <td>{request.returnValues.packageAddr}</td>
            <td>{request.returnValues.signature}</td>
            <td>{request.returnValues.timestamp}</td>
            <td>
              <button
                onClick={() => handleVerifySignature(request.returnValues)}
              >
                Verify
              </button>
              
            </td>
          </tr>
        )))} 
      </tbody>
    </Table>
    {showSuccess && (
        <Alert
          message="Buyer Verified successfully!"
          type="success"
          duration={5000}
          onClose={handleClose}
        />
      )}

      {showError && (
        <Alert
          message="Buyer Verification failed!"
          type="error"
          duration={5000}
          onClose={handleClose}
        />
      )}
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

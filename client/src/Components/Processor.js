import React, { useState,useEffect } from "react";
import { Routes, Route, Link} from "react-router-dom";
import { FaRupeeSign, FaEnvelope, FaChartLine } from 'react-icons/fa';
import axios from "axios";

import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import { IconContext } from "react-icons";
import '../styles/Navbar.css';
import '../styles/App.css'
import { LineChart, Line,BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import {
    Card,
    CardContent,
    CardActions,
    Button,
    Grid,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Stepper, Step, StepLabel, Hidden
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const salesData = [
    { name: 'Jan', sales: 60 },
    { name: 'Feb', sales: 45 },
    { name: 'Mar', sales: 67 },
    { name: 'Apr', sales: 89 },
    { name: 'May', sales: 101 },
    { name: 'Jun', sales: 120 },
  ];
  
  // Define the chart data
const emailData = [
    { name: 'Mon', emails: 40 },
    { name: 'Tue', emails: 8 },
    { name: 'Wed', emails: 2 },
    { name: 'Thu', emails: 22 },
    { name: 'Fri', emails: 78 },
    { name: 'Sat', emails: 89 },
    { name: 'Sun', emails: 70 },
];

function Processor() {
    return (
    <div>
      <div className="navbar">
      <Navbar/>
        <Link className="logo" to="/">
          AgriSync
        </Link>
      </div>
        <center id="intro">
            <h1 margin-top="0px">Welcome to Processor's Page </h1>
      </center>
      <Routes>
            <Route path="/" element={<ProcessorPage/>}/>
            <Route path='/createproducts' element={<CreateProducts/>} />
            <Route path='/viewproducts' element={<ViewProducts/>} />
            <Route path='/view-received-crops' element={<Crops/>}/>
            {/* <Route path='/requestcrops' element={<RequestCrops/>} />
            <Route path='/recievecrops'  exact element={<RecieveCrops/>} />
            <Route path='/viewresponse' element={<ViewResponse/>} /> */}
            <Route path='/userprofile' element={<UserProfile/>} />
            <Route path='/farmer-crops' element={<FarmerCrops/>}/>
            <Route path='/farmer-crops/crops' element={<Crops/>}/>
          </Routes>
      </div>
    );
  }

//////////////////////// DashBoard ///////////////////////
function ProcessorPage() {
    // const [totalSales, setTotalSales] = useState(0);
    // const [emailSubs, setEmailSubs] = useState(0);
    // const [followers, setFollowers] = useState(0);
    // const [todayRevenue, setTodayRevenue] = useState(0);
  
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
    <h1>Processor Dashboard</h1>
    <div className="row">
      <div className="col-md-4">
        <div className="card card-primary">
          <div className="card-body">
            <h5 className="card-title"><FaRupeeSign /> Total Sales</h5>
            <p className="card-text">Rs. 55,033</p>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card card-info">
          <div className="card-body">
            <h5 className="card-title"><FaEnvelope /> Email Subscriptions</h5>
            <p className="card-text">2365</p>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card card-danger">
          <div className="card-body">
            <h5 className="card-title">Followers</h5>
            <p className="card-text">2314</p>
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
              <Line type="monotone" dataKey="sales" stroke="#ff0066" />
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
              <Bar dataKey="emails" fill="#ff9999" />
            </BarChart>
          </div>
        </div>
      </div>
    </div>
  </div>
    );
  }

  ////////////////////// Create Products/////////////////////
  function CreateProducts() {
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
      <h2>Create Product</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Description:
          <input type="text" name="description" onChange={handleChange} />
        </label>
        <label>
          Crop Addresses:
          <input type="text" name = "cropAddress" onChange={handleChange} />
        </label>
        <label>
          Quantity
          <input type="number" name="quantity" onChange={handleChange} />
        </label>
        <label>
          Transporter Address:
          <input type="text" name="transporterAddress" onChange={handleChange} />
        </label>
        <label>
          Receiver Address:
          <input type="text" name="receiverAddress" onChange={handleChange} />
        </label>
        <label>
          Receiver Type:
          <input type="number" name="Rtype" onChange={handleChange} />
        </label>
        <button type="submit">Create</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
  }

  ////////////////////// View Products /////////////////////

  const ProductCard = ({ product }) => {
    const [activeStep, setActiveStep] = useState(product.status);
  
    const steps = ['Processor', 'Transporter', 'Wholesaler', 'Transporter', 'Distributor', 'Transporter', 'Delivered'];
  
    const handleSendPackage = () => {
      console.log(`Sending package for product with id ${product.id}`);
    };
  
    const handleViewRequests = () => {
      console.log(`Viewing requests for product with id ${product.id}`);
    };
  
    return (
      <Card>
        <CardContent>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
        </CardContent>
        <Stepper activeStep={activeStep} style={{ padding: '20px 20px', overflow: 'hidden' }}>
          {steps.map((step, index) => (
            <Step key={step} style={{ padding: 0 }}>
              <StepLabel >{step}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button variant="contained" color="primary" onClick={handleViewRequests}>
                View Requests
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button variant="contained" color="secondary" onClick={handleSendPackage}>
                Send Package
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };
  function ViewProducts() {
    const products = [
        {
          id: 1,
          name: 'Product 1',
          description: 'Description for Product 1',
          status: 1,
        },
        {
          id: 2,
          name: 'Product 2',
          description: 'Description for Product 2',
          status: 3,
        },
        {
          id: 3,
          name: 'Product 3',
          description: 'Description for Product 3',
          status: 5,
        },
      ];

      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <h1>Products</h1>
          <Grid container spacing={2} style={{ width: '80%', maxWidth: '1200px', margin: '0 auto' }}>
            {products.map((product) => (
            <Grid item xs={12} key={product.id}>
                <ProductCard product={product} style={{ margin: '0 auto' }}/>
            </Grid>
            ))}
           </Grid>
        </div>
      );

  }

  ////////////////////// Farmers ////////////////////////////

  const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        margin: 'auto',
        marginTop: 50,
        maxWidth: 1000,
      },
      card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#f8f8f8',
      },
      cardContent: {
        flexGrow: 1,
      },
      profileImage: {
        width: '100%',
        height: '70%',
        marginRight: theme.spacing(2),
      }
  }));

function FarmerCrops() {
    const classes = useStyles();
    //const [farmers, setFarmers] = useState([]);
    const farmers = [
        {
          id: 1,
          name: "John Doe",
          location: "New York",
          numberOfCrops: 5,
          profileImage:'http://localhost:3006/farmer.jpeg'
        },
        {
          id: 2,
          name: "Jane Smith",
          location: "Los Angeles",
          numberOfCrops: 8,
          profileImage:'http://localhost:3006/farmer.jpeg'
        },
        {
          id: 3,
          name: "Bob Johnson",
          location: "Chicago",
          numberOfCrops: 3,
          profileImage:'http://localhost:3006/farmer.jpeg'
        },
        {
          id: 4,
          name: "Alice Lee",
          location: "San Francisco",
          numberOfCrops: 10,
          profileImage:'http://localhost:3006/farmer.jpeg'
        },
        {
          id: 5,
          name: "Mike Davis",
          location: "Miami",
          numberOfCrops: 2,
          profileImage:'http://localhost:3006/farmer.jpeg'
        },
      ];

    // useEffect(() => {
    //     const fetchFarmers = async () => {
    //     try {
    //         const response = await axios.get('/processor/get-all-farmers/0x81B5f1cE3dE6570134e71c19B358aEe1d4a4e0d8');
    //         setFarmers(response.data);
    //     } catch (error) {
    //         console.log(error);
    //     }
    //     };
    //     fetchFarmers();
    // }, []);



    return (
        <div className={classes.root}>
      <Grid container spacing={2}>
        {farmers.map((farmer) => (
          <Grid item xs={12} sm={6} md={4} key={farmer.id}>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                <img className={classes.profileImage} src={farmer.profileImage} alt={farmer.name} />
                <div>
                  <Typography variant="h5" component="h2">
                    {farmer.name}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {farmer.location}
                  </Typography>
                  <Typography variant="body2" component="p">
                    Number of crops: {farmer.numberOfCrops}
                  </Typography>
                </div>
              </CardContent>
              <CardActions>
                <Button size="small" 
    color="primary" 
    variant="contained" 
    component={Link} 
    to={`/processor/farmer-crops/crops`}>
                  Show Crops
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
    );
}

  //////////////////////User Profile///////////////////
  function UserProfile(){
    const user = {
      name: 'Mark Dowe',
      email: 'mark@example.com',
      location: "215, Machilipatnam , 234367",
      address: "0x4a9180B3FDAa6coaudbf908b4f116ab03185F4e0",
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

  ////////////////////// Crops ////////////////////////

  const useStylesForCrops = makeStyles({
    root: {
        flexGrow: 1,
        margin: 'auto',
        marginTop: 50,
        maxWidth: 1000,
      },
      card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#f8f8f8',
      },
      cardContent: {
        flexGrow: 1,
      }
  });
  function Crops(){
    const classes = useStylesForCrops();
    const [openDialog, setOpenDialog] = useState(false);
  const [signature, setSignature] = useState('');

  const crops = [
    { id: 1, name: 'Tomatoes', price: 2.99 },
    { id: 2, name: 'Carrots', price: 1.99 },
    { id: 3, name: 'Potatoes', price: 3.99 },
    { id: 4, name: 'Cucumbers', price: 2.49 },
    { id: 5, name: 'Spinach', price: 2.99 },
  ];

  const handleRequestPackage = (cropId) => {
    console.log(`Request package for crop with id ${cropId}`);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSignature('');
  };

  const handleConfirmDialog = () => {
    console.log(`Requesting package with signature: ${signature}`);
    handleCloseDialog();
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        {crops.map((crop) => (
          <Grid item xs={12} sm={6} md={4} key={crop.id}>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="h2">
                  {crop.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Price: {crop.price} USD
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  onClick={() => handleRequestPackage(crop.id)}
                >
                  Request Package
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Request Package Signature</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Signature"
            fullWidth
            value={signature}
            onChange={(event) => setSignature(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDialog} color="primary">
            Request
          </Button>
    </DialogActions>
    </Dialog>
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
                    <Link className="logo" to="/processor">
                      Processor
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
      title: "Create Products",
      path: "/processor/createproducts",
      icon: <AiIcons.AiFillHome />,
      cName: "nav-text",
    },
    {
      title: "View Products",
      path: "/processor/viewproducts",
      icon: <IoIcons.IoIosPaper />,
      cName: "nav-text",
    },
    {
        title: "View Received Crops",
        path: "/processor/view-received-crops",
        icon: <IoIcons.IoIosPaper />,
        cName: "nav-text",
    },
    {
        title: "Farmer Crops",
        path: "/processor/farmer-crops",
        icon: <IoIcons.IoMdHelpCircle />,
        cName: "nav-text",
    },
    {
      title: "User Profile",
      path: "/processor/userprofile",
      icon: <IoIcons.IoMdHelpCircle />,
      cName: "nav-text",
    },
  ];
  

  export default Processor;
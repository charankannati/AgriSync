import React, { useState,useEffect } from "react";
import { Routes, Route, Link, useLocation} from "react-router-dom";
import { FaRupeeSign, FaEnvelope, FaChartLine } from 'react-icons/fa';
import axios from "axios";
import Web3 from "web3";
//import {Table,Button, Card, Row, Col } from 'react-bootstrap';

import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import { IconContext } from "react-icons";
import '../styles/Navbar.css';
import '../styles/App.css'
import { LineChart, Line,BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { makeStyles } from '@material-ui/core/styles';
import Alert from "../utils/Alert";

import {
    Card,
    CardContent,
    CardActions,
    Grid,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Stepper, Step, StepLabel, Hidden,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button
} from '@material-ui/core';


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
const web3 = new Web3(window.ethereum);

function Distributor() {
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
            <h1 margin-top="0px">Welcome to Distributor's Page </h1>
        </center>
        <Routes>
            <Route path="/" element={<DistributorsPage/>}/>
            <Route path='/viewresponses' element={<ViewResponses account={account}/>} />
            <Route path='/wholesaler-products' element={<WholesalerProducts account={account}/>} />
            <Route path='/wholesaler-products/products' element={<Products account = {account}/>} />
            <Route path='/view-received-products' element={<ReceivedProducts account = {account}/>} />
            <Route path='/receive-product' element={<ReceiveProduct account = {account}/>}/>
            <Route path='/userprofile' element={<UserProfile/>} />
        </Routes>
    </div>
    );
}

//////////////////////// DashBoard ///////////////////////
function DistributorsPage() {
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
        <h1>Distributor's Dashboard</h1>
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
///////////////////////// View Received Products ///////////////////
const useStylesForRProducts = makeStyles({
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

function ReceivedProducts(props){
    const classes = useStylesForRProducts();
    const [products, setProducts] = useState([]);

    useEffect(() => {
      async function fetchData() {
    
        try {
          const response = await axios.get(
            `http://localhost:3000/distributor/view-received-products/${props.account}`
          );
    
          console.log(response);
          setProducts(response.data);
        } catch (error) {
          console.log(error);
        }
      }
      fetchData();
    }, []);

    return (
      <div className={classes.root}>
      <Grid container spacing={2}>
          {<h1>No Products Received</h1> && products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
              <Typography gutterBottom variant="h5" component="h2">
                {product[1]}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Crops: {product[2].join(" ")}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Quantity: {product[3]}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Transporter Addresses: {product[4].join(" ")}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Distributor Addresses: {product[5]}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Product Status: {product[6]}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Transaction Contract Address: {product[7]}
              </Typography>
              </CardContent>
              </Card>
          </Grid>
          ))}
      </Grid>

      </div>
  );
}
/////////////////////////View Responses ////////////////////////////
function ViewResponses(props) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    async function fetchData() {
  
      try {
        const response = await axios.get(
          `http://localhost:3000/events/responses/${props.account}`
        );
  
        console.log(response);
        setResponses(response.data.responses);
        console.log(typeof responses);
      } catch (error) {
        console.log(error);
      }
    }
  
    fetchData();
  }, []);

  const handleVerifySignature = async (response) => {
    try {
      const requestBody = {
        seller: response.seller,
        packageId: response.packageAddr,
        signature: response.signature
      }
      console.log(response);
      await axios.post(`http://localhost:3000/events/verifyseller/${props.account}`, 
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
    <TableContainer component={Paper}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Buyer</TableCell>
        <TableCell>seller</TableCell>
        <TableCell>Package Address</TableCell>
        <TableCell>Siganture</TableCell>
        <TableCell>Timestamp</TableCell>
        <TableCell>Verify Signature</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
    {responses.length === 0 ? (<tr><td colSpan="6">No responses</td></tr>) : (responses.map((response) => (
        <TableRow>
          <TableCell>{response.returnValues.buyer}</TableCell>
          <TableCell>{response.returnValues.seller}</TableCell>
          <TableCell>{response.returnValues.packageAddr}</TableCell>
          <TableCell>{response.returnValues.signature}</TableCell>
          <TableCell>{response.returnValues.timestamp}</TableCell>
          <TableCell>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleVerifySignature(response.returnValues)}
            >
              Verify
            </Button>
          </TableCell>
        </TableRow>
      )))}
    </TableBody>
  </Table>
</TableContainer>
    </div>
    {showSuccess && (
        <Alert
          message="Seller Verified successfully!"
          type="success"
          duration={5000}
          onClose={handleClose}
        />
      )}

      {showError && (
        <Alert
          message="Seller Verification failed!"
          type="error"
          duration={5000}
          onClose={handleClose}
        />
      )}
  </div>
    );
  }
  ///////////////////////// Wholesaler Products///////////////////////////
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
  function WholesalerProducts(props) {
    const classes = useStyles();
    const [wholesalers, setWholesalers] = useState([]);

    useEffect(() => {
      const fetchWholesalers = async () => {
      try {
          const response = await axios.get(`http://localhost:3000/distributor/get-all-wholesalers/${props.account}`);
          setWholesalers(response.data.wholesalerDetails);
      } catch (error) {
          console.log(error);
      }
      };
      fetchWholesalers();
  }, []);



    return (
        <div className={classes.root}>
      <Grid container spacing={2}>
        {wholesalers.map((wholesaler) => (
          <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                <img className={classes.profileImage} src={`http://localhost:3006/${Math.floor(Math.random() * (14 - 1)) + 1}.jpeg`} alt="Wholesaler" />
                <div>
                <Typography variant="h5" component="h2">
                    {wholesaler.wholesalerAddr}
                  </Typography>
                  <Typography variant="body2" component="p">
                    Number of products: {wholesaler.productCount}
                  </Typography>
                </div>
              </CardContent>
              <CardActions>
              <Link
                  to={'/distributor/wholesaler-products/products'}
                  className="btn btn-primary"
                  state={{ wholesaler:wholesaler}}
                >
                  Show Products
                </Link>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
    );
}

const useStylesForProducts = makeStyles({
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
function Products(props){
  const location = useLocation();
  const {wholesaler} = location.state;
  const classes = useStylesForProducts();
  const [openDialog, setOpenDialog] = useState(false);
const [signature, setSignature] = useState('');
const [products, setProducts] = useState([]);
const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [productD, setProductD] = useState([]);

useEffect(() => {
  async function fetchData() {

    try {
      const response = await axios.get(
        `http://localhost:3000/wholesaler/view-received-products/${props.account}`
      );

      console.log(response);
      setProducts(response.data.productDetails);
    } catch (error) {
      console.log(error);
    }
  }

  fetchData();
}, []);

const handleRequestPackage = async (product) => {
  setProductD(product);
  setOpenDialog(true);
};

const handleCloseDialog = () => {
  setOpenDialog(false);
  setSignature('');
};

const handleConfirmDialog = async () => {
  try {
    const requestBody = {
      processor: productD._processorAddr,
      packageId: productD._productAddress,
      signature: signature
    }
    console.log(requestBody)
    await axios.put(`http://localhost:3000/distributor/request-package/${props.account}`, 
      requestBody
    );
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
  <div className={classes.root}>
    <Grid container spacing={2}>
    { products.length===0 ? <h1>No Products Received</h1> : products.map((product) => (
            <Grid item xs={12} sm={6} md={4} >
                <Card className={classes.card}>
                <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="h2">
                  {product._productAddr}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Crops: {product._cropsAddr.join(" ")}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Quantity: {product._quantity}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Transporter Addresses: {product._transporterAddr.join(" ")}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Wholesaler Address: {product._wholesaler}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Distributor Addresses: {product._distributor}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Product Status: {product._status}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Transaction Contract Address: {product._txnContract}
                </Typography>
                </CardContent>
                <CardActions>
              <Button
                size="small"
                color="primary"
                variant="contained"
                onClick={() => handleRequestPackage(product)}
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
  {showSuccess && (
        <Alert
          message="Requested Product successfully!"
          type="success"
          duration={5000}
          onClose={handleClose}
        />
      )}

      {showError && (
        <Alert
          message="Requesting Product failed!"
          type="error"
          duration={5000}
          onClose={handleClose}
        />
      )}
  </div>
);
}

/////////////////////////Receive Product/////////////////////
function ReceiveProduct(props){
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
    await axios.post(`http://localhost:3000/distributor/receive-products/${props.account}`, formData);
    setShowSuccess(true)
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
    <h2>Receive Package</h2>
    <form onSubmit={handleSubmit}>
      
      <label>
        Package Address:
        <input type="text" name="address" onChange={handleChange} />
      </label>
      
      <button type="submit">Receive</button>
    </form>
    {showSuccess && (
      <Alert
        message="Seller Verified successfully!"
        type="success"
        duration={5000}
        onClose={handleClose}
      />
    )}

    {showError && (
      <Alert
        message="Seller Verification failed!"
        type="error"
        duration={5000}
        onClose={handleClose}
      />
    )}
  </div>
);
}
//////////////////////// UserProfile /////////////////////
function UserProfile(){
    const user = {
    name: 'Harish',
    email: 'harish@agrisync.com',
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
                    <Link className="logo" to="/distributor">
                    Distributor
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
    
    // {
    // title: "Create Crops",
    // path: "/distributor/createcrops",
    // icon: <AiIcons.AiFillHome />,
    // cName: "nav-text",
    // },
    // {
    // title: "View Recieved Products",
    // path: "/distributor/viewproducts",
    // icon: <IoIcons.IoIosPaper />,
    // cName: "nav-text",
    // },
    {
    title: "Wholesaler Products",
    path: "/distributor/wholesaler-products",
    icon: <FaIcons.FaCartPlus />,
    cName: "nav-text",
    },
    {
    title: "Recieve Products",
    path: "/distributor/receive-product",
    icon: <IoIcons.IoMdPeople />,
    cName: "nav-text",
    },
    {
    title: "View Responses",
    path: "/distributor/viewresponses",
    icon: <FaIcons.FaEnvelopeOpenText />,
    cName: "nav-text",
    },
    {
        title: "View Recieved Products",
        path: "/distributor/view-received-products",
        icon: <IoIcons.IoIosPaper />,
        cName: "nav-text",
    },
    {
    title: "User Profile",
    path: "/distributor/userprofile",
    icon: <IoIcons.IoMdHelpCircle />,
    cName: "nav-text",
    },
];



export default Distributor;
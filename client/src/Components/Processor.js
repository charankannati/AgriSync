import React, { useState,useEffect } from "react";
import { Routes, Route, Link, useLocation} from "react-router-dom";
import { FaRupeeSign, FaEnvelope, FaChartLine } from 'react-icons/fa';
import axios from "axios";
import Web3 from "web3";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import { IconContext } from "react-icons";
import '../styles/Navbar.css';
import '../styles/App.css'
import {Table} from 'react-bootstrap';
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
import Alert from "../utils/Alert";


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

function Processor() {

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
            <h1 margin-top="0px">Welcome to Processor's Page </h1>
      </center>
      <Routes>
            <Route path="/" element={<ProcessorPage/>}/>
            <Route path='/createproducts' element={<CreateProducts account={account}/>} />
            <Route path='/viewproducts' element={<ViewProducts account={account}/>} />
            {/* <Route path='/view-received-crops' element={<ReceivedCrops account={account}/>}/> */}
            <Route path='/viewresponses' element={<ViewResponses account={account}/>}/>
            <Route path='/requests' element={<Requests account={account}/>}/>
            {/* <Route path='/requestcrops' element={<RequestCrops/>} />
            <Route path='/recievecrops'  exact element={<RecieveCrops/>} />
            <Route path='/viewresponse' element={<ViewResponse/>} /> */}
            <Route path='/userprofile' element={<UserProfile/>} />
            <Route path='/farmer-crops' element={<FarmerCrops account={account}/>}/>
            <Route path='/farmer-crops/crops' element={<Crops account={account}/>}/>
            <Route path='/receive-package' element={<ReceiveCrops account={account}/>} />
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
  function CreateProducts(props) {
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
        console.log(formData)
        await axios.post(`http://localhost:3000/processor/create-product/${props.account}`, formData);
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
      <h2>Create Product</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Description:
          <input type="text" name="description" onChange={handleChange} />
        </label>
        <label>
          Crop Addresses:
          <input type="text" name = "crops" onChange={handleChange} />
        </label>
        <label>
          Quantity
          <input type="number" name="quantity" onChange={handleChange} />
        </label>
        <label>
          Transporter Address:
          <input type="text" name="transporters" onChange={handleChange} />
        </label>
        <label>
          Wholesaler Address:
          <input type="text" name="wholesaler" onChange={handleChange} />
        </label>
        <label>
          Distributor Address:
          <input type="text" name="distributor" onChange={handleChange} />
        </label>
        <button type="submit">Create</button>
        {showSuccess && (
        <Alert
          message="Product Created successfully!"
          type="success"
          duration={5000}
          onClose={handleClose}
        />
      )}

      {showError && (
        <Alert
          message="Product Creation failed!"
          type="error"
          duration={5000}
          onClose={handleClose}
        />
      )}
      </form>
    </div>
  );
  }

  ////////////////////// View Products /////////////////////
  const ProductCard = ({ product , account}) => {
    const activeStep = product._status;
    const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
const [signature, setSignature] = useState('');
const [transporter, setTransporter] = useState('');
  
    const steps = ['Processor', 'Transporter', 'Wholesaler', 'Transporter', 'Distributor', 'Transporter', 'Delivered'];
  
    const handleSendPackage = () => {
      console.log(openDialog);
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
          buyer: product._wholesaler,
          packageId: product._productAddress,
          signature: signature,
          transporterAddress: transporter
        }
        await axios.post(`http://localhost:3000/processor/send-package/${account}`, 
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
  
  /*"_processorAddr": "0x81B5f1cE3dE6570134e71c19B358aEe1d4a4e0d8",
            "_description": "0x5468726561640000000000000000000000000000000000000000000000000000",
            "_cropsAddr": [
                "0xecDd14Eddaa321407F911a223B67346D5c5A937f"
            ],
            "_quantity": "2500",
            "_transporterAddr": [
                "0x0000000000000000000000000000000000000000"
            ],
            "_distributor": "0x0000000000000000000000000000000000000000",
            "_status": "0",
            "_txnContract": "0x6DE9DfbcBaEd8d67dE860BEFDCC0898Fc2c5E182",
            "_wholesaler": "0x0000000000000000000000000000000000000000",
            "_produstAddress": "0xC2afd8Fb5f4A2EA5915DB1f2e4A750D7fCF2CC42"
  */ 
    return (
      <div>
      <Card >
        <CardContent>
          <h2>{Web3.utils.hexToUtf8(product._description).trim()}</h2>
          <p>Product Address: {product._productAddress}</p>
          <p>Crops Used: {product._cropsAddr.join(" ")}</p>
          <p>Quantity: {product._quantity}</p>
          <p>Transporters: {product._transporterAddr.join(" ")}</p>
          <p>Distributor: {product._distributor}</p>
          <p>Wholesaler: {product._wholesaler}</p>
          <p>Transaction Contract: {product._txnContract}</p>
          <p>Product Status: {activeStep}</p>
        </CardContent>
        <Stepper activeStep={activeStep} style={{ padding: '20px 20px', overflow: 'hidden' }}>
          {steps.map((step) => (
            <Step key={step} style={{ padding: 0 }}>
              <StepLabel >{step}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
            <Link
                  to={'/processor/requests'}
                  className="btn btn-primary"
                  state={{ product:product}}
                >
                  View Requests
                </Link>
            </Grid>
            <Grid item xs={6}>
              <Button variant="contained" color="secondary" onClick={handleSendPackage}>
                Send Package
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth='550px' >
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
          message="Packge sent to delivery successfully!"
          type="success"
          duration={5000}
          onClose={handleClose}
        />
      )}

      {showError && (
        <Alert
          message="Package to delivery failed!"
          type="error"
          duration={5000}
          onClose={handleClose}
        />
      )}
      </div>
    );
  };
  function ViewProducts(props) {
    const [products, setProducts] = useState([]);
  

  useEffect(() => {
    async function fetchData() {
      console.log(props.account)
      const response = await axios.get(`http://localhost:3000/processor/view-products/${props.account}`);
      console.log(response.data);
      setProducts(response.data.products);
    }
    fetchData();
  }, []);
    
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <h1>Products</h1>
          <Grid container spacing={2} style={{ width: '80%', maxWidth: '1200px', margin: '0 auto' }}>
            {products.map((product) => (
            <Grid item xs={12}>
                <ProductCard product={product} account = {props.account} style={{ margin: '0 auto' }}/>
            </Grid>
            ))}
          </Grid>
        </div>
      );

  }
  
  function Requests(props){
    const location = useLocation();
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
  const [requests, setRequests] = useState([]);
  const { product } = location.state;
  
  useEffect(() => {
    async function fetchData() {
  
      try {
        console.log(product)
        const response = await axios.get(
          `http://localhost:3000/events/requests/${props.account}/${product._productAddress}`
        );
  
        console.log(response);
        setRequests(response.data.requests);
        console.log(typeof requests);
      } catch (error) {
        console.log(error);
      }
    }
  
    fetchData();
  }, [product]);
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
        const response = await axios.post(`http://localhost:3000/events/verifyBuyer/${props.account}`, 
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
  ////////////////////// Receicve Crops///////////////////
  function ReceiveCrops(props) {
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
      console.log(formData)
      await axios.post(`http://localhost:3000/processor/receive-package/${props.account}`, formData);
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
          message="Package Received successfully!"
          type="success"
          duration={5000}
          onClose={handleClose}
        />
      )}

      {showError && (
        <Alert
          message="Packge Receival failed!"
          type="error"
          duration={5000}
          onClose={handleClose}
        />
      )}
    </div>
  );
  }
  ////////////////////// View Responses /////////////////////////
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
  <h2 className="table-header">Responses</h2>
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
        {responses.length === 0 ? (<tr><td colSpan="6">No responses</td></tr>) : (responses.map((response) => (
          <tr >
            <td>{response.returnValues.buyer}</td>
            <td>{response.returnValues.seller}</td>
            <td>{response.returnValues.packageAddr}</td>
            <td>{response.returnValues.signature}</td>
            <td>{response.returnValues.timestamp}</td>
            <td>
              <button
                onClick={() => handleVerifySignature(response.returnValues)}
              >
                Verify
              </button>
              
            </td>
          </tr>
        )))} 
      </tbody>
    </Table>
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

function FarmerCrops(props) {
    const classes = useStyles();
    const [farmers, setFarmers] = useState([]);
    

    useEffect(() => {
        const fetchFarmers = async () => {
        try {
          console.log(props.account);
            const response = await axios.get(`http://localhost:3000/processor/get-all-farmers/${props.account}`);
            setFarmers(response.data.farmerDetails);
        } catch (error) {
            console.log(error);
        }
        };
        fetchFarmers();
    }, []);



    return (
        <div className={classes.root}>
      <Grid container spacing={2}>
        {farmers.map((farmer) => (
          <Grid item xs={12} sm={6} md={4} key={farmer.id}>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                <img className={classes.profileImage} src={`http://localhost:3006/${Math.floor(Math.random() * (14 - 1)) + 1}.jpeg`} alt={farmer.name} />
                <div>
                  <Typography variant="h5" component="h2">
                    {farmer.farmerAddr}
                  </Typography>
                  <Typography variant="body2" component="p">
                    Number of crops: {farmer.cropCount}
                  </Typography>
                </div>
              </CardContent>
              <CardActions>
              <Link
                  to={'/processor/farmer-crops/crops'}
                  className="btn btn-primary"
                  state={{ farmer:farmer}}
                >
                  Show Crops
                </Link>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
    );
}
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
function Crops(props){
  const location = useLocation();
  const {farmer} = location.state || "";
  const classes = useStylesForCrops();
  const [openDialog, setOpenDialog] = useState(false);
const [signature, setSignature] = useState('');
const [crops, setCrops] = useState([]);
const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [cropD, setCropD] = useState([]);

useEffect(() => {
  async function fetchData() {

    try {
      const response = await axios.get(
        `http://localhost:3000/farmer/view-crops/${farmer.farmerAddr}`
      );

      console.log(response);
      setCrops(response.data.cropDetails);
    } catch (error) {
      console.log(error);
    }
  }

  fetchData();
}, []);

const handleRequestPackage = async (crop) => {
  setCropD(crop);
  setOpenDialog(true);
};

const handleCloseDialog = () => {
  setOpenDialog(false);
  setSignature('');
};

const handleConfirmDialog = async () => {
  try {
    const requestBody = {
      farmer: cropD[3],
      packageId: cropD[0],
      signature: signature
    }
    await axios.put(`http://localhost:3000/processor/request-package/${props.account}`, 
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
      {crops.map((crop) => (
        <Grid item xs={12} sm={6} md={4} key={crop.id}>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Typography gutterBottom variant="h5" component="h2">
              {Web3.utils.hexToUtf8(crop[1]).trim()}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Crop Id: {crop[0]}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Quantity: {crop[2]}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Farmer Address: {crop[3]}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Transaporter Address: {crop[4]}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Processor Address: {crop[5]}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Transaction Contract Address: {crop[6]}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color="primary"
                variant="contained"
                onClick={() => handleRequestPackage(crop)}
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
          message="Requested Crop successfully!"
          type="success"
          duration={5000}
          onClose={handleClose}
        />
      )}

      {showError && (
        <Alert
          message="Requesting Crop failed!"
          type="error"
          duration={5000}
          onClose={handleClose}
        />
      )}
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

  ////////////////////// View Received Crops ////////////////////

//   const useStylesForViewRCrops = makeStyles({
//     root: {
//         flexGrow: 1,
//         margin: 'auto',
//         marginTop: 50,
//         maxWidth: 1000,
//       },
//       card: {
//         height: '100%',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'space-between',
//         backgroundColor: '#f8f8f8',
//       },
//       cardContent: {
//         flexGrow: 1,
//       }
//   });
//   function ReceivedCrops(props){
//     const classes = useStylesForViewRCrops();
//   const [crops, setCrops] = useState([]);

//   useEffect(() => {
//     async function fetchData() {
  
//       try {
//         const response = await axios.get(
//           `http://localhost:3000/processor/view-received-crops/${props.account}`
//         );
  
//         console.log(response);
//         setCrops(response.data);
//       } catch (error) {
//         console.log(error);
//       }
//     }
  
//     fetchData();
//   }, []);

 

//   return (
//     <div className={classes.root}>
//       <Grid container spacing={2}>
//         {<h1>No Crops Received</h1> && crops.map((crop) => (
//           <Grid item xs={12} sm={6} md={4} key={crop.id}>
//             <Card className={classes.card}>
//               <CardContent className={classes.cardContent}>
//                 <Typography gutterBottom variant="h5" component="h2">
//                   {crop[1]}
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary" component="p">
//                   Quantity: {crop[2]}
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary" component="p">
//                   Farmer Address: {crop[3]}
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary" component="p">
//                   Transaporter Address: {crop[4]}
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary" component="p">
//                   Processor Address: {crop[5]}
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary" component="p">
//                   Transaction Contract Address: {crop[6]}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </div>
//   );
// }
  

  ////////////////////// Crops ////////////////////////

  
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
        title: "Recieve Package",
        path: "/processor/receive-package",
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
        title: "View Responses",
        path: "/processor/viewresponses",
        icon: <IoIcons.IoIosPaper />,
        cName: "nav-text",
      },
    // {
    //     title: "View Received Crops",
    //     path: "/processor/view-received-crops",
    //     icon: <IoIcons.IoIosPaper />,
    //     cName: "nav-text",
    // },
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
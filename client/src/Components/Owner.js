import React, { useState, useEffect } from "react";
import { Routes, Route, Link} from "react-router-dom";
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Web3 from "web3";
import Alert from "../utils/Alert";
// import CreateCrops from "../Functions/FarmerFunc/CreateCrops";
// import ViewRawMaterial from "../Functions/FarmerFunc/ViewRawMaterial";
// import RequestCrops from "../Functions/FarmerFunc/RequestCrops";
// import RecieveCrops from "../Functions/FarmerFunc/RecieveCrops";
// import ViewResponse from "../Functions/FarmerFunc/ViewResponse";
// import UseProfile from "../Functions/FarmerFunc/UserProfile";


//Navbar
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import { IconContext } from "react-icons";
import '../styles/Navbar.css';
import '../styles/App.css'


function Owner() {
  return (
  <div>
    <div className="navbar">
    <Navbar/>
      <Link className="logo" to="/">
        AgriSync
      </Link>
    </div>
      <center id="intro">
          <h1 margin-top="0px">Welcome to Owner's Page </h1>
    </center>
    <Routes>
          <Route path='/' element={<OwnerPage/>}/>
          <Route path='/register-user' element={<RegisterUser/>} />
          <Route path='/get-user' element={<GetUser/>} />
          <Route path='/change-user-role' element={<ChangeUserRole/>} />
        </Routes>
    </div>
  );
}

//////////////////////Owner Page////////////////////////////////////

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(5 , 20),
  },
  paper: {
    padding: theme.spacing(2),
    fontSize:'0.9rem',
    height:'100%'
  },
  chart: {
    margin: theme.spacing(5, 0),
    width:'100%'
  },
}));
function OwnerPage(){
  const classes = useStyles();
  const [salesMetrics, setSalesMetrics] = useState({
    totalRevenue: 50000,
    numSales: 100,
    avgSalePrice: 500
  });
  
  const [recentSales, setRecentSales] = useState([
    {
      id: 1,
      date: "2022-05-05",
      product: "Tomatoes",
      quantity: 10000,
      price: "Rs. 5,00,000"
    },
    {
      id: 2,
      date: "2022-05-04",
      product: "Lady's Finger",
      quantity: 190290,
      price: "Rs. 7,00,070"
    },
    {
      id: 3,
      date: "2022-05-03",
      product: "Aata",
      quantity: 20000,
      price: "Rs. 50,05,000"
    }
  ]);
  
  const [analyticsData, setAnalyticsData] = useState([
    { date: "2022-05-01", visitors: 500, registeredUsers: 100, roleChanges: 10 },
    { date: "2022-05-02", visitors: 600, registeredUsers: 120, roleChanges: 12 },
    { date: "2022-05-03", visitors: 700, registeredUsers: 140, roleChanges: 14 },
    { date: "2022-05-04", visitors: 800, registeredUsers: 160, roleChanges: 16 },
    { date: "2022-05-05", visitors: 900, registeredUsers: 180, roleChanges: 18 }
  ]);
  
  const [totalVisitors, setTotalVisitors] = useState(1000);
  const [totalRegisteredUsers, setTotalRegisteredUsers] = useState(200);
  const [totalRoleChanges, setTotalRoleChanges] = useState(20);

  useEffect(() => {
    // Fetch sales metrics data
    axios.get('/api/sales-metrics')
      .then(response => {
        setSalesMetrics(response.data);
      })
      .catch(error => console.error(error));

    // Fetch recent sales activity
    axios.get('/api/recent-sales')
      .then(response => {
        setRecentSales(response.data);
      })
      .catch(error => console.error(error));

    // Fetch analytics data
    axios.get('/api/analytics')
      .then(response => {
        setAnalyticsData(response.data);
      })
      .catch(error => console.error(error));

    // Fetch total visitors, registered users, and role changes
    axios.get('/api/user-stats')
      .then(response => {
        setTotalVisitors(response.data.visitors);
        setTotalRegisteredUsers(response.data.registeredUsers);
        setTotalRoleChanges(response.data.roleChanges);
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <div className={classes.root}>
      <Typography variant="h3" align="center">Owner Dashboard</Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <Typography variant="h4">Sales Metrics</Typography>
            <Typography>Total Revenue: {salesMetrics.totalRevenue}</Typography>
            <Typography>Number of Sales: {salesMetrics.numSales}</Typography>
            <Typography>Average Sale Price: {salesMetrics.avgSalePrice}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <Typography variant="h4">Recent Sales Activity</Typography>
            <List>
              {recentSales.map(sale => (
                <>
                  <ListItem key={sale.id}>
                    <ListItemText
                      primary={`${sale.product} (${sale.quantity} units)`}
                      secondary={sale.price}
                    />
                    <Typography variant="body2">{sale.date}</Typography>
                  </ListItem>
                  <Divider />
                </>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <Typography variant="h4">Analytics</Typography>
            <div className={classes.chart}>
              <LineChart width={500} height={300} data={analyticsData}>
                <XAxis dataKey="date" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="visitors" stroke="#8884d8" />
                <Line type="monotone" dataKey="registeredUsers" stroke="#82ca9d" />
                <Line type="monotone" dataKey="roleChanges" stroke="#ffc658" />
              </LineChart>
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <Typography variant="h4">Support and Help</Typography>
            <Typography>If you need assistance, please contact our support team at support@example.com.</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <Typography variant="h4">News and Updates</Typography>
            <List>
              <ListItem>
                <ListItemText primary="Version 2.0.1 released" />
              </ListItem>
              <ListItem>
                <ListItemText primary="New feature: Export sales data to CSV" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Upcoming feature: Integration with external analytics tools" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <Typography variant="h4">User Statistics</Typography>
            <p>Total visitors: {totalVisitors}</p>
            <p>Total registered users: {totalRegisteredUsers}</p>
            <p>Total role changes: {totalRoleChanges}</p>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}


///////////////////////Functions////////////////////////////////////

function RegisterUser() {
  const [formData, setFormData] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try{
      await axios.post("http://localhost:3000/owner/register-user", formData);
      setShowSuccess(true);
    }catch(error){
      setShowError(true);
    }
  };

  const handleClose = () => {
    setShowSuccess(false);
    setShowError(false);
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
      {showSuccess && (
        <Alert
          message="User Registered successfully!"
          type="success"
          duration={5000}
          onClose={handleClose}
        />
      )}

      {showError && (
        <Alert
          message="User Registration failed!"
          type="error"
          duration={5000}
          onClose={handleClose}
        />
      )}
    </form>
  );
}

function GetUser() {
  const [formData, setFormData] = useState({});
  const [userData, setUserData] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const roles = {
    1: "Farmer",
    2: "Transporter",
    3: "Processor",
    4: "Wholesaler",
    5: "Distributor",
    6: "Retailer"
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClose = () => {
    setShowSuccess(false);
    setShowError(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try{
      const response = await axios.get(`http://localhost:3000/owner/get-user/${formData.address}`);
      const user = [
        Web3.utils.hexToUtf8(response.data.details[0]).trim(),
        response.data.details[1].join(" "),
        roles[response.data.details[2]],
        response.data.details[3]
      ]
      setUserData(user);
    }catch(error){
      setShowError(true);
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
        <button type="submit">Get User</button>
      </form>
      {userData && (
        <div className="user-info">
          <p>Name: {userData[0]}</p>
          <p>Location: {userData[1]}</p>
          <p>Role: {userData[2]}</p>
          <p>Address: {userData[3]}</p>
        </div>
      )}

      {showError && (
        <Alert
          message="Error Getting User"
          type="error"
          duration={5000}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

function ChangeUserRole() {
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
      await axios.patch('http://localhost:3000/owner/change-user-role', formData);
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
        {showSuccess && (
        <Alert
          message="User Role Changed successfully!"
          type="success"
          duration={5000}
          onClose={handleClose}
        />
      )}

      {showError && (
        <Alert
          message="Changing user role failed!!"
          type="error"
          duration={5000}
          onClose={handleClose}
        />
      )}
      </form>
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
                  <Link className="logo" to="/owner">
                    Owner
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
    title: "Register User",
    path: "/owner/register-user",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "Get User",
    path: "/owner/get-user",
    icon: <IoIcons.IoIosPaper />,
    cName: "nav-text",
  },
  {
    title: "Change User Role",
    path: "/owner/change-user-role",
    icon: <FaIcons.FaCartPlus />,
    cName: "nav-text",
  }
];



export default Owner;

import React, { useState } from "react";
import { Routes, Route, Link} from "react-router-dom";
import axios from "axios";
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
          <Route path='/register-user' element={<RegisterUser/>} />
          <Route path='/get-user' element={<GetUser/>} />
          <Route path='/change-user-role' element={<ChangeUserRole/>} />
        </Routes>
    </div>
  );
}

///////////////////////Functions////////////////////////////////////

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

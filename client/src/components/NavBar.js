import React from "react";
import { useAuth0 } from "../react-auth0-spa";
import { Link } from "react-router-dom";
import { Menu } from 'semantic-ui-react'
import Dashboard from '../components/Dashboard'

const NavBar = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <div>
      {!isAuthenticated && (
        <nav>
          <div>
            <Menu borderless compact inverted style={{ width: 1079, backgroundColor: '#00597A' }}>
              <Menu.Item>
                Bang The Table
              </Menu.Item>
              <Menu.Item fitted style={{ backgroundColor: '#EA961C', color: 'white', paddingLeft: 20, paddingRight: 20 }}>
                Dashboard
              </Menu.Item>
              <Menu.Item position="right" fitted style={{ backgroundColor: '#1BAA8F', color: 'white', paddingLeft: 20, paddingRight: 20 }} >
                Name goes here
            </Menu.Item>
              <Menu.Item fitted name="log" style={{ backgroundColor: "#3DA4D4", paddingRight: 20, paddingLeft: 20 }} onClick={() => loginWithRedirect({})}>
                Login
              </Menu.Item>
            </Menu>
          </div>
        </nav>
      )}

      {isAuthenticated && (
        <nav>
          <div>
            <Menu borderless compact inverted style={{ width: 1079, backgroundColor: '#00597A' }}>
              <Menu.Item to="/">
                <Link to="/">Bang The Table</Link>
              </Menu.Item>
              <Menu.Item fitted style={{ backgroundColor: '#EA961C', color: 'white', paddingLeft: 20, paddingRight: 20 }}>
                <Link to="/dashboard">Dashboard</Link>
              </Menu.Item>
              <Menu.Item position="right" fitted style={{ backgroundColor: '#1BAA8F', color: 'white', paddingLeft: 20, paddingRight: 20 }} >
                Name goes here
                  </Menu.Item>
              <Menu.Item fitted name="log" style={{ backgroundColor: "#3DA4D4", paddingRight: 20, paddingLeft: 20 }} onClick={() => logout()}>
                Logout
                    </Menu.Item>
            </Menu>
          </div>
        </nav>
      )}

      {isAuthenticated && (
        <span>
          <Link to="/">Home</Link>&nbsp;
          <Dashboard />
        </span>
      )}

    </div>
  );
};

export default NavBar;
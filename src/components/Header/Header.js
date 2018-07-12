import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import header_logo from '../../assets/kwangil_logo_with_name.svg';
import './Header.css';

const Header = ({ isLoggedIn, openNav }) => {
  return (
    <AppBar className="header" position="fixed">
      <Toolbar>
        <Link to="/home" className="header-logo">
          <img src={header_logo} alt="kwangil logo" />
        </Link>
        {isLoggedIn && (
          <IconButton
            id="nav-toggle"
            color="inherit"
            aria-label="Menu"
            onClick={openNav}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Header;

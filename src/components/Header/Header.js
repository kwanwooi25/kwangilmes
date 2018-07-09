import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import header_logo from '../../assets/kwangil_logo_with_name.svg';
import './Header.css';

class Header extends Component {
  state = {
    isNavOpen: false
  };

  openNav() {
    this.setState({ isNavOpen: true });
  }

  closeNav() {
    this.setState({ isNavOpen: false });
  }

  render() {
    const { isLoggedIn, logoutUser } = this.props;
    return (
      <AppBar className="header-wrapper" position="static">
        <Toolbar>
          <Link to="/home" className="header-logo">
            <img src={header_logo} alt="kwangil logo" />
          </Link>
          {isLoggedIn && (
            <IconButton
              color="inherit"
              aria-label="Menu"
              onClick={this.openNav.bind(this)}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
        <Drawer
          anchor="right"
          open={this.state.isNavOpen}
          onClose={this.closeNav.bind(this)}
        >
          <List component="nav">
            <ListItem
              button
              divider
              onClick={() => {
                logoutUser();
                this.closeNav();
              }}
            >
              <ListItemText primary="로그아웃" />
            </ListItem>
            <Link className="nav-item" to="/accounts" onClick={this.closeNav.bind(this)}>
              <ListItem button>
                <ListItemText primary="업체관리" />
              </ListItem>
            </Link>
            <Link className="nav-item" to="/products" onClick={this.closeNav.bind(this)}>
              <ListItem button>
                <ListItemText primary="품목관리" />
              </ListItem>
            </Link>
            <Link className="nav-item" to="/plates" onClick={this.closeNav.bind(this)}>
              <ListItem button>
                <ListItemText primary="동판관리" />
              </ListItem>
            </Link>
            <Link className="nav-item" to="/orders" onClick={this.closeNav.bind(this)}>
              <ListItem button>
                <ListItemText primary="주문관리" />
              </ListItem>
            </Link>
            <Link className="nav-item" to="/users" onClick={this.closeNav.bind(this)}>
              <ListItem button>
                <ListItemText primary="사용자관리" />
              </ListItem>
            </Link>
          </List>
        </Drawer>
      </AppBar>
    );
  }
}

export default connect(
  null,
  { logoutUser }
)(Header);

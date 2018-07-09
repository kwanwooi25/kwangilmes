import React, { Component } from 'react';
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
  }

  openNav() {
    this.setState({ isNavOpen : true });
  }

  closeNav() {
    this.setState({ isNavOpen : false });
  }

  render() {
    const { auth } = this.props;
    return (
        <AppBar className="header-wrapper" position="static">
          <Toolbar>
            <div className="header-logo">
              <img src={header_logo} alt="kwangil logo"></img>
            </div>
            {auth && (
              <IconButton color="inherit" aria-label="Menu" onClick={this.openNav.bind(this)}>
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
          <Drawer anchor="right" open={this.state.isNavOpen} onClose={this.closeNav.bind(this)}>
            <List component="nav">
              <ListItem button>
                <ListItemText primary="업체관리" />
              </ListItem>
              <ListItem button>
                <ListItemText primary="품목관리" />
              </ListItem>
              <ListItem button>
                <ListItemText primary="동판관리" />
              </ListItem>
              <ListItem button>
                <ListItemText primary="주문관리" />
              </ListItem>
              <ListItem button>
                <ListItemText primary="원료현황" />
              </ListItem>
              <ListItem button>
                <ListItemText primary="사용자관리" />
              </ListItem>
            </List>
          </Drawer>
        </AppBar>
    );
  }
}

export default Header;

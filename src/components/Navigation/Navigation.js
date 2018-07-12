import React from 'react';
import { Link } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import './Navigation.css';

const Navigation = ({ open, closeNav, logoutUser }) => {
  return (
    <div>
      <Drawer anchor="right" open={open} onClose={closeNav}>
        <List component="nav">
          <ListItem
            button
            divider
            onClick={() => {
              logoutUser();
              closeNav();
            }}
          >
            <ListItemText primary="로그아웃" />
          </ListItem>
          <Link className="nav-item" to="/accounts" onClick={closeNav}>
            <ListItem button>
              <ListItemText primary="업체관리" />
            </ListItem>
          </Link>
          <Link className="nav-item" to="/products" onClick={closeNav}>
            <ListItem button>
              <ListItemText primary="품목관리" />
            </ListItem>
          </Link>
          <Link className="nav-item" to="/plates" onClick={closeNav}>
            <ListItem button>
              <ListItemText primary="동판관리" />
            </ListItem>
          </Link>
          <Link className="nav-item" to="/orders" onClick={closeNav}>
            <ListItem button>
              <ListItemText primary="주문관리" />
            </ListItem>
          </Link>
          <Link className="nav-item" to="/users" onClick={closeNav}>
            <ListItem button>
              <ListItemText primary="사용자관리" />
            </ListItem>
          </Link>
        </List>
      </Drawer>
    </div>
  );
};

export default Navigation;

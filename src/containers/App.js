import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutUser } from '../actions';
import Snackbar from '@material-ui/core/Snackbar';
import Header from '../components/Header/Header';
import Navigation from '../components/Navigation/Navigation';
import LoginPage from './LoginPage/LoginPage';
import AccountsPage from './AccountsPage/AccountsPage';
import './App.css';

const DashboardPage = () => <h1>DashboardPage</h1>;
const ProductsPage = () => <h1>ProductsPage</h1>;
const PlatesPage = () => <h1>PlatesPage</h1>;
const OrdersPage = () => <h1>OrdersPage</h1>;
const UsersPage = () => <h1>UsersPage</h1>;

const PublicRoute = ({ isLoggedIn, ...rest }) =>
  isLoggedIn === false ? <Route {...rest} /> : <Redirect to="/home" />;

const PrivateRoute = ({ isLoggedIn, ...rest }) =>
  isLoggedIn === false ? <Redirect to="/" /> : <Route {...rest} />;

const PUBLIC_ROUTES = [{ path: '/', component: LoginPage }];

const PRIVATE_ROUTES = [
  { path: '/home', component: DashboardPage },
  { path: '/accounts', component: AccountsPage },
  { path: '/products', component: ProductsPage },
  { path: '/plates', component: PlatesPage },
  { path: '/orders', component: OrdersPage },
  { path: '/users', component: UsersPage }
];

class App extends Component {
  state = {
    isNavOpen: false
  };

  renderPublicRoutes() {
    const { isLoggedIn } = this.props.auth;
    return PUBLIC_ROUTES.map(({ path, component }) => (
      <PublicRoute
        exact
        key={path}
        path={path}
        isLoggedIn={isLoggedIn}
        component={component}
      />
    ));
  }

  renderPrivateRoutes() {
    const { isLoggedIn } = this.props.auth;
    return PRIVATE_ROUTES.map(({ path, component }) => (
      <PrivateRoute
        exact
        key={path}
        path={path}
        isLoggedIn={isLoggedIn}
        component={component}
      />
    ));
  }

  openNav() {
    this.setState({ isNavOpen: true });
  }

  closeNav() {
    this.setState({ isNavOpen: false });
  }

  render() {
    const { isLoggedIn } = this.props.auth;
    const { isSnackbarOpen, snackbarMessage } = this.props.snackbar;
    const { logoutUser, showSnackbar } = this.props;
    return (
      <BrowserRouter>
        <div className="App">
          <Header isLoggedIn={isLoggedIn} openNav={this.openNav.bind(this)} />
          {isLoggedIn && (
            <Navigation
              open={this.state.isNavOpen}
              closeNav={this.closeNav.bind(this)}
              logoutUser={logoutUser}
            />
          )}
          <Switch>
            {this.renderPublicRoutes()}
            {this.renderPrivateRoutes()}
          </Switch>
          <Snackbar
            className="snackbar"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            autoHideDuration={4000}
            open={isSnackbarOpen}
            ContentProps={{
              'aria-describedby': 'snackbarMessage',
              className: 'snackbar-content'
            }}
            message={<span id="snackbarMessage">{snackbarMessage}</span>}
          />
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = ({ auth, snackbar }) => {
  return { auth, snackbar };
};

export default connect(
  mapStateToProps,
  { logoutUser }
)(App);

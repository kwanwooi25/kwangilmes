import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Header from './components/Header/Header';
import LoginPage from './containers/LoginPage/LoginPage';
import AccountsPage from './containers/AccountsPage/AccountsPage';

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

  render() {
    const { isLoggedIn, user } = this.props.auth;
    return (
      <BrowserRouter>
        <div className="App">
          <Header isLoggedIn={isLoggedIn} />
          <Switch>
            {this.renderPublicRoutes()}
            {this.renderPrivateRoutes()}
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  return { auth };
};

export default connect(mapStateToProps)(App);

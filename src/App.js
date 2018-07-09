import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Header from './components/Header/Header';
import LoginPage from './pages/LoginPage/LoginPage';

const DashboardPage = () => <h1>DashboardPage</h1>;
const AccountsPage = () => <h1>AccountsPage</h1>;
const ProductsPage = () => <h1>ProductsPage</h1>;
const PlatesPage = () => <h1>PlatesPage</h1>;
const OrdersPage = () => <h1>OrdersPage</h1>;
const UsersPage = () => <h1>UsersPage</h1>;

const PublicRoute = ({ auth, ...rest }) => (
  auth === false ? <Route {...rest} /> : <Redirect to='/home' />
);

const PrivateRoute = ({ auth, ...rest }) => (
  auth === false ? <Redirect to='/' /> : <Route {...rest} />
);

const PUBLIC_ROUTES = [{ path: '/', component: LoginPage }];

const PRIVATE_ROUTES = [
  { path: '/home', component: DashboardPage },
  { path: '/accounts', component: AccountsPage },
  { path: '/products', component: ProductsPage },
  { path: '/plates', component: PlatesPage },
  { path: '/orders', component: OrdersPage },
  { path: '/users', component: UsersPage },
];

class App extends Component {
  state = {
    auth: false
  }

  renderPublicRoutes() {
    return PUBLIC_ROUTES.map(({ path, component }) => (
      <PublicRoute
        exact
        key={path}
        path={path}
        auth={this.state.auth}
        component={component}
      />
    ));
  }

  renderPrivateRoutes() {
    return PRIVATE_ROUTES.map(({ path, component }) => (
      <PrivateRoute
        exact
        key={path}
        path={path}
        auth={this.state.auth}
        component={component}
      />
    ));
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Header auth={this.state.auth} />
          <Switch>
            {this.renderPublicRoutes()}
            {this.renderPrivateRoutes()}
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;

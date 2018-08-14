import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import 'moment/locale/ko';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import { logoutUser } from '../actions';
import Snackbar from '@material-ui/core/Snackbar';
import Header from '../components/Header/Header';
import Navigation from '../components/Navigation/Navigation';
import LoginPage from './LoginPage/LoginPage';
import DashboardPage from './DashboardPage/DashboardPage';
import AccountsPage from './AccountsPage/AccountsPage';
import ProductsPage from './ProductsPage/ProductsPage';
import PlatesPage from './PlatesPage/PlatesPage';
import OrdersPage from './OrdersPage/OrdersPage';
import UsersPage from './UsersPage/UsersPage';
import './App.css';

const PublicRoute = ({ isPermitted, ...rest }) =>
	isPermitted === false ? <Route {...rest} /> : <Redirect to="/home" />;

const PrivateRoute = ({ isPermitted, ...rest }) => (isPermitted === false ? <Redirect to="/" /> : <Route {...rest} />);

const PUBLIC_ROUTES = [ { path: '/', component: LoginPage } ];

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
			<PublicRoute exact key={path} path={path} isPermitted={isLoggedIn} component={component} />
		));
	}

	renderPrivateRoutes() {
		const { isLoggedIn, current_user } = this.props.auth;
		return PRIVATE_ROUTES.map(({ path, component }) => {
			const isPermitted = current_user[`can_read_${path.replace('/', '')}`] || path === '/home';

			return (
				<PrivateRoute
					exact
					key={path}
					path={path}
					isPermitted={isLoggedIn && isPermitted}
					component={component}
				/>
			);
		});
	}

	openNav() {
		this.setState({ isNavOpen: true });
	}

	closeNav() {
		this.setState({ isNavOpen: false });
	}

	render() {
		const { isLoggedIn, current_user } = this.props.auth;
		const { isSnackbarOpen, snackbarMessage } = this.props.snackbar;
		const { logoutUser } = this.props;
		return (
			<MuiPickersUtilsProvider utils={MomentUtils} moment={moment} locale="ko">
				<BrowserRouter>
					<div className="App">
						<Header isLoggedIn={isLoggedIn} openNav={this.openNav.bind(this)} />
						{isLoggedIn && (
							<Navigation
								open={this.state.isNavOpen}
								closeNav={this.closeNav.bind(this)}
								current_user={current_user}
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
							open={isSnackbarOpen}
							ContentProps={{
								'aria-describedby': 'snackbarMessage',
								className: 'snackbar-content'
							}}
							message={<span id="snackbarMessage">{snackbarMessage}</span>}
						/>
					</div>
				</BrowserRouter>
			</MuiPickersUtilsProvider>
		);
	}
}

const mapStateToProps = ({ auth, snackbar }) => {
	return { auth, snackbar };
};

export default connect(mapStateToProps, { logoutUser })(App);

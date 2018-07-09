import React, { Component } from 'react';
import LoginForm from '../../components/LoginForm/LoginForm';
import './LoginPage.css';

class LoginPage extends Component {
  state = {
    error: false,
    errorMessage: ''
  };
  onSubmit(username, password) {
    console.log(username, password);
  }

  render() {
    return (
      <div className="login-page">
        <LoginForm
          onSubmit={this.onSubmit}
          error={this.state.error}
          errorMessage={this.state.errorMessage}
        />
      </div>
    );
  }
}

export default LoginPage;

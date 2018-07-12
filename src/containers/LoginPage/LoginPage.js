import React from 'react';
import { connect } from 'react-redux';
import { loginUser } from '../../actions';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './LoginPage.css';

const LoginPage = ({ loginUser, error }) => {
  return (
    <main className="login-page">
      <Card className="login-form">
        <TextField id="username" label="아이디" margin="normal" fullWidth />
        <TextField
          id="password"
          label="비밀번호"
          margin="normal"
          type="password"
          fullWidth
        />
        {error && <p className="login-form__error">{error}</p>}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            loginUser(username, password);
          }}
        >
          로그인
        </Button>
      </Card>
    </main>
  );
};

const mapStateToProps = ({ auth }) => {
  return { error: auth.error };
}

export default connect(mapStateToProps, { loginUser })(LoginPage);

import React from 'react';
import { connect } from 'react-redux';
import { loginUser } from '../../actions';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './LoginPage.css';

const LoginPage = ({ loginUser, error }) => {
  return (
    <main className="login-page">
      <Card className="login-form">
        <CardContent>
          <Typography variant="display2" align="center">
            로그인
          </Typography>
          <TextField id="username" label="아이디" margin="normal" fullWidth />
          <TextField
            id="password"
            label="비밀번호"
            margin="normal"
            type="password"
            fullWidth
          />
          {error && <p className="login-form__error">{error}</p>}
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              const username = document.getElementById('username').value;
              const password = document.getElementById('password').value;
              loginUser(username, password);
            }}
          >
            로그인
          </Button>
        </CardActions>
      </Card>
    </main>
  );
};

const mapStateToProps = ({ auth }) => {
  return { error: auth.error };
}

export default connect(mapStateToProps, { loginUser })(LoginPage);

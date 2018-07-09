import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAccounts } from '../../actions';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

class AccountsPage extends Component {
  componentDidMount() {
    this.props.fetchAccounts(this.props.auth.user);
  }

  render() {
    return (
      <main>
        <Typography variant="display1" gutterBottom>
          업체목록
        </Typography>
        <Divider />
      </main>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  return { auth };
}

export default connect(mapStateToProps, { fetchAccounts })(AccountsPage);

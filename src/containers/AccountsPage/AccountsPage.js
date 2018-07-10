import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAccounts } from '../../actions';
import Divider from '@material-ui/core/Divider';
import PageHeader from '../../components/PageHeader/PageHeader';

import ListHeader from '../../components/ListHeader/ListHeader';
import ListBody from '../../components/ListBody/ListBody';
import './AccountsPage.css';

class AccountsPage extends Component {
  constructor() {
    super();

    this.onSearchChange = this.onSearchChange.bind(this);
    this.onRowsPerPageChange = this.onRowsPerPageChange.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }
  componentDidMount() {
    const { search } = this.props.accounts;
    const token = this.props.auth.userToken;
    this.props.fetchAccounts(token, search);
  }

  onSearchChange(text) {
    const { search } = this.props.accounts;
    const token = this.props.auth.userToken;
    search.searchTerm = text;
    this.props.fetchAccounts(token, search);
  }

  onRowsPerPageChange(limit) {
    const { search } = this.props.accounts;
    const token = this.props.auth.userToken;
    search.limit = limit;
    search.offset = 0;
    this.props.fetchAccounts(token, search);
  }

  onPageChange(change) {
    const {
      accounts: { totalCount, search }
    } = this.props;
    const token = this.props.auth.userToken;
    switch (change) {
      case 'prev':
        search.offset -= search.limit;
        break;
      case 'next':
        search.offset += search.limit;
        break;
      case 'first':
        search.offset = 0;
        break;
      case 'last':
        if (totalCount % search.limit === 0) {
          search.offset = (parseInt(totalCount / search.limit) - 1) * 10;
        } else {
          search.offset = parseInt(totalCount / search.limit) * 10;
        }
        break;
    }
    console.log(search);
    this.props.fetchAccounts(token, search);
  }

  render() {
    console.log(this.props);
    const { list, search } = this.props.accounts;
    const currentPage = 1 + search.offset / search.limit;
    return (
      <main>
        <PageHeader
          title="업체관리"
          searchBox
          onSearchChange={this.onSearchChange}
        />
        <Divider />
        <ListHeader
          rowsPerPage={search.limit}
          currentPage={currentPage}
          onRowsPerPageChange={this.onRowsPerPageChange}
          onPageChange={this.onPageChange}
        />
        <ListBody accounts={list} />
      </main>
    );
  }
}

const mapStateToProps = ({ auth, accounts }) => {
  return { auth, accounts };
};

export default connect(
  mapStateToProps,
  { fetchAccounts }
)(AccountsPage);

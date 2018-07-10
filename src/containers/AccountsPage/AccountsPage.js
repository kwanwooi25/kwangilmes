import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAccounts, toggleAccountChecked, setAccountsChecked } from '../../actions';
import Divider from '@material-ui/core/Divider';
import PageHeader from '../../components/PageHeader/PageHeader';
import ListHeader from '../../components/ListHeader/ListHeader';
import ListBody from '../../components/ListBody/ListBody';
import Spinner from '../../components/Spinner/Spinner';
import './AccountsPage.css';

class AccountsPage extends Component {
  constructor() {
    super();

    this.onSearchChange = this.onSearchChange.bind(this);
    this.onRowsPerPageChange = this.onRowsPerPageChange.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.onListItemChecked = this.onListItemChecked.bind(this);
    this.onSelectAllChange = this.onSelectAllChange.bind(this);
  }

  componentDidMount() {
    const { search } = this.props.accounts;
    const token = this.props.auth.userToken;
    this.props.fetchAccounts(token, search);
  }

  onSearchChange(text) {
    const { search } = this.props.accounts;
    const token = this.props.auth.userToken;
    search.account_name = text;
    search.offset = 0;
    this.props.fetchAccounts(token, search);
  }

  onRowsPerPageChange(limit) {
    const { search } = this.props.accounts;
    const token = this.props.auth.userToken;
    search.limit = Number(limit);
    search.offset = 0;
    this.props.fetchAccounts(token, search);
  }

  onPageChange(change) {
    const {
      accounts: { count, search }
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
        if (count % search.limit === 0) {
          search.offset = (parseInt(count / search.limit) - 1) * search.limit;
        } else {
          search.offset = parseInt(count / search.limit) * search.limit;
        }
        break;
    }
    this.props.fetchAccounts(token, search);
  }

  onListItemChecked(id) {
    this.props.toggleAccountChecked(id);
  }

  onSelectAllChange(checked) {
    this.props.setAccountsChecked(checked);
  }

  render() {
    console.log(this.props.accounts);
    const { count, all, search, selected, isPending } = this.props.accounts;
    const isFirstPage = search.offset === 0;
    const isLastPage = count <= search.offset + search.limit;
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
          isFirstPage={isFirstPage}
          isLastPage={isLastPage}
          onRowsPerPageChange={this.onRowsPerPageChange}
          onPageChange={this.onPageChange}
          onSelectAllChange={this.onSelectAllChange}
        />
        <ListBody
          accounts={all}
          onListItemChecked={this.onListItemChecked}
          selected={selected}
        />
      </main>
    );
  }
}

const mapStateToProps = ({ auth, accounts }) => {
  return { auth, accounts };
};

export default connect(
  mapStateToProps,
  { fetchAccounts, toggleAccountChecked, setAccountsChecked }
)(AccountsPage);

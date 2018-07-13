import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import AccountName from '../AccountName/AccountName';
import './AccountListItem.css';

const AccountListItem = ({
  searchTerm,
  account,
  onListItemChecked,
  onListItemEditClick,
  onListItemDeleteClick
}) => {
  const { id, phone, checked } = account;
  return (
    <li key={id} className="list-body__item">
      <div>
        <Checkbox
          checked={checked}
          onChange={() => {
            onListItemChecked(id);
          }}
          color="primary"
        />
      </div>
      <Grid container>
        <Grid item xs={8} sm={10} className="account-list-item__details">
          <Grid item xs={12} sm={6}>
            <AccountName account={account} searchTerm={searchTerm} />
          </Grid>
          <Grid item xs={12} sm={4}>
            {phone && <span>{phone}</span>}
          </Grid>
        </Grid>
        <Grid item xs={4} sm={2} className="button-group">
          <IconButton
            color="primary"
            aria-label="edit"
            onClick={() => {
              onListItemEditClick('edit', id);
            }}
          >
            <Icon>edit</Icon>
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => {
              onListItemDeleteClick([id]);
            }}
          >
            <Icon>delete</Icon>
          </IconButton>
        </Grid>
      </Grid>
    </li>
  );
};

export default AccountListItem;

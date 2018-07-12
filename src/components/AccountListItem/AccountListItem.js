import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import './AccountListItem.css';

const ListBodyItem = ({
  account,
  onListItemChecked,
  onListItemEditClick,
  onListItemDeleteClick
}) => {
  const { id, account_name, phone, checked } = account;
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
      <div className="account-list-item__details">
        <h3 className="account-list-item__title">{account_name}</h3>
        {phone && <span>{phone}</span>}
      </div>
      <div className="button-group">
        <IconButton
          color="primary"
          aria-label="edit"
          onClick={() => {
            onListItemEditClick('edit', id);
          }}>
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
      </div>
    </li>
  );
};

export default ListBodyItem;

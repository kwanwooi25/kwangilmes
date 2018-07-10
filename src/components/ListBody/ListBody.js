import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import './ListBody.css';

const ListBody = ({ accounts, onListItemChecked }) => {
  console.log(accounts);
  return (
    <ul className="list-body">
      {accounts &&
        accounts.map(account => {
          const { id, account_name, phone, checked } = account;
          return (
            <li key={id} className="list-body__item">
              <div className="list-body__checkbox">
                <Checkbox
                  checked={checked}
                  onChange={() => {
                    onListItemChecked(id);
                  }}
                  color="primary"
                />
              </div>
              <div className="list-body__details">
                <h3 className="list-body__title">{account_name}</h3>
                {phone && <span>{phone}</span>}
              </div>
              <div className="list-body__button-group">
                <IconButton color="primary" aria-label="edit">
                  <Icon>edit</Icon>
                </IconButton>
                <IconButton aria-label="delete">
                  <Icon>delete</Icon>
                </IconButton>
              </div>
            </li>
          );
        })}
    </ul>
  );
};

export default ListBody;

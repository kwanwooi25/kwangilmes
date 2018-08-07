import React from 'react';
import { highlight } from '../../helpers/highlight';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import PlateSize from '../PlateSize/PlateSize';
import './PlateListItem.css';

const PlateListItem = ({
  search,
  plate,
  onListItemChecked,
  onListItemEditClick,
  onListItemDeleteClick
}) => {
  const {
    id,
    checked,
    product_1,
    product_1_account_name,
    product_1_name,
    product_1_thick,
    product_1_length,
    product_1_width,
    product_2,
    product_2_account_name,
    product_2_name,
    product_2_thick,
    product_2_length,
    product_2_width,
    product_3,
    product_3_account_name,
    product_3_name,
    product_3_thick,
    product_3_length,
    product_3_width
  } = plate;
  const products = [
    {
      id: product_1,
      account_name: product_1_account_name,
      name: product_1_name,
      size: `${product_1_thick} x ${product_1_length} x ${product_1_width}`
    },
    {
      id: product_2,
      account_name: product_2_account_name,
      name: product_2_name,
      size: `${product_2_thick} x ${product_2_length} x ${product_2_width}`
    },
    {
      id: product_3,
      account_name: product_3_account_name,
      name: product_3_name,
      size: `${product_3_thick} x ${product_3_length} x ${product_3_width}`
    }
  ];

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
      <Grid container className="list-body__item-details">
        <Grid item xs={12} md={3} className="plate-list-item__plate-size">
          <PlateSize plate={plate} search={search} />
        </Grid>
        <Grid item xs={12} md={9} className="plate-list-item__product-list">
          {products.length &&
            products.map(({ id, account_name, name, size }) => {
              if (id !== null && name !== null) {
                name = highlight(name, search.product_name);
                return (
                  <div key={id} className="plate-list-item__product">
                    <span className="plate-list-item__account-name">
                      {account_name}
                    </span>
                    <span
                      className="plate-list-item__product-name"
                      dangerouslySetInnerHTML={{ __html: name }}
                    />
                    <span className="plate-list-item__product-size">
                      {size}
                    </span>
                  </div>
                );
              }
                return undefined;
            })}
        </Grid>
      </Grid>
      <div className="list-body__item-buttons">
        <Tooltip title="수정">
          <IconButton
            color="primary"
            aria-label="edit"
            onClick={() => {
              onListItemEditClick('edit', id);
            }}
          >
            <Icon>edit</Icon>
          </IconButton>
        </Tooltip>
        <Tooltip title="삭제">
          <IconButton
            aria-label="delete"
            onClick={() => {
              onListItemDeleteClick([id]);
            }}
          >
            <Icon>delete</Icon>
          </IconButton>
        </Tooltip>
      </div>
    </li>
  );
};

export default PlateListItem;

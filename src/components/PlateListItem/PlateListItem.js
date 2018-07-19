import React from 'react';
import { highlight } from '../../helpers/highlight';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import Hidden from '@material-ui/core/Hidden';
// import AccountName from '../AccountName/AccountName';
// import ProductName from '../ProductName/ProductName';
// import ProductSize from '../ProductSize/ProductSize';
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
    plate_round,
    plate_length,
    plate_material,
    product_1,
    product_1_name,
    product_1_thick,
    product_1_length,
    product_1_width,
    product_2,
    product_2_name,
    product_2_thick,
    product_2_length,
    product_2_width,
    product_3,
    product_3_name,
    product_3_thick,
    product_3_length,
    product_3_width,
  } = plate;
  const plateSize = `${plate_round} x ${plate_length}`;
  const products = [
    {
      id: product_1,
      name: product_1_name,
      thick: product_1_thick,
      length: product_1_length,
      width: product_1_width
    },
    {
      id: product_2,
      name: product_2_name,
      thick: product_2_thick,
      length: product_2_length,
      width: product_2_width
    },
    {
      id: product_3,
      name: product_3_name,
      thick: product_3_thick,
      length: product_3_length,
      width: product_3_width
    },
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
      <Grid container>
        <Grid item xs={8} sm={10} className="plate-list-item__details">
          <Grid item xs={12} md={9} lg={10} className="plate-list-item__names">
            <Grid item xs={12} md={3}>
              {plateSize}
            </Grid>
            <Grid item xs={12} md={3}>
              {products.length && products.map(product => {
                if (product.id !== null) {
                  return <span key={product.id}>{product.name}</span>
                }
              })}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4} sm={2} className="button-group">
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
        </Grid>
      </Grid>
    </li>
  );
};

export default PlateListItem;

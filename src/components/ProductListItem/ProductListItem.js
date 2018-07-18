import React from 'react';
import { highlight } from '../../helpers/highlight';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import Hidden from '@material-ui/core/Hidden';
import AccountName from '../AccountName/AccountName';
import ProductName from '../ProductName/ProductName';
import ProductSize from '../ProductSize/ProductSize';
import './ProductListItem.css';

const ProductListItem = ({
  search,
  product,
  onListItemChecked,
  onListItemOrderClick,
  onListItemEditClick,
  onListItemDeleteClick
}) => {
  const {
    id,
    checked,
    ext_color,
    is_print,
    print_front_color_count,
    print_front_color,
    print_back_color_count,
    print_back_color
  } = product;
  const extColor = highlight(ext_color, search.ext_color);
  let printCount;
  let printFront;
  let printBack;
  let printColor;
  if (is_print) {
    printCount =
      Number(print_front_color_count) + Number(print_back_color_count);
    if (Number(print_back_color_count) > 0) {
      printFront = `전면: ${print_front_color}`;
      printBack = `후면: ${print_back_color}`;
      printColor = highlight(
        `인쇄 ${printCount}도 (${printFront} / ${printBack})`,
        search.print_color
      );
    } else {
      printColor = highlight(
        `인쇄 ${printCount}도 (${print_front_color})`,
        search.print_color
      );
    }
  }

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
        <Grid item xs={8} sm={10} className="product-list-item__details">
          <Grid item xs={12} md={9} lg={10} className="product-list-item__names">
            <Grid item xs={12} md={3}>
              <AccountName
                account={product}
                searchTerm={search.account_name}
                className="product-list-item__account-name"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ProductName product={product} searchTerm={search.product_name} />
            </Grid>
            <Grid item xs={12} md={3}>
              <ProductSize product={product} search={search} />
            </Grid>
          </Grid>
          <Hidden smDown>
            <Grid item md={3} lg={2} className="product-list-item__colors">
              <Grid item md={12} lg={3}>
                <span dangerouslySetInnerHTML={{ __html: extColor }} />
              </Grid>
              {is_print && (
                <Grid item md={12} lg={9}>
                  <span dangerouslySetInnerHTML={{ __html: printColor }} />
                </Grid>
              )}
            </Grid>
          </Hidden>
        </Grid>
        <Grid item xs={4} sm={2} className="button-group">
          <Tooltip title="작업지시">
            <IconButton
              color="secondary"
              aria-label="order"
              onClick={() => {
                onListItemOrderClick(id);
              }}
            >
              <Icon>build</Icon>
            </IconButton>
          </Tooltip>
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

export default ProductListItem;

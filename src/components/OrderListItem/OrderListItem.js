import React from 'react';
import moment from 'moment';
import { highlight } from '../../helpers/highlight';
import { getWeight } from '../../helpers/getWeight';
import { comma } from '../../helpers/comma';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import OrderId from '../OrderId/OrderId';
import AccountName from '../AccountName/AccountName';
import ProductName from '../ProductName/ProductName';
import './OrderListItem.css';

const OrderListItem = ({
  search,
  order,
  onListItemChecked,
  onListItemCompleteClick,
  onListItemEditClick,
  onListItemDeleteClick,
  onListItemPrintClick
}) => {
  const {
    id,
    checked,
    is_delivery_strict,
    is_urgent,
    ordered_at,
    deliver_by,
    product_thick,
    product_length,
    product_width,
    is_print,
    print_front_color_count,
    print_back_color_count,
    order_quantity,
    order_quantity_weight,
    is_completed,
    completed_quantity,
    completed_at,
    is_order_modified
  } = order;

  // 제품규격
  const productThick = highlight(product_thick, search.product_thick);
  const productLength = highlight(product_length, search.product_length);
  const productWidth = highlight(product_width, search.product_width);
  const productSize = `${productThick} x ${productLength} x ${productWidth}`;

  // 제품 정보 (무지/인쇄)
  let printInfo = '무지';
  if (is_print)
    printInfo = `인쇄 ${Number(print_front_color_count) +
      Number(print_back_color_count)}도`;

  // 완성중량
  const completedQuantityWeight = getWeight(order, completed_quantity);

  // class name
  let className = "list-body__item order-list-item";
  if (is_completed) className += ' completed'

  return (
    <li key={id} className={className}>
      <div className="order-list-item__checkbox">
        <Checkbox
          checked={checked}
          disabled={is_completed}
          onChange={() => {
            onListItemChecked(id);
          }}
          color="primary"
        />
      </div>
      <Grid container spacing={8} className="list-body__item-details">
        <Grid item xs={6} lg={2}>
          <Grid
            item
            xs={12}
            className="order-list-item__delivery-remark-wrapper"
          >
            {is_delivery_strict && (
              <span className="order-list-item__delivery-remark">납기엄수</span>
            )}
            {is_urgent && (
              <span className="order-list-item__delivery-remark">지급</span>
            )}
            {is_order_modified && (
              <span className="order-list-item__delivery-remark modified">수정됨</span>
            )}
            {is_completed && (
              <span className="order-list-item__delivery-remark completed">완료</span>
            )}
          </Grid>
          <Grid item xs={12}>
            <OrderId order={order} />
          </Grid>
        </Grid>
        <Grid item xs={6} lg={2}>
          <Grid item xs={12} className="order-list-item__dates-wrapper">
            <span className="order-list-item__dates">
              발주일: {moment(ordered_at).format('YYYY-MM-DD')}
            </span>
          </Grid>
          <Grid item xs={12} className="order-list-item__dates-wrapper">
            <span className="order-list-item__dates">
              납기일: {moment(deliver_by).format('YYYY-MM-DD')}
            </span>
          </Grid>
          {is_completed && (
            <Grid item xs={12} className="order-list-item__dates-wrapper">
              <span className="order-list-item__dates">
                완료일: {moment(completed_at).format('YYYY-MM-DD')}
              </span>
            </Grid>
          )}
        </Grid>
        <Grid item xs={12} sm={5} lg={3}>
          <Grid item xs={12} className="order-list-item__account-name-wrapper">
            <AccountName
              account={order}
              searchTerm={search.account_name}
              className="order-list-item__account-name"
            />
          </Grid>
          <Grid item xs={12} className="order-list-item__product-name-wrapper">
            <ProductName
              product={order}
              searchTerm={search.product_name}
              className="order-list-item__product-name"
            />
          </Grid>
        </Grid>
        <Grid item xs={6} sm={4} lg={2}>
          <Grid item xs={12} className="order-list-item__product-size-wrapper">
            <span
              className="order-list-item__product-size"
              dangerouslySetInnerHTML={{ __html: productSize }}
            />
          </Grid>
          <Grid item xs={12} className="order-list-item__print-info-wrapper">
            <span className="order-list-item__print-info">{printInfo}</span>
          </Grid>
        </Grid>
        <Grid item xs={6} sm={3} lg={3}>
          <Grid item xs={12} className="order-list-item__quantity-wrapper">
            <span className="order-list-item__quantity-title">주문수량:</span>
            <span className="order-list-item__quantity">
              {comma(order_quantity)}매
            </span>
            <span className="order-list-item__quantity-weight">
              ({comma(Number(order_quantity_weight).toFixed(2))}kg)
            </span>
          </Grid>
          {completed_quantity && (
            <Grid item xs={12} className="order-list-item__quantity-wrapper">
              <span className="order-list-item__quantity-title">완성수량:</span>
              <span className="order-list-item__quantity">
                {comma(completed_quantity)}매
              </span>
              <span className="order-list-item__quantity-weight">
                ({comma(Number(completedQuantityWeight).toFixed(2))}kg)
              </span>
            </Grid>
          )}
        </Grid>
      </Grid>
      <div className="list-body__item-buttons order-list-item__buttons">
        <Tooltip title="출력">
          <IconButton
            color="primary"
            aria-label="print"
            onClick={() => {
              onListItemPrintClick([id]);
            }}
          >
            <Icon>print</Icon>
          </IconButton>
        </Tooltip>
        <Tooltip title="완료">
          <IconButton
            color="primary"
            disabled={is_completed}
            aria-label="complete"
            onClick={() => {
              onListItemCompleteClick([id]);
            }}
          >
            <Icon>done</Icon>
          </IconButton>
        </Tooltip>
        <Tooltip title="수정">
          <IconButton
            color="primary"
            disabled={is_completed}
            aria-label="edit"
            onClick={() => {
              onListItemEditClick(id);
            }}
          >
            <Icon>edit</Icon>
          </IconButton>
        </Tooltip>
        <Tooltip title="삭제">
          <IconButton
            disabled={is_completed}
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

export default OrderListItem;

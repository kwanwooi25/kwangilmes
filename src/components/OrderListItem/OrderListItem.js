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
import Hidden from '@material-ui/core/Hidden';
import AccountName from '../AccountName/AccountName';
import ProductName from '../ProductName/ProductName';
import ProductSize from '../ProductSize/ProductSize';
import './OrderListItem.css';

const OrderListItem = ({
  search,
  order,
  onListItemChecked,
  onListItemOrderClick,
  onListItemEditClick,
  onListItemDeleteClick
}) => {
  console.log(order);
  console.log(search);
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
    print_front_color,
    print_back_color_count,
    print_back_color,
    order_quantity,
    order_quantity_weight,
    completed_quantity,
  } = order;

  // 제품규격
  const productThick = highlight(product_thick, search.product_thick);
  const productLength = highlight(product_length, search.product_length);
  const productWidth = highlight(product_width, search.product_width);
  const productSize = `${productThick} x ${productLength} x ${productWidth}`;

  // 제품 정보 (무지/인쇄)
  let printInfo = '무지';
  if (is_print) {
    let printCount =
      Number(print_front_color_count) + Number(print_back_color_count);
    let printFront;
    let printBack;

    if (Number(print_back_color_count) > 0) {
      printFront = `전면: ${print_front_color}`;
      printBack = `후면: ${print_back_color}`;
      printInfo = `인쇄 ${printCount}도 (${printFront} / ${printBack})`;
    } else {
      printInfo = `인쇄 ${printCount}도 (${print_front_color})`;
    }
  }

  // 완성중량
  const completedQuantityWeight = getWeight(order, completed_quantity);

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
      <Grid container spacing={16}>
        {/*
          엄수/지급               발주일
          작업지시번호             납기일
          업체명
          품명
          규격                   전체수량 (중량)
          품목작업정보             완성수량 (중량)
        */}
        <Grid xs={6}>
          <Grid xs={12} className="order-list-item__delivery-remark-wrapper">
            {is_delivery_strict && (
              <span className="order-list-item__delivery-remark">
                납기엄수
              </span>
            )}
            {is_urgent && (
              <span className="order-list-item__delivery-remark">
                지급
              </span>
            )}
          </Grid>
          <Grid xs={12}>
            {/* MAKE ORDERID COMPONENT */}
            <span className="order-list-item__orderId">{id}</span>
          </Grid>
        </Grid>
        <Grid xs={6}>
          <Grid xs={12} className="order-list-item__dates-wrapper">
            <span className="order-list-item__dates">
              발주일: {moment(ordered_at).format('YYYY-MM-DD')}
            </span>
          </Grid>
          <Grid xs={12} className="order-list-item__dates-wrapper">
            <span className="order-list-item__dates">
              납기일: {moment(deliver_by).format('YYYY-MM-DD')}
            </span>
          </Grid>
        </Grid>
        <Grid xs={12}>
          <Grid xs={12} className="order-list-item__account-name-wrapper">
            <AccountName
              account={order}
              searchTerm={search.account_name}
              className="order-list-item__account-name"
            />
          </Grid>
          <Grid xs={12} className="order-list-item__product-name-wrapper">
            <ProductName
              product={order}
              searchTerm={search.product_name}
              className="order-list-item__product-name"
            />
          </Grid>
        </Grid>
        <Grid xs={6}>
          <Grid xs={12} className="order-list-item__product-size-wrapper">
            <span
              className="order-list-item__product-size"
              dangerouslySetInnerHTML={{ __html: productSize }}
            />
          </Grid>
          <Grid xs={12} className="order-list-item__print-info-wrapper">
            <span className="order-list-item__print-info">
              {printInfo}
            </span>
          </Grid>
        </Grid>
        <Grid xs={6}>
          <Grid xs={12} className="order-list-item__quantity-wrapper">
            <span className="order-list-item__quantity-title">
              주문수량:
            </span>
            <span className="order-list-item__quantity">
              {comma(order_quantity)}매
            </span>
            <span className="order-list-item__quantity-weight">
              ({Number(order_quantity_weight).toFixed(2)}kg)
            </span>
          </Grid>
          {completed_quantity && (
            <Grid xs={12} className="order-list-item__quantity-wrapper">
              <span className="order-list-item__quantity-title">
                완성수량:
              </span>
              <span className="order-list-item__quantity">
                {comma(completed_quantity)}매
              </span>
              <span className="order-list-item__quantity-weight">
                ({Number(completedQuantityWeight).toFixed(2)}kg)
              </span>
            </Grid>
          )}
        </Grid>
        <Grid item xs={12}>
          <div className="icon-button-group">
            <Tooltip title="출력">
              <IconButton
                color="primary"
                aria-label="print"
                onClick={() => {
                  console.log('print order:::', id)
                }}
              >
                <Icon>print</Icon>
              </IconButton>
            </Tooltip>
            <Tooltip title="완료">
              <IconButton
                color="primary"
                aria-label="complete"
                onClick={() => {
                  console.log('order complete:::', id)
                }}
              >
                <Icon>done</Icon>
              </IconButton>
            </Tooltip>
            <Tooltip title="수정">
              <IconButton
                color="primary"
                aria-label="edit"
                // onClick={() => {
                //   onListItemEditClick('edit', id);
                // }}
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
        </Grid>
      </Grid>
    </li>
  );
};

export default OrderListItem;

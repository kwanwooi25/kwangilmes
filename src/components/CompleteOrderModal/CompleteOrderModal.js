import React, { Component } from 'react';
import moment from 'moment';
import { comma, uncomma } from '../../helpers/comma';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import CustomModal from '../../components/CustomModal/CustomModal';
import CustomDatePicker from '../../components/CustomDatePicker/CustomDatePicker';
import './CompleteOrderModal.css';

// const FIELDS = [
//   { varName: 'account_name', displayName: '업체명' },
//   { varName: 'product_name', displayName: '품명' },
//   { varName: 'product_size', displayName: '규격' },
//   { varName: 'order_quantity', displayName: '주문수량(중량)' },
//   { varName: 'completed_quantity', displayName: '완료수량(중량)' },
//   { varName: 'is_completed', displayName: '작업완료' }
// ];

class CompleteOrderModal extends Component {
  state = {
    date: moment(),
    orders: this.props.orders
  };

  onClickOk = () => {
    const { orders } = this.state;

    if (this.validate()) {
      let data = [];

      orders.forEach(order => {
        data.push({
          id: order.id,
          completed_at: this.state.date.format('YYYY-MM-DD'),
          completed_quantity: Number(uncomma(order.completed_quantity)),
          is_completed: order.is_completed
        })
      });

      this.props.onClose(true, data);
    }
  };

  validate = (index, name) => {
    let { orders } = this.state;
    let isValid = true;

    // validate on click ok
    if (!name) {
      orders = orders.map(order => {
        if (!order.completed_quantity) {
          order.completed_quantity_error = '완성수량을 입력하세요.';
          isValid = isValid && false;
        } else {
          order.completed_quantity_error = '';
        }

        return order;
      });

      // validate on input change
    } else {
      if (name === 'completed_quantity' && orders[index][name] === '') {
        orders[index]['completed_quantity_error'] = '완성수량을 입력하세요.';
        isValid = isValid && false;
      } else if (name === 'completed_quantity' && orders[index][name] !== '') {
        orders[index]['completed_quantity_error'] = '';
      }
    }

    this.setState({ orders });
    return isValid;
  };

  onInputChange = (index, name) => event => {
    const { orders } = this.state;

    if (name === 'completed_quantity') {
      orders[index][name] = comma(event.target.value);
      const orderQuantity = Number(uncomma(orders[index]['order_quantity']));
      const completedQuantity = Number(uncomma(orders[index][name]));
      if (completedQuantity >= orderQuantity) {
        orders[index]['is_completed'] = true;
      } else {
        orders[index]['is_completed'] = false;
      }
    } else if (name === 'is_completed') {
      orders[index][name] = event.target.checked;
    }

    this.setState({ orders }, () => {
      this.validate(index, name);
    });
  };

  renderFields = () => {
    const { orders } = this.state;

    return orders.map((order, index) => {
      const {
        account_name,
        product_name,
        product_thick,
        product_length,
        product_width,
        order_quantity
      } = order;

      const productSize = `${product_thick} x ${product_length} x ${product_width}`;

      return (
        <Grid item xs={12} className="complete-order-modal__list-item">
          <Grid
            item
            xs={7}
            sm={6}
            className="complete-order-modal__product-details"
          >
            <Grid
              item
              xs={12}
            >
              <Grid item xs={12} className="complete-order-modal__account-name">
                {account_name}
              </Grid>
              <Grid item xs={12} className="complete-order-modal__product-name">
                {product_name}
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
            >
              <Grid item xs={12} className="complete-order-modal__product-size">
                {productSize}
              </Grid>
              <Grid item xs={12} className="complete-order-modal__order-quantity">
                주문수량: <span>{comma(order_quantity)}</span>매
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={5} sm={6} className="complete-order-modal__inputs">
            <Grid item xs={12} sm={6} className="complete-order-modal__quantity">
              <FormControl
                fullWidth
                error={
                  this.state.orders[index]['completed_quantity_error'] !==
                    undefined &&
                  this.state.orders[index]['completed_quantity_error'] !== ''
                }
              >
                <InputLabel htmlFor="completed_quantity">완성수량</InputLabel>
                <Input
                  id="completed_quantity"
                  value={this.state.orders[index]['completed_quantity']}
                  onChange={this.onInputChange(
                    index,
                    'completed_quantity'
                  ).bind(this)}
                  endAdornment={
                    <InputAdornment position="end">매</InputAdornment>
                  }
                />
                <FormHelperText id="completed_quantity">
                  {this.state.orders[index]['completed_quantity_error']}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} className="complete-order-modal__is_completed">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.orders[index]['is_completed']}
                    onChange={this.onInputChange(index, 'is_completed').bind(
                      this
                    )}
                    color="primary"
                  />
                }
                label="작업완료"
              />
            </Grid>
          </Grid>
        </Grid>
      );
    });
  };

  render() {
    const { open, onClose } = this.props;
    return (
      <CustomModal
        className="complete-order-modal"
        title="주문 완료 등록"
        open={open}
        onClose={() => {
          onClose(false);
        }}
        Buttons={
          <div>
            <Button
              variant="contained"
              onClick={() => {
                onClose(false);
              }}
            >
              취소
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={this.onClickOk.bind(this)}
            >
              확인
            </Button>
          </div>
        }
      >
        {this.renderFields()}
        <Grid item xs={12} className="complete-order-modal__datepicker">
          <CustomDatePicker
            value={this.state.date}
            onChange={date => {
              this.setState({ date });
            }}
          />
        </Grid>
      </CustomModal>
    );
  }
}

export default CompleteOrderModal;

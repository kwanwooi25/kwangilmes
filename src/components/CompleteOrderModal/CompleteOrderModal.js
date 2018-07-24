import React, { Component } from 'react';
import moment from 'moment';
import { comma, uncomma } from '../../helpers/comma';
import { getWeight } from '../../helpers/getWeight';
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import { highlight } from '../../helpers/highlight';
import CustomModal from '../../components/CustomModal/CustomModal';
import CustomDatePicker from '../../components/CustomDatePicker/CustomDatePicker';
import './CompleteOrderModal.css';

const FIELDS = [
  { varName: 'account_name', displayName: '업체명' },
  { varName: 'product_name', displayName: '품명' },
  { varName: 'product_size', displayName: '규격' },
  { varName: 'order_quantity', displayName: '주문수량(중량)' },
  { varName: 'completed_quantity', displayName: '완료수량(중량)' },
  { varName: 'is_completed', displayName: '작업완료' }
];

class CompleteOrderModal extends Component {
  state = {
    date: moment(),
    orders: this.props.orders
  };

  onClickOk = () => {
    const { orders } = this.state;

    orders.forEach(order => {
      order.completed_at = this.state.date;
    });

    // this.props.onClose(true, orders);
  }

  onInputChange = (index, name) => event => {
    const { orders } = this.state;

    if (name === 'completed_quantity') {
      orders[index][name] = comma(event.target.value);
      const orderQuantity = Number(uncomma(orders[index]['order_quantity']));
      const completedQuantity = Number(uncomma(orders[index][name]));
      if (completedQuantity >= orderQuantity) {
        orders[index]['is_completed'] = true;
      }
    } else if (name === 'is_completed') {
      orders[index][name] = event.target.checked;
    }
  }

  renderFields = () => {
    const { orders } = this.state;

    return orders.map((order, index) => {
      const {
        account_name,
        product_name,
        product_thick,
        product_length,
        product_width,
        order_quantity,
        completed_quantity,
        completed_quantity_error,
        is_completed
      } = order;

      const productSize = `${product_thick} x ${product_length} x ${product_width}`;

      return (
        <Grid item xs={12} className="complete-order-modal__list-item">
          <Grid
            item
            xs={7}
            className="complete-order-modal__list-item__product-details"
          >
            <Grid
              item
              xs={12}
              className="complete-order-modal__list-item__product-details__names"
            >
              <Grid item xs={12}>
                {account_name}
              </Grid>
              <Grid item xs={12}>
                {product_name}
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              className="complete-order-modal__list-item__product-details__size"
            >
              <Grid item xs={12}>
                {productSize}
              </Grid>
              <Grid item xs={12}>
                {`주문수량: ${comma(order_quantity)}`}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={5} className="complete-order-modal__list-item__inputs">
            <Grid item xs={12}>
              <FormControl
                fullWidth
                error={this.state.errors[index] !== undefined && this.state.errors[index] !== ''}
              >
                <InputLabel htmlFor="completed_quantity">완성수량</InputLabel>
                <Input
                  id="completed_quantity"
                  value={this.state.orders[index]['completed_quantity']}
                  onChange={this.onInputChange(index, 'completed_quantity').bind(this)}
                  endAdornment={
                    <InputAdornment position="end">매</InputAdornment>
                  }
                />
                <FormHelperText id="completed_quantity">
                  {this.state.errors[index]}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.orders[index]['is_completed']}
                    onChange={this.onInputChange(index, 'is_completed').bind(this)}
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
    const { open, onClose, orders } = this.props;
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
        <Grid item xs={12}>
          <CustomDatePicker
            value={this.state.date}
            onChange={date => { this.setState({ date })}}
          />
        </Grid>
      </CustomModal>
    );
  }
}

export default CompleteOrderModal;

import React, { Component } from 'react';
import moment from 'moment';
import { comma } from '../../helpers/comma';
import { getWeight } from '../../helpers/getWeight';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import CustomModal from '../../components/CustomModal/CustomModal';
import { highlight } from '../../helpers/highlight';
import './OrderId.css';

const FIELDS = [
  { varName: 'id', displayName: '작업지시번호' },
  { varName: 'ordered_at', displayName: '주문일' },
  { varName: 'completed_at', displayName: '완료일' },
  { varName: 'account_name', displayName: '업체명' },
  { varName: 'product_name', displayName: '품명' },
  { varName: 'product_size', displayName: '규격' },
  { varName: 'print_info', displayName: '작업내용' },
  { varName: 'order_quantity', displayName: '주문수량(중량)' },
  { varName: 'completed_quantity', displayName: '완료수량(중량)' },
  { varName: 'order_memo_work', displayName: '작업참고' },
  { varName: 'order_memo_delivery', displayName: '납품참고' }
];

class OrderId extends Component {
  state = {
    isDetailViewOpen: false
  };

  showDetailView = () => {
    this.setState({ isDetailViewOpen: true });
  };

  hideDetailView = () => {
    this.setState({ isDetailViewOpen: false });
  };

  renderFields = () => {
    const { order } = this.props;
    return FIELDS.map(({ varName, displayName }) => {
      let value;

      switch (varName) {
        case 'ordered_at':
        case 'completed_at':
          if (order[varName])
            value = moment(order[varName]).format('YYYY-MM-DD');
          else value = '';
          break;

        case 'product_size':
          const { product_thick, product_length, product_width } = order;
          value = `${product_thick} x ${product_length} x ${product_width}`;
          break;

        case 'print_info':
          const {
            ext_color,
            is_print,
            print_front_color_count,
            print_back_color_count
          } = order;
          value = `${ext_color}원단`;
          if (is_print) {
            const colorCount =
              Number(print_front_color_count) + Number(print_back_color_count);
            value += ` / 인쇄 ${colorCount}도`;
          } else {
            value += ' / 무지';
          }
          break;

        case 'order_quantity':
        case 'completed_quantity':
          const { order_quantity, completed_quantity } = order;
          if (order[varName]) {
            const quantity = comma(order[varName]);
            const weight = comma(getWeight(order, order[varName]));
            value = `${quantity}매 (${weight}kg)`;
          } else {
            value = '';
          }
          break;

        default:
          value = order[varName];
      }

      return (
        <div key={displayName} className="detail-view__row">
          <span className="detail-view__name">{displayName}</span>
          <span className="detail-view__value">{value}</span>
        </div>
      );
    });
  };

  render() {
    const { order, className } = this.props;
    let modalClassName = "detail-view order-detail-view";
    if (order.is_completed) modalClassName += ' completed';

    return (
      <div>
        <a
          className={`order_id ${className}`}
          onClick={this.showDetailView.bind(this)}
        >
          {order.id}
        </a>
        {this.state.isDetailViewOpen && (
          <CustomModal
            className={modalClassName}
            title="주문 상세 정보"
            open={this.state.isDetailViewOpen}
            onClose={this.hideDetailView.bind(this)}
            Buttons={
              <Button
                variant="contained"
                color="primary"
                onClick={this.hideDetailView.bind(this)}
              >
                확인
              </Button>
            }
          >
            {order.is_completed && (
              <div className="detail-view__badges">
                <span className="detail-view__badges-badge">완료</span>
              </div>
            )}
            {this.renderFields()}
          </CustomModal>
        )}
      </div>
    );
  }
}

export default OrderId;

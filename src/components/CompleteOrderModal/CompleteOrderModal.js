import React, { Component } from 'react';
import moment from 'moment';
import { comma } from '../../helpers/comma';
import { getWeight } from '../../helpers/getWeight';
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import { highlight } from '../../helpers/highlight';
import CustomModal from '../../components/CustomModal/CustomModal';
import './CompleteOrderModal.css';

// const FIELDS = [
//   { varName: 'id', displayName: '작업지시번호' },
//   { varName: 'ordered_at', displayName: '주문일' },
//   { varName: 'completed_at', displayName: '완료일' },
//   { varName: 'account_name', displayName: '업체명' },
//   { varName: 'product_name', displayName: '품명' },
//   { varName: 'product_size', displayName: '규격' },
//   { varName: 'print_info', displayName: '작업내용' },
//   { varName: 'order_quantity', displayName: '주문수량(중량)' },
//   { varName: 'completed_quantity', displayName: '완료수량(중량)' },
//   { varName: 'order_memo_work', displayName: '작업참고' },
//   { varName: 'order_memo_delivery', displayName: '납품참고' }
// ];

const renderFields = orders => {
  return orders.map(order => {
    return <h1>{order.id}</h1>
  })
}

const CompleteOrderModal = ({ open, onClose, orders }) => {
  return (
    <CustomModal
      className="complete-order-modal"
      title="주문 완료 등록"
      open={open}
      onClose={() => { onClose(false) }}
      Buttons={
        <Button
          variant="contained"
          onClick={() => { onClose(false) }}
        >
          취소
        </Button>,
        <Button
          variant="contained"
          color="primary"
          onClick={() => { onClose(true) }}
        >
          확인
        </Button>
      }
    >
      {renderFields(orders)}
    </CustomModal>

  );
}

export default CompleteOrderModal;

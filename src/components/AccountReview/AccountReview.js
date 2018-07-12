import React from 'react';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import FullScreenDialog from '../../components/FullScreenDialog/FullScreenDialog';

// import './AccountReview.css';

const BASIC_INFO = [
  { varName: 'account_name', displayName: '업체명' },
  { varName: 'reg_no', displayName: '사업자등록번호' },
  { varName: 'phone', displayName: '전화번호' },
  { varName: 'fax', displayName: '팩스번호' },
  { varName: 'email', displayName: '이메일' },
  { varName: 'email_tax', displayName: '세금계산서용 이메일' },
  { varName: 'address', displayName: '주소' },
  { varName: 'account_memo', displayName: '메모' }
];

const EXTRA_INFO = [
  { varName: 'ceo_name', displayName: '대표자명' },
  { varName: 'ceo_phone', displayName: '대표자 전화' },
  { varName: 'ceo_email', displayName: '대표자 이메일' },
  { varName: 'manager_name', displayName: '담당자명' },
  { varName: 'manager_phone', displayName: '담당자 전화' },
  { varName: 'manager_email', displayName: '담당자 이메일' }
];

const AccountReview = ({ data, open, onClose, title }) => {
  return (
    <FullScreenDialog
      open={open}
      onClose={() => {
        onClose(false);
      }}
      closeIcon="navigate_before"
      title={title}
      Buttons={
        <Button
          color="inherit"
          onClick={() => {
            onClose(true);
          }}
        >
          <Icon>check</Icon>
          <span> 완료</span>
        </Button>
      }
    >
      <form className="full-screen-form">
        <Typography variant="title">기본정보</Typography>
        {BASIC_INFO.map(({ varName, displayName }) => {
          if (data[varName]) {
            return (
              <div key={varName} className="account-review__row">
                <span>{displayName}</span>
                <span>{data[varName]}</span>
              </div>
            );
          }
        })}
        <Typography variant="title">추가정보</Typography>
        {EXTRA_INFO.map(({ varName, displayName }) => {
          if (data[varName]) {
            return (
              <div key={varName} className="account-review__row">
                <span>{displayName}</span>
                <span>{data[varName]}</span>
              </div>
            );
          }
        })}
      </form>
    </FullScreenDialog>
  );
};

export default AccountReview;

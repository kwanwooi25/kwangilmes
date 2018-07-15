import React from 'react';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import FullScreenDialog from '../../components/FullScreenDialog/FullScreenDialog';
import './AccountReview.css';

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

const renderFields = (elements, data) =>
  elements.map(({ varName, displayName }) => {
    if (data[varName]) {
      return (
        <div key={displayName} className="account-review__row">
          <span className="account-review__name">{displayName}</span>
          <span className="account-review__value">{data[varName]}</span>
        </div>
      );
    } else return undefined;
  });

const AccountReview = ({ data, open, onClose, title }) => {
  const extraInfoCount = EXTRA_INFO.map(({ varName }) => {
    return !!data[varName];
  }).filter(value => value === true).length;

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
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <p className="account-review__message">
              입력하신 정보를 확인하세요.
            </p>
          </Grid>
          <Grid item xs={12} md={6}>
            <h2 className="account-review__title">기본정보</h2>
            {renderFields(BASIC_INFO, data)}
          </Grid>
          {extraInfoCount > 0 && (
            <Grid item xs={12} md={6}>
              <h2 className="account-review__title">추가정보</h2>
              {renderFields(EXTRA_INFO, data)}
            </Grid>
          )}
        </Grid>
      </form>
    </FullScreenDialog>
  );
};

export default AccountReview;

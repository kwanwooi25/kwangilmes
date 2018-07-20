import React, { Component } from 'react';
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { highlight } from '../../helpers/highlight';
import './PlateSize.css';

// const BASIC_INFO = [
//   { varName: 'account_name', displayName: '업체명' },
//   { varName: 'reg_no', displayName: '사업자등록번호' },
//   { varName: 'phone', displayName: '전화번호' },
//   { varName: 'fax', displayName: '팩스번호' },
//   { varName: 'email', displayName: '이메일' },
//   { varName: 'email_tax', displayName: '세금계산서용 이메일' },
//   { varName: 'address', displayName: '주소' },
//   { varName: 'account_memo', displayName: '메모' }
// ];
//
// const EXTRA_INFO = [
//   { varName: 'ceo_name', displayName: '대표자명' },
//   { varName: 'ceo_phone', displayName: '대표자 전화' },
//   { varName: 'ceo_email', displayName: '대표자 이메일' },
//   { varName: 'manager_name', displayName: '담당자명' },
//   { varName: 'manager_phone', displayName: '담당자 전화' },
//   { varName: 'manager_email', displayName: '담당자 이메일' }
// ];

class PlateSize extends Component {
  state = {
    isDetailViewOpen: false
  };

  showDetailView = () => {
    this.setState({ isDetailViewOpen: true });
  };

  hideDetailView = () => {
    this.setState({ isDetailViewOpen: false });
  };

  // renderFields = (elements, data) =>
  //   elements.map(({ varName, displayName }) => {
  //     if (data[varName]) {
  //       return (
  //         <Grid
  //           item
  //           key={displayName}
  //           xs={12}
  //           className="account-detail-view__row"
  //         >
  //           <span className="account-detail-view__name">{displayName}</span>
  //           <span className="account-detail-view__value">{data[varName]}</span>
  //         </Grid>
  //       );
  //     } else return undefined;
  //   });

  render() {
    const { plate, search, className } = this.props;

    const plateRound = highlight(plate.plate_round, search.plate_round);
    const plateLength = highlight(plate.plate_length, search.plate_length);
    const plateSize = `${plateRound} x ${plateLength}`;

    return (
      <div>
        <a
          className={`plate-size ${className}`}
          onClick={this.showDetailView.bind(this)}
          dangerouslySetInnerHTML={{ __html: plateSize }}
        />
        {/* {this.state.isDetailViewOpen && (
          <Modal
            className="modal-bg"
            aria-labelledby="account-detail-view"
            open={this.state.isDetailViewOpen}
            onClose={this.hideDetailView.bind(this)}
          >
            <div className="account-detail-view">
          <Grid container>
          <Grid item xs={12} className="account-detail-view__title">
          <h1>업체 상세 정보</h1>
          </Grid>
          <Grid item xs={12}>
          <h2 className="account-detail-view__subtitle">기본정보</h2>
          {this.renderFields(BASIC_INFO, account)}
          </Grid>
          {extraInfoCount > 0 && (
          <Grid item xs={12}>
          <h2 className="account-detail-view__subtitle">추가정보</h2>
          {this.renderFields(EXTRA_INFO, account)}
          </Grid>
          )}
          <Grid
          item
          xs={12}
          className="account-detail-view__button-group"
          >
          <Button
          variant="contained"
          color="primary"
          onClick={this.hideDetailView.bind(this)}
          >
          확인
          </Button>
          </Grid>
          </Grid>
            </div>
          </Modal>
        )} */}
      </div>
    );
  }
}

export default PlateSize;

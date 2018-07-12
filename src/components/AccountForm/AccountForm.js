import React, { Component } from 'react';
import MaskedInput from 'react-text-mask';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FullScreenDialog from '../../components/FullScreenDialog/FullScreenDialog';
import AccountReview from '../../components/AccountReview/AccountReview';

import {
  formatPhoneNumber,
  informatPhoneNumber
} from '../../helpers/formatPhoneNumber';
import { validateEmail } from '../../helpers/validateEmail';
import './AccountForm.css';

const RegNoMask = props => {
  const { inputRef, ...other } = props;
  return (
    <MaskedInput
      {...other}
      ref={inputRef}
      mask={[
        /\d/,
        /\d/,
        /\d/,
        '-',
        /\d/,
        /\d/,
        '-',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/
      ]}
      guide={false}
      showMask
    />
  );
};
const EMAIL_INPUTS = ['email', 'email_tax', 'ceo_email', 'manager_email'];

class AccountForm extends Component {
  state = {
    isReviewOpen: false,

    // inputs
    account_name: '',
    reg_no: '',
    phone: '',
    fax: '',
    email: '',
    email_tax: '',
    address: '',
    account_memo: '',
    ceo_name: '',
    ceo_phone: '',
    ceo_email: '',
    manager_name: '',
    manager_phone: '',
    manager_email: '',

    // validation errors
    account_name_error: '',
    email_error: '',
    email_tax_error: '',
    ceo_email_error: '',
    manager_email_error: ''
  };

  onClickOk = () => {
    if (this.validate()) {
      this.setState({
        isReviewOpen: true,
        account_name_error: '',
        email_error: '',
        email_tax_error: '',
        ceo_email_error: '',
        manager_email_error: ''
      });
    }
  };

  validate = () => {
    let isValid = true;

    // check required field
    if (this.state.account_name === '') {
      this.setState({ account_name_error: '업체명을 입력하세요.' });
      isValid = isValid && false;
    }

    // check email
    EMAIL_INPUTS.forEach(name => {
      if (name !== '' && validateEmail(this.state[name]) === false) {
        this.setState({
          [`${name}_error`]: '올바른 이메일 형식으로 입력해주세요.'
        });
        isValid = isValid && false;
      }
    });

    return isValid;
  };

  onInputChange = name => event => {
    let value;

    switch (name) {
      case 'phone':
      case 'fax':
      case 'ceo_phone':
      case 'manager_phone':
        value = formatPhoneNumber(
          informatPhoneNumber(event.target.value).replace(/\D/g, '')
        );
        break;
      default:
        value = event.target.value;
    }

    this.setState({ [name]: value });
  };

  onReviewClose = result => {
    this.setState({ isReviewOpen: false });
    if (result) {
      const data = {
        account_name: this.state.account_name,
        reg_no: this.state.reg_no,
        phone: this.state.phone,
        fax: this.state.fax,
        email: this.state.email,
        email_tax: this.state.email_tax,
        address: this.state.address,
        account_memo: this.state.account_memo,
        ceo_name: this.state.ceo_name,
        ceo_phone: this.state.ceo_phone,
        ceo_email: this.state.ceo_email,
        manager_name: this.state.manager_name,
        manager_phone: this.state.manager_phone,
        manager_email: this.state.manager_email,
      };

      this.props.onClose(true, data);
    }
  }

  render() {
    const { open, onClose, title } = this.props;
    return (
      <FullScreenDialog
        open={open}
        onClose={onClose}
        title={title}
        Buttons={
          <Button color="inherit" onClick={this.onClickOk.bind(this)}>
            <Icon>check</Icon><span> 저장</span>
          </Button>
        }
      >
        <form className="full-screen-form">
          <ExpansionPanel defaultExpanded>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="title">기본정보</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div className="form-content">
                <div className="form-content__row">
                  <FormControl
                    fullWidth
                    error={this.state.account_name_error !== ''}
                  >
                    <InputLabel htmlFor="account_name">업체명</InputLabel>
                    <Input
                      id="account_name"
                      value={this.state.account_name}
                      onChange={this.onInputChange('account_name')}
                    />
                    <FormHelperText id="account_name">
                      {this.state.account_name_error}
                    </FormHelperText>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="reg_no">사업자등록번호</InputLabel>
                    <Input
                      id="reg_no"
                      value={this.state.reg_no}
                      onChange={this.onInputChange('reg_no')}
                      inputComponent={RegNoMask}
                    />
                  </FormControl>
                </div>
                <div className="form-content__row">
                  <TextField
                    id="phone"
                    label="전화번호"
                    value={this.state.phone}
                    onChange={this.onInputChange('phone')}
                    margin="normal"
                    fullWidth
                  />
                  <TextField
                    id="fax"
                    label="팩스번호"
                    value={this.state.fax}
                    onChange={this.onInputChange('fax')}
                    margin="normal"
                    fullWidth
                  />
                </div>
                <div className="form-content__row">
                  <FormControl fullWidth error={this.state.email_error !== ''}>
                    <InputLabel htmlFor="email">이메일</InputLabel>
                    <Input
                      id="email"
                      value={this.state.email}
                      onChange={this.onInputChange('email')}
                    />
                    <FormHelperText id="email">
                      {this.state.email_error}
                    </FormHelperText>
                  </FormControl>
                  <FormControl
                    fullWidth
                    error={this.state.email_tax_error !== ''}
                  >
                    <InputLabel htmlFor="email_tax">
                      세금계산서용 이메일
                    </InputLabel>
                    <Input
                      id="email_tax"
                      value={this.state.email_tax}
                      onChange={this.onInputChange('email_tax')}
                    />
                    <FormHelperText id="email_tax">
                      {this.state.email_tax_error}
                    </FormHelperText>
                  </FormControl>
                </div>
                <div className="form-content__row">
                  <TextField
                    id="address"
                    label="주소"
                    value={this.state.address}
                    onChange={this.onInputChange('address')}
                    margin="normal"
                    fullWidth
                    multiline
                  />
                </div>
                <div className="form-content__row">
                  <TextField
                    id="account_memo"
                    label="메모"
                    value={this.state.account_memo}
                    onChange={this.onInputChange('account_memo')}
                    margin="normal"
                    fullWidth
                    multiline
                  />
                </div>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="title">추가정보</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div className="form-content">
                <div className="form-content__row">
                  <TextField
                    id="ceo_name"
                    label="대표자명"
                    value={this.state.ceo_name}
                    onChange={this.onInputChange('ceo_name')}
                    margin="normal"
                    fullWidth
                  />
                </div>
                <div className="form-content__row">
                  <TextField
                    id="ceo_phone"
                    label="대표자 전화"
                    value={this.state.ceo_phone}
                    onChange={this.onInputChange('ceo_phone')}
                    margin="normal"
                    fullWidth
                  />
                  <FormControl
                    fullWidth
                    error={this.state.ceo_email_error !== ''}
                  >
                    <InputLabel htmlFor="ceo_email">대표자 이메일</InputLabel>
                    <Input
                      id="ceo_email"
                      value={this.state.ceo_email}
                      onChange={this.onInputChange('ceo_email')}
                    />
                    <FormHelperText id="ceo_email">
                      {this.state.ceo_email_error}
                    </FormHelperText>
                  </FormControl>
                </div>
                <div className="form-content__row">
                  <TextField
                    id="manager_name"
                    label="담당자명"
                    value={this.state.manager_name}
                    onChange={this.onInputChange('manager_name')}
                    fullWidth
                  />
                </div>
                <div className="form-content__row">
                  <TextField
                    id="manager_phone"
                    label="담당자 전화"
                    value={this.state.manager_phone}
                    onChange={this.onInputChange('manager_phone')}
                    fullWidth
                  />
                  <FormControl
                    fullWidth
                    error={this.state.manager_email_error !== ''}
                  >
                    <InputLabel htmlFor="manager_email">이메일</InputLabel>
                    <Input
                      id="manager_email"
                      value={this.state.manager_email}
                      onChange={this.onInputChange('manager_email')}
                    />
                    <FormHelperText id="manager_email">
                      {this.state.manager_email_error}
                    </FormHelperText>
                  </FormControl>
                </div>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </form>
        <AccountReview
          data={this.state}
          open={this.state.isReviewOpen}
          onClose={this.onReviewClose.bind(this)}
          title={`${title} 확인`}
        />
      </FullScreenDialog>
    );
  }
}

export default AccountForm;

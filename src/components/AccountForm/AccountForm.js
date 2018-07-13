import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  formatPhoneNumber,
  informatPhoneNumber
} from '../../helpers/formatPhoneNumber';
import { validateEmail } from '../../helpers/validateEmail';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FullScreenDialog from '../../components/FullScreenDialog/FullScreenDialog';
import AccountReview from '../../components/AccountReview/AccountReview';
import './AccountForm.css';

const BASIC_INFO = [
  { varName: 'account_name', displayName: '업체명', sm: 6, md: 4 },
  { varName: 'reg_no', displayName: '사업자등록번호', sm: 6, md: 4 },
  { varName: 'phone', displayName: '전화번호', sm: 6, md: 4 },
  { varName: 'fax', displayName: '팩스번호', sm: 6, md: 4 },
  { varName: 'email', displayName: '이메일', sm: 6, md: 4 },
  {
    varName: 'email_tax',
    displayName: '세금계산서용 이메일',
    sm: 6,
    md: 4
  },
  { varName: 'address', displayName: '주소', md: 4 },
  { varName: 'account_memo', displayName: '메모', md: 8, multiline: true }
];

const EXTRA_INFO = [
  { varName: 'ceo_name', displayName: '대표자명', md: 4 },
  { varName: 'ceo_phone', displayName: '대표자 전화', sm: 6, md: 4 },
  { varName: 'ceo_email', displayName: '대표자 이메일', sm: 6, md: 4 },
  { varName: 'manager_name', displayName: '담당자명', md: 4 },
  { varName: 'manager_phone', displayName: '담당자 전화', sm: 6, md: 4 },
  { varName: 'manager_email', displayName: '담당자 이메일', sm: 6, md: 4 }
];
const EMAIL_INPUTS = ['email', 'email_tax', 'ceo_email', 'manager_email'];
const INITIAL_STATE = {
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

class AccountForm extends Component {
  state = INITIAL_STATE;

  componentDidMount() {
    const { accountId, accounts } = this.props;
    if (accountId !== '') {
      const account = accounts.current.find(({ id }) => id === accountId);
      Object.keys(account).forEach(key => {
        if (account[key] === null) delete account[key];
      });
      this.setState(Object.assign({}, INITIAL_STATE, account));
    }
  }

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
        manager_email: this.state.manager_email
      };

      this.setState(INITIAL_STATE);
      this.props.onClose(true, data, this.state.id);
    }
  };

  renderFields = elements => {
    return elements.map(({ varName, displayName, sm, md, multiline }) => {
      const error = this.state[`${varName}_error`];
      return (
        <Grid item xs={12} sm={sm} md={md} key={varName}>
          <FormControl fullWidth error={error !== undefined && error !== ''}>
            <InputLabel htmlFor={varName}>{displayName}</InputLabel>
            <Input
              id={varName}
              value={this.state[varName]}
              onChange={this.onInputChange(varName)}
              multiline={multiline}
            />
            <FormHelperText id={varName}>{error}</FormHelperText>
          </FormControl>
        </Grid>
      );
    });
  };

  render() {
    const { open, onClose, title } = this.props;

    return (
      <FullScreenDialog
        open={open}
        onClose={onClose}
        title={title}
        Buttons={
          <Button color="inherit" onClick={this.onClickOk.bind(this)}>
            <Icon>check</Icon>
            <span> 저장</span>
          </Button>
        }
      >
        <form className="full-screen-form">
          <ExpansionPanel defaultExpanded>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="title">기본정보</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container spacing={24}>
                {this.renderFields(BASIC_INFO)}
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="title">추가정보</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container spacing={24}>
                {this.renderFields(EXTRA_INFO)}
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </form>
        {this.state.isReviewOpen && (
          <AccountReview
            data={this.state}
            open={this.state.isReviewOpen}
            onClose={this.onReviewClose.bind(this)}
            title={`${title} 확인`}
          />
        )}
      </FullScreenDialog>
    );
  }
}

const mapStateToProps = ({ accounts }) => {
  return { accounts };
};

export default connect(mapStateToProps)(AccountForm);

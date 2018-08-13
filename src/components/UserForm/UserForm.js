import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import CustomModal from '../CustomModal/CustomModal';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import {
  formatPhoneNumber,
  informatPhoneNumber
} from '../../helpers/formatPhoneNumber';
import './UserForm.css';

const FORM_FIELDS = [
  { varName: 'username', displayName: '아이디', sm: 6, md: 4 },
  { varName: 'password', displayName: '비밀번호', sm: 6, md: 4 },
  { varName: 'password_conf', displayName: '비밀번호확인', sm: 6, md: 4 },
  { varName: 'display_name', displayName: '이름', sm: 6, md: 4 },
  { varName: 'user_phone', displayName: '전화번호', sm: 6, md: 4 },
  { varName: 'user_department', displayName: '부서', sm: 6, md: 4 },
  { varName: 'user_position', displayName: '직책', sm: 6, md: 4 },
  { varName: 'permission_id', displayName: '사용자권한', sm: 6, md: 4 },
  { varName: 'user_memo', displayName: '메모', md: 8, multiline: true }
];

const REQUIRED_FIELDS = [
  { varName: 'username', error: '아이디를 입력하세요.' },
  { varName: 'password', error: '비밀번호를 입력하세요.' },
  { varName: 'password_conf', error: '비밀번호를 입력하세요.' },
  { varName: 'display_name', error: '이름을 입력하세요.' }
];

class UserForm extends Component {
  constructor() {
    super();

    this.state = {
      // states
      isConfirmModalOpen: false,
      confirmModalTitle: '',
      confirmModalSubtitle: '',
      confirmModalDescription: '',

      // fields
      username: '',
      password: '',
      password_conf: '',
      display_name: '',
      user_phone: '',
      user_department: '',
      user_position: '',
      permission_id: 3,
      user_memo: '',

      // error
      username_error: '',
      password_error: '',
      password_conf_error: '',
      display_name_error: ''
    };

    this.onConfirmModalClose = this.onConfirmModalClose.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onClickOk = this.onClickOk.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  onConfirmModalClose(result) {
    if (result) {
      const data = {
        username: this.state.username,
        password: this.state.password,
        display_name: this.state.display_name,
        user_phone: this.state.user_phone,
        user_department: this.state.user_department,
        user_position: this.state.user_position,
        permission_id: this.state.permission_id,
        user_memo: this.state.user_memo
      };

      this.props.onClose(true, data);
    }

    this.setState({
      isConfirmModalOpen: false,
      confirmModalTitle: '',
      confirmModalSubtitle: '',
      confirmModalDescription: ''
    });
  }

  onClickOk() {
    if (this.validate()) {
      const { display_name, username } = this.state;
      const confirmModalSubtitle = `${display_name} (${username})`;
      this.setState({
        isConfirmModalOpen: true,
        confirmModalTitle: '사용자 신규 등록',
        confirmModalSubtitle,
        confirmModalDescription: '사용자 신규 등록하시겠습니까?'
      });
    }
  }

  onCancel() {
    this.props.onClose(false);
  }

  validate = name => {
    let isValid = true;

    // check required field
    if (name) {
      REQUIRED_FIELDS.forEach(({ varName, error }) => {
        if (varName === name && this.state[varName] === '') {
          this.setState({ [`${varName}_error`]: error });
        } else if (
          varName === 'password_conf' &&
          this.state.password !== this.state.password_conf
        ) {
          this.setState({
            [`${varName}_error`]: '비밀번호가 일치하지 않습니다.'
          });
        } else if (varName === name && this.state[varName] !== '') {
          this.setState({ [`${varName}_error`]: '' });
        }
      });
    } else {
      REQUIRED_FIELDS.forEach(({ varName, error }) => {
        if (this.state[varName] === '') {
          this.setState({ [`${varName}_error`]: error });
          isValid = isValid && false;
        } else if (
          varName === 'password_conf' &&
          this.state.password !== this.state.password_conf
        ) {
          this.setState({
            [`${varName}_error`]: '비밀번호가 일치하지 않습니다.'
          });
          isValid = isValid && false;
        }
      });
    }

    return isValid;
  };

  onInputChange = name => event => {
    let value = '';

    switch (name) {
      case 'user_phone':
        value = formatPhoneNumber(
          informatPhoneNumber(event.target.value).replace(/\D/g, '')
        );
        break;
      default:
        value = event.target.value;
    }

    console.log(name, ':::', value);

    this.setState({ [name]: value }, () => {
      this.validate(name);
    });
  };

  renderFields(fields) {
    return fields.map(({ varName, displayName, sm, md, multiline }) => {
      const error = this.state[`${varName}_error`];

      return (
        <Grid item xs={12} sm={sm} md={md} key={varName}>
          <FormControl fullWidth error={error !== undefined && error !== ''}>
            <InputLabel htmlFor={varName}>{displayName}</InputLabel>
            {varName === 'permission_id' ? (
              <Select
                value={this.state[varName]}
                onChange={this.onInputChange(varName)}
                inputProps={{
                  name: varName,
                  id: varName
                }}
              >
                <MenuItem value={2}>관리자</MenuItem>
                <MenuItem value={3}>사용자</MenuItem>
              </Select>
            ) : (
              <Input
                id={varName}
                type={
                  varName === 'password' || varName === 'password_conf'
                    ? 'password'
                    : 'text'
                }
                value={this.state[varName]}
                onChange={this.onInputChange(varName)}
                multiline={multiline}
              />
            )}
            <FormHelperText id={varName}>{error}</FormHelperText>
          </FormControl>
        </Grid>
      );
    });
  }

  render() {
    const { open } = this.props;

    return (
      <CustomModal
        className="user-form"
        title="사용자 등록"
        open={open}
        onClose={this.onCancel}
        Buttons={
          <div>
            <Button variant="contained" color="default" onClick={this.onCancel}>
              <Icon>clear</Icon>
              취소
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={this.onClickOk}
            >
              저장
              <Icon>check</Icon>
            </Button>
          </div>
        }
      >
        <Grid container className="user-form__contents">
          {this.renderFields(FORM_FIELDS)}
        </Grid>
        {this.state.isConfirmModalOpen && (
          <ConfirmModal
            open={this.state.isConfirmModalOpen}
            title={this.state.confirmModalTitle}
            subtitle={this.state.confirmModalSubtitle}
            description={this.state.confirmModalDescription}
            onClose={this.onConfirmModalClose}
          />
        )}
      </CustomModal>
    );
  }
}

export default UserForm;

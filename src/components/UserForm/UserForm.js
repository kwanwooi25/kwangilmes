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
import { formatPhoneNumber, informatPhoneNumber } from '../../helpers/formatPhoneNumber';
import './UserForm.css';

const FORM_FIELDS = [
	{ varName: 'username', displayName: '아이디', disableOnEdit: true, disableOnChangePassword: true },
	{ varName: 'password', displayName: '비밀번호', hideOnEdit: true },
	{ varName: 'password_conf', displayName: '비밀번호확인', hideOnEdit: true },
	{ varName: 'display_name', displayName: '이름', hideOnChangePassword: true },
	{ varName: 'user_phone', displayName: '전화번호', hideOnChangePassword: true },
	{ varName: 'user_department', displayName: '부서', hideOnChangePassword: true },
	{ varName: 'user_position', displayName: '직책', hideOnChangePassword: true },
	{ varName: 'permission_id', displayName: '사용자권한', hideOnChangePassword: true },
	{ varName: 'user_memo', displayName: '메모', hideOnChangePassword: true, multiline: true }
];

const REQUIRED_FIELDS = [
	{ varName: 'username', error: '아이디를 입력하세요.' },
	{ varName: 'display_name', error: '이름을 입력하세요.' }
];

const PASSWORD_FIELDS = [
	{ varName: 'password', error: '비밀번호를 입력하세요.' },
	{ varName: 'password_conf', error: '비밀번호를 입력하세요.' }
];

class UserForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			// mode
			mode: props.mode,

			// states
			isConfirmModalOpen: false,
			confirmModalTitle: '',
			confirmModalSubtitle: '',
			confirmModalDescription: '',

			// fields
			username: props.user ? props.user.username : '',
			password: '',
			password_conf: '',
			display_name: props.user ? props.user.display_name : '',
			user_phone: props.user ? props.user.user_phone : '',
			user_department: props.user ? props.user.user_department : '',
			user_position: props.user ? props.user.user_position : '',
			permission_id: props.user ? props.user.permission_id : 3,
			user_memo: props.user ? props.user.user_memo : '',

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
			const { mode } = this.state;
			let data = {};

			switch (mode) {
				case 'new':
					data = {
						username: this.state.username,
						password: this.state.password,
						display_name: this.state.display_name,
						user_phone: this.state.user_phone,
						user_department: this.state.user_department,
						user_position: this.state.user_position,
						permission_id: this.state.permission_id,
						user_memo: this.state.user_memo
					};
					break;
				case 'edit':
					data = {
						username: this.state.username,
						display_name: this.state.display_name,
						user_phone: this.state.user_phone,
						user_department: this.state.user_department,
						user_position: this.state.user_position,
						permission_id: this.state.permission_id,
						user_memo: this.state.user_memo
					};
					break;
				case 'change_password':
					data = {
						username: this.state.username,
						password: this.state.password
					};
					break;
				default:
					break;
			}

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
			const { mode, display_name, username } = this.state;
			const confirmModalSubtitle = `${display_name} (${username})`;
			let confirmModalTitle = '';
			let confirmModalDescription = '';

			switch (mode) {
				case 'new':
					confirmModalTitle = '사용자 신규 등록';
					confirmModalDescription = '신규 등록 하시겠습니까?';
					break;
				case 'edit':
					confirmModalTitle = '사용자 정보 수정';
					confirmModalDescription = '정보 수정 하시겠습니까?';
					break;
				case 'change_password':
					confirmModalTitle = '비밀번호 변경';
					confirmModalDescription = '입력하신 비밀번호로 변경 하시겠습니까?';
					break;
				default:
					break;
			}

			this.setState({
				isConfirmModalOpen: true,
				confirmModalTitle,
				confirmModalSubtitle,
				confirmModalDescription
			});
		}
	}

	onCancel() {
		this.props.onClose(false);
	}

	validate = (name) => {
		const { mode } = this.state;
		let isValid = true;

		// check required fields on input change
		if (name) {
			REQUIRED_FIELDS.forEach(({ varName, error }) => {
				if (varName === name && this.state[varName] === '') {
					this.setState({ [`${varName}_error`]: error });
				} else if (varName === name && this.state[varName] !== '') {
					this.setState({ [`${varName}_error`]: '' });
				}
			});

			PASSWORD_FIELDS.forEach(({ varName, error }) => {
				if (varName === name && this.state[varName] === '') {
					this.setState({ [`${varName}_error`]: error });
				} else if (varName === 'password_conf' && this.state.password !== this.state.password_conf) {
					this.setState({
						[`${varName}_error`]: '비밀번호가 일치하지 않습니다.'
					});
				} else if (varName === name && this.state[varName] !== '') {
					this.setState({ [`${varName}_error`]: '' });
				}
			});

			// check required fields on click save
		} else {
			if (mode === 'new' || mode === 'edit') {
				REQUIRED_FIELDS.forEach(({ varName, error }) => {
					if (this.state[varName] === '') {
						this.setState({ [`${varName}_error`]: error });
						isValid = isValid && false;
					}
				});
			}

			if (mode === 'new' || mode === 'change_password') {
				PASSWORD_FIELDS.forEach(({ varName, error }) => {
					if (this.state[varName] === '') {
						this.setState({ [`${varName}_error`]: error });
						isValid = isValid && false;
					} else if (varName === 'password_conf' && this.state.password !== this.state.password_conf) {
						this.setState({
							[`${varName}_error`]: '비밀번호가 일치하지 않습니다.'
						});
						isValid = isValid && false;
					}
				});
			}
		}

		return isValid;
	};

	onInputChange = (name) => (event) => {
		let value = '';

		switch (name) {
			case 'user_phone':
				value = formatPhoneNumber(informatPhoneNumber(event.target.value).replace(/\D/g, ''));
				break;
			default:
				value = event.target.value;
		}

		this.setState({ [name]: value }, () => {
			this.validate(name);
		});
	};

	renderFields(fields) {
		return fields.map(
			({
				varName,
				displayName,
				disableOnEdit,
				disableOnChangePassword,
				hideOnEdit,
				hideOnChangePassword,
				multiline
			}) => {
				const error = this.state[`${varName}_error`];
				const disableInput =
					(this.props.mode === 'edit' && disableOnEdit) ||
					(this.props.mode === 'change_password' && disableOnChangePassword);
				const hideInput =
					(this.props.mode === 'edit' && hideOnEdit) ||
					(this.props.mode === 'change_password' && hideOnChangePassword);

				return (
					<Grid item xs={12} key={varName} style={{ display: hideInput && 'none' }}>
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
									type={varName === 'password' || varName === 'password_conf' ? 'password' : 'text'}
									value={this.state[varName]}
									onChange={this.onInputChange(varName)}
									disabled={disableInput}
									multiline={multiline}
								/>
							)}
							<FormHelperText id={varName}>{error}</FormHelperText>
						</FormControl>
					</Grid>
				);
			}
		);
	}

	render() {
		const { open, title } = this.props;

		return (
			<CustomModal
				className="user-form"
				title={title}
				open={open}
				onClose={this.onCancel}
				Buttons={
					<div>
						<Button variant="contained" color="default" onClick={this.onCancel}>
							<Icon>clear</Icon>
							취소
						</Button>
						<Button variant="contained" color="primary" onClick={this.onClickOk}>
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

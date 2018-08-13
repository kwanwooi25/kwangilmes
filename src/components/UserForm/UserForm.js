import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import CustomModal from '../CustomModal/CustomModal';
import { formatPhoneNumber, informatPhoneNumber } from '../../helpers/formatPhoneNumber';

// table.integer('permission_id').defaultTo(3);
//             table
//               .string('username')
//               .unique()
//               .notNullable();
//             table.string('display_name').notNullable();
//             table.string('user_phone');
//             table.string('user_department');
//             table.string('user_position');
//             table.string('user_memo');

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

class UserForm extends Component {
	constructor() {
		super();

		this.state = {
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
	}

	onClickOk() {
		console.log('ok');
		this.props.onClose(true);
	}

	onCancel() {
		console.log('cancel');
		this.props.onClose(false);
	}

	onInputChange = (name) => (event) => {
		let value = '';

		switch (name) {
			case 'user_phone':
				value = formatPhoneNumber(informatPhoneNumber(event.target.value).replace(/\D/g, ''));
				break;
			default:
				value = event.target.value;
		}

		this.setState({ [name]: value });
	};

	renderFields(fields) {
		return fields.map(({ varName, displayName, sm, md, multiline }) => {
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
	}

	render() {
		const { open } = this.props;

		return (
			<CustomModal
				className="user-form"
				title="사용자 등록"
				open={open}
				onClose={this.onCancel.bind(this)}
				Buttons={
					<div>
						<Button variant="contained" color="default" onClick={this.onCancel.bind(this)}>
							<Icon>clear</Icon>
							취소
						</Button>
						<Button variant="contained" color="primary" onClick={this.onClickOk.bind(this)}>
							확인
							<Icon>check</Icon>
						</Button>
					</div>
				}
			>
				<Grid container className="user-form__contents">
					{this.renderFields(FORM_FIELDS)}
				</Grid>
			</CustomModal>
		);
	}
}

export default UserForm;

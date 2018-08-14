import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchUsers, registerUser, updateUser, changeUserPassword, deleteUser } from '../../actions';
import Divider from '@material-ui/core/Divider';
import PageHeader from '../../components/PageHeader/PageHeader';
import ListBody from '../../components/ListBody/ListBody';
import FabAdd from '../../components/FabAdd/FabAdd';
import UserListItem from '../../components/UserListItem/UserListItem';
import UserForm from '../../components/UserForm/UserForm';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import './UsersPage.css';

class UsersPage extends Component {
	constructor() {
		super();

		this.state = {
			// user delete
			isConfirmModalOpen: false,
			confirmModalTitle: '',
			confirmModalSubtitle: '',
			confirmModalDescription: '',
			userToDelete: '',

			// user add, update, change password
			isUserFormOpen: false,
			userFormMode: '',
			userFormTitle: '',
			userToEdit: {}
		};

		this.showConfirmDeleteModal = this.showConfirmDeleteModal.bind(this);
		this.onConfirmModalClose = this.onConfirmModalClose.bind(this);
		this.showUserForm = this.showUserForm.bind(this);
		this.onUserFormClose = this.onUserFormClose.bind(this);
	}

	componentDidMount() {
		const token = this.props.auth.userToken;
		this.props.fetchUsers(token);
	}

	showConfirmDeleteModal(username) {
		this.setState({
			isConfirmModalOpen: true,
			confirmModalTitle: '사용자 삭제',
			confirmModalSubtitle: username,
			confirmModalDescription: `사용자를 정말로 삭제 하시겠습니까?`,
			userToDelete: username
		});
	}

	onConfirmModalClose(result) {
		if (result) {
			const token = this.props.auth.userToken;
			const username = this.state.userToDelete;
			this.props.deleteUser(token, username);
		}

		this.setState({
			isConfirmModalOpen: false,
			confirmModalTitle: '',
			confirmModalSubtitle: '',
			confirmModalDescription: '',
			userToDelete: ''
		});
	}

	showUserForm(mode, username) {
		const { all } = this.props.users;
		const userToEdit = all.find((user) => user.username === username);
		const userFormTitle =
			mode === 'new' ? '사용자 등록' : mode === 'edit' ? '사용자 정보 수정' : mode === 'change_password' && '비밀번호 변경';

		this.setState({
			isUserFormOpen: true,
			userFormMode: mode,
			userFormTitle,
			userToEdit
		});
	}

	onUserFormClose(result, data) {
		if (result) {
			const mode = this.state.userFormMode;
			const token = this.props.auth.userToken;

			switch (mode) {
				case 'new':
					this.props.registerUser(token, data);
					break;
				case 'edit':
					this.props.updateUser(token, data);
					break;
				case 'change_password':
					this.props.changeUserPassword(token, data);
					break;
				default:
					break;
			}
		}

		this.setState({
			isUserFormOpen: false,
			userFormMode: '',
			userFormTitle: '',
			userToEdit: {}
		});
	}

	render() {
		const { isPending, count, all } = this.props.users;
		const { current_user } = this.props.auth;
		return (
			<main>
				<PageHeader title="사용자관리" />
				<Divider />
				<ListBody isPending={isPending} hasData={count !== 0}>
					{all.map((user) => (
						<UserListItem
							key={user.id}
							user={user}
							current_user={current_user}
							onListItemPasswordChangeClick={this.showUserForm}
							onListItemEditClick={this.showUserForm}
							onListItemDeleteClick={this.showConfirmDeleteModal}
						/>
					))}
				</ListBody>
				<FabAdd
					title="사용자 추가"
					onClick={() => {
						this.showUserForm('new');
					}}
				/>
				{this.state.isConfirmModalOpen && (
					<ConfirmModal
						open={this.state.isConfirmModalOpen}
						title={this.state.confirmModalTitle}
						subtitle={this.state.confirmModalSubtitle}
						description={this.state.confirmModalDescription}
						onClose={this.onConfirmModalClose}
					/>
				)}
				{this.state.isUserFormOpen && (
					<UserForm
						open={this.state.isUserFormOpen}
						title={this.state.userFormTitle}
						onClose={this.onUserFormClose}
						user={this.state.userToEdit}
						mode={this.state.userFormMode}
					/>
				)}
			</main>
		);
	}
}

const mapStateToProps = ({ auth, users }) => {
	return { auth, users };
};

export default connect(mapStateToProps, {
	fetchUsers,
	registerUser,
	updateUser,
	changeUserPassword,
	deleteUser
})(UsersPage);

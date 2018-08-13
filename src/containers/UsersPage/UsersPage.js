import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchUsers } from '../../actions';
import Divider from '@material-ui/core/Divider';
import PageHeader from '../../components/PageHeader/PageHeader';
import ListBody from '../../components/ListBody/ListBody';
import FabAdd from '../../components/FabAdd/FabAdd';
import UserListItem from '../../components/UserListItem/UserListItem';
import UserForm from '../../components/UserForm/UserForm';
import './UsersPage.css';

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

// const CSV_HEADERS = [
//   { key: 'id', name: 'ID' },
//   { key: 'account_name', name: '업체명' },
//   { key: 'phone', name: '전화' },
//   { key: 'fax', name: '팩스' },
//   { key: 'email', name: '이메일' },
//   { key: 'email_tax', name: '이메일(세금계산서)' },
//   { key: 'address', name: '주소' },
//   { key: 'reg_no', name: '사업자등록번호' },
//   { key: 'ceo_name', name: '대표자명' },
//   { key: 'ceo_phone', name: '대표자전화' },
//   { key: 'ceo_email', name: '대표자이메일' },
//   { key: 'manager_name', name: '담당자명' },
//   { key: 'manager_phone', name: '담당자전화' },
//   { key: 'manager_email', name: '담당자이메일' },
//   { key: 'account_memo', name: '메모' }
// ];

class UsersPage extends Component {
	constructor() {
		super();

		this.state = {
			// isConfirmModalOpen: false,
			// selectedAccounts: [],
			// confirmModalTitle: '',
			// confirmModalDescription: '',
			isUserFormOpen: false,
			userFormTitle: '',
			userToEdit: '',
			isAddMultiModalOpen: false
		};

		// this.showConfirmDeleteModal = this.showConfirmDeleteModal.bind(this);
		// this.onConfirmModalClose = this.onConfirmModalClose.bind(this);
		this.showUserForm = this.showUserForm.bind(this);
		this.onUserFormClose = this.onUserFormClose.bind(this);
	}

	componentDidMount() {
		const token = this.props.auth.userToken;
		this.props.fetchUsers(token);
	}

	// showConfirmDeleteModal(ids) {
	//   this.setState({
	//     isConfirmModalOpen: true,
	//     selectedAccounts: ids,
	//     confirmModalTitle: '업체 삭제',
	//     confirmModalDescription: `총 ${
	//       ids.length
	//     }개 업체를 정말로 삭제 하시겠습니까?`
	//   });
	// }

	// onConfirmModalClose(result) {
	//   if (result) {
	//     const { search } = this.props.accounts;
	//     const token = this.props.auth.userToken;
	//     const ids = this.state.selectedAccounts;
	//     this.props.deleteAccounts(token, ids, search);
	//   }

	//   this.setState({
	//     isConfirmModalOpen: false,
	//     selectedAccounts: [],
	//     confirmModalTitle: '',
	//     confirmModalDescription: ''
	//   });
	// }

	showUserForm(mode, userToEdit) {
		if (mode === 'new') {
			this.setState({
				isUserFormOpen: true,
				userFormTitle: '사용자 등록'
			});
		} else if (mode === 'edit') {
			this.setState({
				isUserFormOpen: true,
				userFormTitle: '사용자 정보 수정',
				userToEdit
			});
		}
	}

	onUserFormClose(result, data, id) {
		this.setState({
			isUserFormOpen: false,
			userFormTitle: '',
			userToEdit: ''
		});

		console.log(result, data, id);

		// if (result && id === undefined) {
		//   const { search } = this.props.accounts;
		//   const token = this.props.auth.userToken;
		//   this.props.addAccounts(token, [data], search);
		// } else if (result && id !== undefined) {
		//   const { search } = this.props.accounts;
		//   const token = this.props.auth.userToken;
		//   this.props.updateAccount(token, id, data, search);
		// }
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
							onListItemPasswordChangeClick={() => {}}
							onListItemEditClick={() => {}}
							onListItemDeleteClick={() => {}}
						/>
					))}
				</ListBody>
				<FabAdd
					title="사용자 추가"
					onClick={() => {
						this.showUserForm('new');
					}}
				/>
				{/* {this.state.isConfirmModalOpen && (
          <ConfirmModal
            open={this.state.isConfirmModalOpen}
            title={this.state.confirmModalTitle}
            description={this.state.confirmModalDescription}
            onClose={this.onConfirmModalClose}
          />
        )} */}
				{this.state.isUserFormOpen && (
					<UserForm
						open={this.state.isUserFormOpen}
						title={this.state.userFormTitle}
						onClose={this.onUserFormClose}
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
	fetchUsers
})(UsersPage);

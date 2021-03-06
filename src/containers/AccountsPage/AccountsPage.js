import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	fetchAccounts,
	toggleAccountChecked,
	toggleAccountsChecked,
	addAccounts,
	updateAccount,
	deleteAccounts
} from '../../actions';
import Divider from '@material-ui/core/Divider';
import PageHeader from '../../components/PageHeader/PageHeader';
import ListHeader from '../../components/ListHeader/ListHeader';
import ListBody from '../../components/ListBody/ListBody';
import AccountListItem from '../../components/AccountListItem/AccountListItem';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import AccountForm from '../../components/AccountForm/AccountForm';
import AddMultiModal from '../../components/AddMultiModal/AddMultiModal';
import FabAdd from '../../components/FabAdd/FabAdd';
import { exportCSV } from '../../helpers/exportCSV';
import { calculateOffset } from '../../helpers/calculateOffset';
import AccountsTemplate from '../../assets/accounts_template.xlsx';
import './AccountsPage.css';

const CSV_HEADERS = [
	{ key: 'id', name: 'ID' },
	{ key: 'account_name', name: '업체명' },
	{ key: 'phone', name: '전화' },
	{ key: 'fax', name: '팩스' },
	{ key: 'email', name: '이메일' },
	{ key: 'email_tax', name: '이메일(세금계산서)' },
	{ key: 'address', name: '주소' },
	{ key: 'reg_no', name: '사업자등록번호' },
	{ key: 'ceo_name', name: '대표자명' },
	{ key: 'ceo_phone', name: '대표자전화' },
	{ key: 'ceo_email', name: '대표자이메일' },
	{ key: 'manager_name', name: '담당자명' },
	{ key: 'manager_phone', name: '담당자전화' },
	{ key: 'manager_email', name: '담당자이메일' },
	{ key: 'account_memo', name: '메모' }
];

class AccountsPage extends Component {
	constructor() {
		super();

		this.state = {
			isConfirmModalOpen: false,
			selectedAccounts: [],
			confirmModalTitle: '',
			confirmModalDescription: '',
			isAccountFormOpen: false,
			accountFormTitle: '',
			accountToEdit: '',
			isAddMultiModalOpen: false
		};

		this.onSearchChange = this.onSearchChange.bind(this);
		this.onRowsPerPageChange = this.onRowsPerPageChange.bind(this);
		this.onPageChange = this.onPageChange.bind(this);
		this.onListItemChecked = this.onListItemChecked.bind(this);
		this.onSelectAllChange = this.onSelectAllChange.bind(this);
		this.onDeleteAllClick = this.onDeleteAllClick.bind(this);
		this.onCancelSelection = this.onCancelSelection.bind(this);
		this.showConfirmDeleteModal = this.showConfirmDeleteModal.bind(this);
		this.onConfirmModalClose = this.onConfirmModalClose.bind(this);
		this.showAccountForm = this.showAccountForm.bind(this);
		this.onAccountFormClose = this.onAccountFormClose.bind(this);
		this.onExportExcelClick = this.onExportExcelClick.bind(this);
		this.showAddMultiModal = this.showAddMultiModal.bind(this);
		this.onAddMultiModalClose = this.onAddMultiModalClose.bind(this);
	}

	componentDidMount() {
		const { search } = this.props.accounts;
		const token = this.props.auth.userToken;
		this.props.fetchAccounts(token, search);
	}

	onSearchChange(text) {
		const { search } = this.props.accounts;
		const token = this.props.auth.userToken;
		search.account_name = text;
		search.offset = 0;
		this.props.fetchAccounts(token, search);
	}

	onRowsPerPageChange(limit) {
		const { search } = this.props.accounts;
		const token = this.props.auth.userToken;
		search.limit = Number(limit);
		search.offset = 0;
		this.props.fetchAccounts(token, search);
	}

	onPageChange(change) {
		const { count, search } = this.props.accounts;
		const token = this.props.auth.userToken;

		search.offset = calculateOffset(change, search.offset, search.limit, count);

		this.props.fetchAccounts(token, search);
	}

	onListItemChecked(id) {
		this.props.toggleAccountChecked(id);
	}

	onSelectAllChange(checked) {
		this.props.toggleAccountsChecked(checked);
	}

	onDeleteAllClick() {
		const { selected } = this.props.accounts;
		this.showConfirmDeleteModal(selected);
	}

	onCancelSelection() {
		this.props.toggleAccountsChecked(false);
	}

	showConfirmDeleteModal(ids) {
		this.setState({
			isConfirmModalOpen: true,
			selectedAccounts: ids,
			confirmModalTitle: '업체 삭제',
			confirmModalDescription: `총 ${ids.length}개 업체를 정말로 삭제 하시겠습니까?`
		});
	}

	onConfirmModalClose(result) {
		if (result) {
			const { search } = this.props.accounts;
			const token = this.props.auth.userToken;
			const ids = this.state.selectedAccounts;
			this.props.deleteAccounts(token, ids, search);
		}

		this.setState({
			isConfirmModalOpen: false,
			selectedAccounts: [],
			confirmModalTitle: '',
			confirmModalDescription: ''
		});
	}

	showAccountForm(mode, accountToEdit) {
		if (mode === 'new') {
			this.setState({
				isAccountFormOpen: true,
				accountFormTitle: '업체등록'
			});
		} else if (mode === 'edit') {
			this.setState({
				isAccountFormOpen: true,
				accountFormTitle: '업체수정',
				accountToEdit
			});
		}
	}

	onAccountFormClose(result, data, id) {
		this.setState({
			isAccountFormOpen: false,
			accountFormTitle: '',
			accountToEdit: ''
		});

		if (result && id === undefined) {
			const { search } = this.props.accounts;
			const token = this.props.auth.userToken;
			this.props.addAccounts(token, [ data ], search);
		} else if (result && id !== undefined) {
			const { search } = this.props.accounts;
			const token = this.props.auth.userToken;
			this.props.updateAccount(token, id, data, search);
		}
	}

	showAddMultiModal = () => {
		this.setState({ isAddMultiModalOpen: true });
	};

	onAddMultiModalClose = (result, rows) => {
		this.setState({ isAddMultiModalOpen: false });

		if (result) {
			// header row
			const header = rows[0].map((column) => CSV_HEADERS.find(({ name }) => name === column).key);

			// body rows
			rows.shift();

			// generate json array
			const accounts = rows.map((row) => {
				const json = `{ ${row
					.map((column, index) => {
						const value = column !== null ? column : '';
						return `"${header[index]}": "${value}"`;
					})
					.join(',')} }`;

				return JSON.parse(json);
			});

			// add accounts
			const { search } = this.props.accounts;
			const token = this.props.auth.userToken;
			this.props.addAccounts(token, accounts, search);
		}
	};

	onExportExcelClick = () => {
		const { search } = this.props.accounts;
		const token = this.props.auth.userToken;

		exportCSV('광일_거래처목록.csv', CSV_HEADERS, 'accounts', search, token);
	};

	render() {
		const hasWritePermission = this.props.auth.current_user.can_write_accounts;
		const { isPending, count, current, search, selected } = this.props.accounts;
		const isFirstPage = search.offset === 0;
		const isLastPage = count <= search.offset + search.limit;
		const isSelectedAll = selected.length !== 0 && selected.length === count;
		return (
			<main>
				<PageHeader
					title="업체관리"
					searchBox
					searchValue={search.account_name}
					onSearchChange={this.onSearchChange}
					uploadButton={hasWritePermission}
					onUploadButtonClick={this.showAddMultiModal}
					exportButton={true}
					onExportButtonClick={this.onExportExcelClick}
				/>
				<Divider />
				<ListHeader
					hasWritePermission={hasWritePermission}
					rowsPerPage={search.limit}
					isFirstPage={isFirstPage}
					isLastPage={isLastPage}
					onRowsPerPageChange={this.onRowsPerPageChange}
					onPageChange={this.onPageChange}
					onDeleteAllClick={this.onDeleteAllClick}
					onSelectAllChange={this.onSelectAllChange}
					selectedCount={selected.length}
					isSelectedAll={isSelectedAll}
					onCancelSelection={this.onCancelSelection}
					totalCount={count}
					offset={search.offset}
				/>
				<ListBody isPending={isPending} hasData={current.length !== 0}>
					{current.map((account) => (
						<AccountListItem
							key={account.id}
							searchTerm={search.account_name}
							account={account}
							hasWritePermission={hasWritePermission}
							onListItemChecked={this.onListItemChecked}
							onListItemEditClick={this.showAccountForm}
							onListItemDeleteClick={this.showConfirmDeleteModal}
						/>
					))}
				</ListBody>
				{hasWritePermission && (
					<FabAdd
						title="업체 추가"
						onClick={() => {
							this.showAccountForm('new');
						}}
					/>
				)}
				{this.state.isConfirmModalOpen && (
					<ConfirmModal
						open={this.state.isConfirmModalOpen}
						title={this.state.confirmModalTitle}
						description={this.state.confirmModalDescription}
						onClose={this.onConfirmModalClose}
					/>
				)}
				{this.state.isAccountFormOpen && (
					<AccountForm
						accountId={this.state.accountToEdit}
						open={this.state.isAccountFormOpen}
						title={this.state.accountFormTitle}
						onClose={this.onAccountFormClose}
					/>
				)}
				{this.state.isAddMultiModalOpen && (
					<AddMultiModal
						open={this.state.isAddMultiModalOpen}
						template={AccountsTemplate}
						onClose={this.onAddMultiModalClose}
					/>
				)}
			</main>
		);
	}
}

const mapStateToProps = ({ auth, accounts }) => {
	return { auth, accounts };
};

export default connect(mapStateToProps, {
	fetchAccounts,
	updateAccount,
	toggleAccountChecked,
	toggleAccountsChecked,
	addAccounts,
	deleteAccounts
})(AccountsPage);

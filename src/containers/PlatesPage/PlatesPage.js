import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	fetchPlates,
	deletePlates,
	addPlates,
	updatePlate,
	togglePlatesChecked,
	togglePlateChecked
} from '../../actions';
import Divider from '@material-ui/core/Divider';
import PageHeader from '../../components/PageHeader/PageHeader';
import PlateSearch from '../../components/PlateSearch/PlateSearch';
import ListHeader from '../../components/ListHeader/ListHeader';
import ListBody from '../../components/ListBody/ListBody';
import NoData from '../../components/NoData/NoData';
import PlateListItem from '../../components/PlateListItem/PlateListItem';
import PlateForm from '../../components/PlateForm/PlateForm';
import AddMultiModal from '../../components/AddMultiModal/AddMultiModal';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import Spinner from '../../components/Spinner/Spinner';
import FabAdd from '../../components/FabAdd/FabAdd';
import { exportCSV } from '../../helpers/exportCSV';
import { calculateOffset } from '../../helpers/calculateOffset';
import { convertExcelToJSON } from '../../helpers/convertExcelToJSON';
import PlatesTemplate from '../../assets/plates_template.xlsx';
import './PlatesPage.css';

const CSV_HEADERS = [
	{ key: 'id', name: 'ID' },
	{ key: 'plate_round', name: '둘레' },
	{ key: 'plate_length', name: '기장' },
	{ key: 'plate_material', name: '재질' },
	{ key: 'storage_location', name: '보관위치' },
	{ key: 'product_1_account_name', name: '품목1업체명' },
	{ key: 'product_1_name', name: '품목1품목명' },
	{ key: 'product_1_thick', name: '품목1두께' },
	{ key: 'product_1_length', name: '품목1길이' },
	{ key: 'product_1_width', name: '품목1너비' },
	{ key: 'product_2_account_name', name: '품목2업체명' },
	{ key: 'product_2_name', name: '품목2품목명' },
	{ key: 'product_2_thick', name: '품목2두께' },
	{ key: 'product_2_length', name: '품목2길이' },
	{ key: 'product_2_width', name: '품목2너비' },
	{ key: 'product_3_account_name', name: '품목3업체명' },
	{ key: 'product_3_name', name: '품목3품목명' },
	{ key: 'product_3_thick', name: '품목3두께' },
	{ key: 'product_3_length', name: '품목3길이' },
	{ key: 'product_3_width', name: '품목3너비' },
	{ key: 'memo', name: '메모' }
];

class PlatesPage extends Component {
	constructor() {
		super();

		this.state = {
			isConfirmModalOpen: false,
			selectedPlates: [],
			confirmModalTitle: '',
			confirmModalDescription: '',
			isPlateFormOpen: false,
			plateFormTitle: '',
			plateToEdit: '',
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
		this.showPlateForm = this.showPlateForm.bind(this);
		this.onPlateFormClose = this.onPlateFormClose.bind(this);
		this.onExportExcelClick = this.onExportExcelClick.bind(this);
	}

	componentDidMount() {
		const { search } = this.props.plates;
		const token = this.props.auth.userToken;
		this.props.fetchPlates(token, search);
	}

	onSearchChange = (name, event) => {
		const { search } = this.props.plates;
		const token = this.props.auth.userToken;
		search[name] = event.target.value.toLowerCase();
		search.offset = 0;
		this.props.fetchPlates(token, search);
	};

	onSearchReset = () => {
		const token = this.props.auth.userToken;
		const search = {
			product_name: '',
			plate_round: '',
			plate_length: '',
			plate_material: '',
			limit: 10,
			offset: 0
		};
		this.props.fetchPlates(token, search);
	};

	onRowsPerPageChange = (limit) => {
		const { search } = this.props.plates;
		const token = this.props.auth.userToken;
		search.limit = Number(limit);
		search.offset = 0;
		this.props.fetchPlates(token, search);
	};

	onPageChange = (change) => {
		const { count, search } = this.props.plates;
		const token = this.props.auth.userToken;

		search.offset = calculateOffset(change, search.offset, search.limit, count);

		this.props.fetchPlates(token, search);
	};

	onDeleteAllClick = () => {
		const { selected } = this.props.plates;
		this.showConfirmDeleteModal(selected);
	};

	onSelectAllChange = (checked) => {
		this.props.togglePlatesChecked(checked);
	};

	onCancelSelection = () => {
		this.props.togglePlatesChecked(false);
	};

	onListItemChecked = (id) => {
		this.props.togglePlateChecked(id);
	};

	showConfirmDeleteModal = (ids) => {
		this.setState({
			isConfirmModalOpen: true,
			selectedPlates: ids,
			confirmModalTitle: '동판 삭제',
			confirmModalDescription: `총 ${ids.length}개 동판을 정말로 삭제 하시겠습니까?`
		});
	};

	onConfirmModalClose = (result) => {
		this.setState({
			isConfirmModalOpen: false,
			selectedPlates: [],
			confirmModalTitle: '',
			confirmModalDescription: ''
		});

		if (result) {
			const { search } = this.props.plates;
			const token = this.props.auth.userToken;
			const ids = this.state.selectedPlates;
			this.props.deletePlates(token, ids, search);
		}
	};

	showPlateForm = (mode, plateToEdit) => {
		if (mode === 'new') {
			this.setState({
				isPlateFormOpen: true,
				plateFormTitle: '동판등록'
			});
		} else if (mode === 'edit') {
			this.setState({
				isPlateFormOpen: true,
				plateFormTitle: '동판수정',
				plateToEdit
			});
		}
	};

	onPlateFormClose = (result, data, id) => {
		this.setState({
			isPlateFormOpen: false,
			plateFormTitle: '',
			plateToEdit: ''
		});

		if (result && id === undefined) {
			const { search } = this.props.plates;
			const token = this.props.auth.userToken;
			this.props.addPlates(token, [ data ], search);
		} else if (result && id !== undefined) {
			const { search } = this.props.plates;
			const token = this.props.auth.userToken;
			this.props.updatePlate(token, id, data, search);
		}
	};

	showAddMultiModal = () => {
		this.setState({ isAddMultiModalOpen: true });
	};

	onAddMultiModalClose = (result, rows) => {
		this.setState({ isAddMultiModalOpen: false });

		if (result) {
			const plates = convertExcelToJSON(rows, CSV_HEADERS);

			// add plates
			const { search } = this.props.plates;
			const token = this.props.auth.userToken;
			this.props.addPlates(token, plates, search);
		}
	};

	onExportExcelClick = () => {
		const { search } = this.props.plates;
		const token = this.props.auth.userToken;

		exportCSV('광일_동판목록.csv', CSV_HEADERS, 'plates', search, token);
	};

	render() {
		const { isPending, count, current, search, selected } = this.props.plates;
		const isFirstPage = search.offset === 0;
		const isLastPage = count <= search.offset + search.limit;
		const isSelectedAll = selected.length !== 0 && selected.length === count;
		return (
			<main>
				<PageHeader
					title="동판관리"
					uploadButton={true}
					onUploadButtonClick={this.showAddMultiModal}
					exportButton={true}
					onExportButtonClick={this.onExportExcelClick}
				/>
				<Divider />
				<PlateSearch onInputChange={this.onSearchChange} onReset={this.onSearchReset} searchValues={search} />
				<ListHeader
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
				{isPending ? (
					<Spinner />
				) : current.length === 0 ? (
					<NoData />
				) : (
					<ListBody>
						{current.map((plate) => (
							<PlateListItem
								key={plate.id}
								search={search}
								plate={plate}
								onListItemChecked={this.onListItemChecked}
								onListItemEditClick={this.showPlateForm}
								onListItemDeleteClick={this.showConfirmDeleteModal}
							/>
						))}
					</ListBody>
				)}
				<FabAdd
					title="동판 추가"
					onClick={() => {
						this.showPlateForm('new');
					}}
				/>
				{this.state.isConfirmModalOpen && (
					<ConfirmModal
						open={this.state.isConfirmModalOpen}
						title={this.state.confirmModalTitle}
						description={this.state.confirmModalDescription}
						onClose={this.onConfirmModalClose}
					/>
				)}
				{this.state.isPlateFormOpen && (
					<PlateForm
						plateId={this.state.plateToEdit}
						open={this.state.isPlateFormOpen}
						title={this.state.plateFormTitle}
						onClose={this.onPlateFormClose}
					/>
				)}
				{this.state.isAddMultiModalOpen && (
					<AddMultiModal
						open={this.state.isAddMultiModalOpen}
						template={PlatesTemplate}
						onClose={this.onAddMultiModalClose}
					/>
				)}
			</main>
		);
	}
}

const mapStateToProps = ({ auth, plates }) => {
	return { auth, plates };
};

export default connect(mapStateToProps, {
	fetchPlates,
	deletePlates,
	addPlates,
	updatePlate,
	togglePlatesChecked,
	togglePlateChecked
})(PlatesPage);

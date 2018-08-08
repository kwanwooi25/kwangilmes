import React, { Component } from 'react';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Checkbox from '@material-ui/core/Checkbox';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputAdornment from '@material-ui/core/InputAdornment';
import FullScreenDialog from '../../components/FullScreenDialog/FullScreenDialog';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import CustomDatePicker from '../../components/CustomDatePicker/CustomDatePicker';
import { PRODUCT_DETAIL_SECTIONS } from '../../helpers/constants';
import { comma, uncomma } from '../../helpers/comma';
import { getWeight } from '../../helpers/getWeight';
import { avoidWeekends } from '../../helpers/avoidWeekends';
import './ProductOrderForm.css';

const INITIAL_STATE = {
	isProductDetailOpen: false,
	isConfirmModalOpen: false,

	product_id: '',
	ordered_at: moment(),
	deliver_by: moment().add(7, 'days'),
	order_quantity: '',
	order_quantity_weight: '',
	plate_status: '확인',
	is_delivery_strict: false,
	is_urgent: false,
	order_memo_work: '',
	order_memo_delivery: '',

	order_quantity_error: '',
	orderDetail: ''
};

class ProductOrderForm extends Component {
	constructor(props) {
		super(props);

		this.state = INITIAL_STATE;

		this.onClickOk = this.onClickOk.bind(this);
		this.onConfirmModalClose = this.onConfirmModalClose.bind(this);
	}

	componentDidMount() {
		let data;

		if (this.props.product) {
			data = this.props.product;
			data.product_id = data.id;
			data.deliver_by = moment().add(7, 'days');
			if (data.is_print) data.deliver_by = moment().add(10, 'days');
		} else if (this.props.order) {
			data = this.props.order;
			data.order_id = data.id;
			data.order_quantity = comma(data.order_quantity);
		}

		data.deliver_by = avoidWeekends(data.deliver_by);
		delete data.id;

		this.setState(Object.assign({}, this.state, data));
	}

	onConfirmModalClose = (result) => {
		this.setState({ isConfirmModalOpen: false });

		if (result) {
			const data = {
				product_id: this.state.product_id,
				ordered_at: this.state.ordered_at.format('YYYY-MM-DD'),
				deliver_by: this.state.deliver_by.format('YYYY-MM-DD'),
				order_quantity: uncomma(this.state.order_quantity),
				plate_status: this.state.plate_status,
				is_delivery_strict: this.state.is_delivery_strict,
				is_urgent: this.state.is_urgent,
				order_memo_work: this.state.order_memo_work,
				order_memo_delivery: this.state.order_memo_delivery
			};

			if (this.state.order_id) data.id = this.state.order_id;

			this.props.onClose(true, data);
		}
	};

	onClickOk = () => {
		if (this.validate()) {
			const orderDetail = `
        ${this.state.order_quantity}매
        ${this.state.is_print && `(동판${this.state.plate_status})`}
        ${this.state.is_delivery_strict ? ' / 납기엄수' : ''}
        ${this.state.is_urgent ? ' / 지급' : ''}
        ${this.state.order_memo_work ? ` / ${this.state.order_memo_work}` : ''}
        ${this.state.order_memo_delivery ? ` / ${this.state.order_memo_delivery}` : ''}
      `;

			this.setState({ isConfirmModalOpen: true, orderDetail });
		}
	};

	validate = () => {
		let isValid = true;

		if (this.state.order_quantity === '') {
			isValid = false;
			this.setState({ order_quantity_error: '주문수량을 입력하세요.' });
		} else if (isNaN(uncomma(this.state.order_quantity))) {
			isValid = false;
			this.setState({ order_quantity_error: '숫자로 입력해야 합니다.' });
		} else {
			this.setState({ order_quantity_error: '' });
		}

		return isValid;
	};

	renderProductFields = (fields) => {
		const data = this.state;
		return fields.map(({ varName, displayName }) => {
			let value;

			switch (varName) {
				case 'product_size':
					value = `${data.product_thick} x ${data.product_length} x ${data.product_width}`;
					break;
				case 'is_print':
					value = data.is_print === 'is_print_true' ? '인쇄' : '무지';
					break;
				case 'ext_pretreat':
					value = data.ext_pretreat === 'single' ? '단면' : data.ext_pretreat === 'double' ? '양면' : '';
					break;
				case 'print_image_preview':
					value = data.print_image_url;
					break;
				case 'ext_antistatic':
				case 'cut_ultrasonic':
				case 'cut_powder_pack':
				case 'cut_is_punched':
				case 'pack_deliver_all':
					value = data[varName] ? 'Y' : 'N';
					break;
				default:
					value = data[varName];
			}

			if (value) {
				if (varName === 'print_image_preview') {
					return (
						<div key={displayName} className="product-order-form__row">
							<span className="product-order-form__name">{displayName}</span>
							<span className="product-order-form__value">
								<Button
									fullWidth
									variant="contained"
									onClick={(event) => {
										this.setState({ anchorEl: event.target });
									}}
								>
									도안보기
								</Button>
								<Popover
									className="product-order-form__image-container"
									open={Boolean(this.state.anchorEl)}
									anchorEl={this.state.anchorEl}
									onClose={() => {
										this.setState({ anchorEl: null });
									}}
									anchorOrigin={{
										vertical: 'top',
										horizontal: 'center'
									}}
									transformOrigin={{
										vertical: 'bottom',
										horizontal: 'center'
									}}
								>
									<img
										className="product-order-form__image"
										src={value}
										alt={displayName}
										onClick={() => {
											this.setState({ anchorEl: null });
										}}
									/>
								</Popover>
							</span>
						</div>
					);
				}

				return (
					<div key={displayName} className="product-order-form__row">
						<span className="product-order-form__name">{displayName}</span>
						<span className="product-order-form__value">{value}</span>
					</div>
				);
			} else return undefined;
		});
	};

	renderProductSection = () => {
		const data = this.state;
		return PRODUCT_DETAIL_SECTIONS.map(({ title, fields }) => {
			const hasInfo = fields.map(({ varName }) => !!data[varName]).filter((value) => value === true).length > 0;

			if (hasInfo) {
				return (
					<Grid item xs={12} md={6} key={title}>
						<h2 className="product-order-form__title">{title}</h2>
						{this.renderProductFields(fields)}
					</Grid>
				);
			} else return undefined;
		});
	};

	onInputChange = (name) => (event) => {
		let value;
		if (event.target.type === 'checkbox') {
			value = event.target.checked;
		} else {
			value = event.target.value;
		}

		if (name === 'order_quantity') {
			const weight = getWeight(this.state, uncomma(value));
			this.setState(
				{
					order_quantity: comma(value),
					order_quantity_weight: weight
				},
				() => {
					this.validate();
				}
			);
		} else {
			this.setState({ [name]: value });
		}
	};

	render() {
		const { open, onClose } = this.props;
		const { product_name, product_thick, product_length, product_width, is_print } = this.state;
		const productTitle = `${product_name} (${product_thick} x ${product_length} x ${product_width})`;

		return (
			<FullScreenDialog
				open={open}
				onClose={onClose}
				title={this.state.order_id ? '작업지시 수정' : '작업지시 작성'}
				Buttons={
					<Button color="inherit" onClick={this.onClickOk.bind(this)}>
						<Icon>check</Icon>
						<span> 저장</span>
					</Button>
				}
			>
				<form className="full-screen-form">
					<ExpansionPanel
						expanded={this.state.isProductDetailOpen}
						onChange={(event, expanded) => {
							this.setState({ isProductDetailOpen: expanded });
						}}
					>
						<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
							<Typography variant="title">
								{this.state.isProductDetailOpen ? '품목정보' : productTitle}
							</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>
							<Grid container spacing={24}>
								{this.renderProductSection()}
							</Grid>
						</ExpansionPanelDetails>
					</ExpansionPanel>
					<ExpansionPanel defaultExpanded>
						<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
							<Typography variant="title">주문정보</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>
							<Grid container spacing={16}>
								<Grid item xs={6} sm={3} lg={2}>
									<CustomDatePicker
										label="발주일"
										disableFuture={true}
										value={this.state.ordered_at}
										onChange={(date) => {
											this.setState({ ordered_at: date });
										}}
									/>
								</Grid>
								<Grid item xs={6} sm={3} lg={2}>
									<CustomDatePicker
										label="납기일"
										disablePast={true}
										value={this.state.deliver_by}
										onChange={(date) => {
											this.setState({ deliver_by: date });
										}}
									/>
								</Grid>
								<Grid item xs={7} sm={4} lg={2}>
									<FormControl fullWidth error={this.state.order_quantity_error !== ''}>
										<InputLabel htmlFor="order_quantity">주문수량</InputLabel>
										<Input
											id="order_quantity"
											value={this.state.order_quantity}
											onChange={this.onInputChange('order_quantity')}
											endAdornment={<InputAdornment position="end">매</InputAdornment>}
										/>
										<FormHelperText id="order_quantity">
											{this.state.order_quantity_error}
										</FormHelperText>
									</FormControl>
								</Grid>
								<Grid item xs={5} sm={2} lg={2}>
									<FormControl fullWidth>
										<InputLabel htmlFor="order_quantity_weight">중량</InputLabel>
										<Input
											id="order_quantity_weight"
											disabled
											value={this.state.order_quantity_weight}
											onChange={this.onInputChange('order_quantity_weight')}
											startAdornment={<InputAdornment position="start">{'('}</InputAdornment>}
											endAdornment={<InputAdornment position="end">kg)</InputAdornment>}
										/>
									</FormControl>
								</Grid>
								<Grid item xs={6} sm={3} lg={2}>
									<FormControlLabel
										control={
											<Checkbox
												checked={this.state.is_delivery_strict}
												onChange={this.onInputChange('is_delivery_strict')}
												color="primary"
											/>
										}
										label="납기엄수"
									/>
								</Grid>
								<Grid item xs={6} sm={3} lg={2}>
									<FormControlLabel
										control={
											<Checkbox
												checked={this.state.is_urgent}
												onChange={this.onInputChange('is_urgent')}
												color="primary"
											/>
										}
										label="지급"
									/>
								</Grid>
								<Grid item xs={12} sm={6} lg={4}>
									<FormControl fullWidth component="fieldset">
										<RadioGroup
											aria-label="plate_status"
											name="plate_status"
											className="product-order-form__plate_status"
											value={this.state.plate_status}
											onChange={this.onInputChange('plate_status')}
										>
											<FormControlLabel
												value="확인"
												control={<Radio color="primary" />}
												disabled={is_print === false}
												label="동판확인"
											/>
											<FormControlLabel
												value="신규"
												control={<Radio color="primary" />}
												disabled={is_print === false}
												label="동판신규"
											/>
											<FormControlLabel
												value="수정"
												control={<Radio color="primary" />}
												disabled={is_print === false}
												label="동판수정"
											/>
										</RadioGroup>
									</FormControl>
								</Grid>
								<Grid item xs={12} sm={6} lg={4}>
									<FormControl fullWidth>
										<InputLabel htmlFor="order_memo_work">작업참고</InputLabel>
										<Input
											id="order_memo_work"
											value={this.state.order_memo_work}
											onChange={this.onInputChange('order_memo_work')}
											multiline
										/>
									</FormControl>
								</Grid>
								<Grid item xs={12} sm={6} lg={4}>
									<FormControl fullWidth>
										<InputLabel htmlFor="order_memo_delivery">납품참고</InputLabel>
										<Input
											id="order_memo_delivery"
											value={this.state.order_memo_delivery}
											onChange={this.onInputChange('order_memo_delivery')}
											multiline
										/>
									</FormControl>
								</Grid>
							</Grid>
						</ExpansionPanelDetails>
					</ExpansionPanel>
				</form>
				{this.state.isConfirmModalOpen && (
					<ConfirmModal
						open={this.state.isConfirmModalOpen}
						title={this.state.order_id ? '작업지시 수정하시겠습니까?' : '작업지시 하시겠습니까?'}
						subtitle={productTitle}
						description={this.state.orderDetail}
						onClose={this.onConfirmModalClose}
					/>
				)}
			</FullScreenDialog>
		);
	}
}

export default ProductOrderForm;

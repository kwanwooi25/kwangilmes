import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchDeliverySchedule, fetchOrdersNeedPlate, updatePlateStatus } from '../../actions';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DeliverySchedule from '../../components/DeliverySchedule/DeliverySchedule';
import OrdersNeedPlate from '../../components/OrdersNeedPlate/OrdersNeedPlate';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import './DashboardPage.css';

class DashboardPage extends Component {
	constructor() {
		super();

		this.state = {
			value: 0,
			isConfirmModalOpen: false,
			selectedOrderId: '',
			confirmModalSubtitle: ''
		};

		this.onTabChange = this.onTabChange.bind(this);
		this.onMonthChange = this.onMonthChange.bind(this);
		this.onPlateReadyClick = this.onPlateReadyClick.bind(this);
		this.onConfirmModalClose = this.onConfirmModalClose.bind(this);
	}

	componentDidMount() {
		const { search } = this.props.schedule;
		const token = this.props.auth.userToken;
		this.props.fetchDeliverySchedule(token, search);
		this.props.fetchOrdersNeedPlate(token);
	}

	onTabChange(event, value) {
		this.setState({ value });
	}

	onMonthChange(year, month) {
		const search = { year, month };
		const token = this.props.auth.userToken;
		this.props.fetchDeliverySchedule(token, search);
	}

	onPlateReadyClick(orderId) {
		const { needPlate } = this.props.orders;
		const selectedOrder = needPlate.filter((order) => order.id === orderId)[0];
		const { product_name, product_thick, product_length, product_width } = selectedOrder;

		this.setState({
			isConfirmModalOpen: true,
			selectedOrderId: orderId,
			confirmModalSubtitle: `${product_name} (${product_thick}x${product_length}x${product_width})`
		});
	}

	onConfirmModalClose(result) {
		if (result) {
			const { search } = this.props.orders;
			const token = this.props.auth.userToken;
			const data = { is_plate_ready: true };
			this.props.updatePlateStatus(token, this.state.selectedOrderId, data, search);
		}

		this.setState({
			isConfirmModalOpen: false,
			selectedOrderId: '',
			confirmModalSubtitle: ''
		});
	}

	render() {
		const { current, search } = this.props.schedule;
		const { needPlate } = this.props.orders;
		const { value, isConfirmModalOpen, confirmModalSubtitle } = this.state;
		const schedulePending = this.props.schedule.isPending;
		const ordersPending = this.props.orders.isPending;
		return (
			<main>
				<Tabs
					className="dashboard-tabs"
					value={value}
					indicatorColor="primary"
					textColor="primary"
					onChange={this.onTabChange}
				>
					<Tab className="dashboard-tab" label="납기현황" />
					<Tab className="dashboard-tab" label="동판필요품목" />
				</Tabs>
				{value === 0 && (
					<DeliverySchedule
						year={search.year}
						month={search.month}
						orders={current}
						isPending={schedulePending}
						onMonthChange={this.onMonthChange}
					/>
				)}
				{value === 1 && (
					<OrdersNeedPlate
						isPending={ordersPending}
						orders={needPlate}
						onPlateReadyClick={this.onPlateReadyClick}
					/>
				)}
				{isConfirmModalOpen && (
					<ConfirmModal
						open={isConfirmModalOpen}
						title="동판제작완료"
						subtitle={confirmModalSubtitle}
						description="동판 제작 완료 하시겠습니까?"
						onClose={this.onConfirmModalClose}
					/>
				)}
			</main>
		);
	}
}

const mapStateToProps = ({ auth, schedule, orders }) => {
	return { auth, schedule, orders };
};

export default connect(mapStateToProps, { fetchDeliverySchedule, fetchOrdersNeedPlate, updatePlateStatus })(
	DashboardPage
);

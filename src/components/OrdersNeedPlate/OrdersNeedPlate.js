import React from 'react';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import ListBody from '../../components/ListBody/ListBody';
import './OrdersNeedPlate.css';

const OrdersNeedPlate = ({ isPending, orders, onPlateReadyClick }) => {
	return (
		<ListBody className="orders-need-plate-list" isPending={isPending} hasData={orders.length !== 0}>
			{orders.map(
				({ id, account_name, product_name, product_thick, product_length, product_width, plate_status }) => {
					return (
						<li key={id} className="list-body__item">
							<Grid container className="list-body__item-details">
								<Grid item xs={9} sm={10} md={11} className="orders-need-plate">
									<span className="orders-need-plate__account-name">{account_name}</span>
									<span className="orders-need-plate__product-name">{product_name}</span>
									<span className="orders-need-plate__product-size">
										{product_thick}x{product_length}x{product_width}
									</span>
								</Grid>
								<Grid item xs={3} sm={2} md={1} className="orders-need-plate__plate-status">
									<span
										className={
											plate_status === '신규' ? 'plate-new' : plate_status === '수정' && 'plate-edit'
										}
									>
										{plate_status}
									</span>
								</Grid>
							</Grid>
							<div className="list-body__item-buttons">
								<Tooltip title="동판제작완료">
									<IconButton
										color="primary"
										aria-label="edit"
										onClick={() => {
											onPlateReadyClick(id);
										}}
									>
										<Icon>check</Icon>
									</IconButton>
								</Tooltip>
							</div>
						</li>
					);
				}
			)}
		</ListBody>
	);
};

export default OrdersNeedPlate;

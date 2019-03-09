import React, { Component } from 'react';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { highlight } from '../../helpers/highlight';
import CustomModal from '../../components/CustomModal/CustomModal';
import './ProductName.css';
import { comma } from '../../helpers/comma';
import { PRODUCT_DETAIL_SECTIONS } from '../../helpers/constants';

class ProductName extends Component {
	state = {
		isDetailViewOpen: false,
		isPrintImageViewOpen: false
	};

	showDetailView = () => {
		this.setState({ isDetailViewOpen: true });
	};

	hideDetailView = () => {
		this.setState({ isDetailViewOpen: false });
	};

	renderSections = (data) =>
		PRODUCT_DETAIL_SECTIONS.map(({ title, fields }) => {
			const hasInfo = fields.map(({ varName }) => !!data[varName]).filter((value) => value === true).length > 0;

			if (hasInfo) {
				return (
					<Grid item xs={12} md={6} key={title}>
						<h2 className="detail-view__subtitle">{title}</h2>
						{this.renderFields(fields, data)}
					</Grid>
				);
			} else {
				return undefined;
			}
		});

	renderFields = (fields, data) =>
		fields.map(({ varName, displayName }) => {
			let value;
			console.log(fields, data)

			switch (varName) {
				case 'product_size':
					value = `${data.product_thick} x ${data.product_length} x ${data.product_width}`;
					break;
				case 'is_print':
					value = data.is_print === 'is_print_true' || data.is_print === true ? '인쇄' : '무지';
					break;
				case 'ext_pretreat':
					value = data.ext_pretreat === 'single' ? '단면' : data.ext_pretreat === 'double' ? '양면' : '';
					break;
				case 'print_image_url':
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
				if (varName === 'print_image_url') {
					return (
						<div key={displayName} className="detail-view__row">
							<span className="detail-view__name">{displayName}</span>
							<span className="detail-view__value">
								<Button
									fullWidth
									variant="contained"
									onClick={() => {
										this.setState({ isPrintImageViewOpen: true });
									}}
								>
									도안보기
								</Button>
								<CustomModal
									title="도안 보기"
									open={this.state.isPrintImageViewOpen}
									onClose={() => {
										this.setState({ isPrintImageViewOpen: false });
									}}
									Buttons={
										<Button
											variant="contained"
											color="primary"
											onClick={() => {
												this.setState({ isPrintImageViewOpen: false });
											}}
										>
											확인
										</Button>
									}
								>
									<a href={value} target="_blank" className="detail-view__image-container">
										<img className="detail-view__image" src={value} alt={displayName} />
									</a>
								</CustomModal>
							</span>
						</div>
					);
				} else if (varName === 'history') {
					return (
						<div key={displayName} className="detail-view__row">
							<ul className="order-history-list">{this.renderHistory(value)}</ul>
						</div>
					);
				}

				return (
					<div key={displayName} className="detail-view__row">
						<span className="detail-view__name">{displayName}</span>
						<span className="detail-view__value">{value}</span>
					</div>
				);
			} else return undefined;
		});

	renderHistory = (history) => {
		return history.map(({ date, quantity }) => {
			return (
				<li key={date} className="order-history-list__item">
					<span>{date}</span>
					<span>{`${comma(quantity)}매`}</span>
				</li>
			);
		});
	};

	render() {
		const { product, searchTerm, className } = this.props;

		console.log(product)

		const productName = highlight(product.product_name, searchTerm);

		return (
			<div>
				<span
					className={`product-name ${className}`}
					onClick={this.showDetailView.bind(this)}
					dangerouslySetInnerHTML={{ __html: productName }}
				/>
				{this.state.isDetailViewOpen && (
					<CustomModal
						className="product-detail-view"
						title="품목 상세 정보"
						open={this.state.isDetailViewOpen}
						onClose={this.hideDetailView.bind(this)}
						Buttons={
							<Button variant="contained" color="primary" onClick={this.hideDetailView.bind(this)}>
								확인
							</Button>
						}
					>
						<div className="product-detail-view__contents">{this.renderSections(product)}</div>
					</CustomModal>
				)}
			</div>
		);
	}
}

const mapStateToProps = ({ auth }) => {
	return { auth };
};

export default connect(mapStateToProps)(ProductName);

import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import {
  fetchOrders,
  updateOrder,
  deleteOrders,
  completeOrders,
  toggleOrderChecked,
  toggleOrdersChecked,
} from '../../actions';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Divider from '@material-ui/core/Divider';
import PageHeader from '../../components/PageHeader/PageHeader';
import OrderSearch from '../../components/OrderSearch/OrderSearch';
import ListHeader from '../../components/ListHeader/ListHeader';
import ListBody from '../../components/ListBody/ListBody';
import NoData from '../../components/NoData/NoData';
import OrderListItem from '../../components/OrderListItem/OrderListItem';
import CompleteOrderModal from '../../components/CompleteOrderModal/CompleteOrderModal';
import ProductOrderForm from '../../components/ProductOrderForm/ProductOrderForm';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import './OrdersPage.css';

class OrdersPage extends Component {
  constructor() {
    super();

    this.state = {
      isConfirmModalOpen: false,
      selectedOrderIds: [],
      confirmModalTitle: '',
      confirmModalDescription: '',
      isCompleteOrderModalOpen: false,
      isProductOrderFormOpen: false,
      orderToEdit: ''
    };

    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.onRowsPerPageChange = this.onRowsPerPageChange.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.onListItemChecked = this.onListItemChecked.bind(this);
    this.onSelectAllChange = this.onSelectAllChange.bind(this);
    this.onDeleteAllClick = this.onDeleteAllClick.bind(this);
    this.onCancelSelection = this.onCancelSelection.bind(this);
    this.showConfirmDeleteModal = this.showConfirmDeleteModal.bind(this);
    this.onConfirmModalClose = this.onConfirmModalClose.bind(this);
    this.onProductOrderFormClose = this.onProductOrderFormClose.bind(this);
    this.showProductOrderForm = this.showProductOrderForm.bind(this);
    this.showCompleteOrderModal = this.showCompleteOrderModal.bind(this);
  }

  componentDidMount() {
    const { search } = this.props.orders;
    const token = this.props.auth.userToken;
    this.props.fetchOrders(token, search);
  }

  onSearchChange = (name, value) => {
    const { search } = this.props.orders;
    const token = this.props.auth.userToken;
    search[name] = value;
    this.props.fetchOrders(token, search);
  };

  onDateChange = (date_from, date_to) => {
    const { search } = this.props.orders;
    const token = this.props.auth.userToken;
    search.date_from = date_from;
    search.date_to = date_to;
    this.props.fetchOrders(token, search);
  }

  onSearchReset = () => {
    const token = this.props.auth.userToken;
    const search = {
      date_from: moment()
        .subtract(14, 'days')
        .format('YYYY-MM-DD'),
      date_to: moment().format('YYYY-MM-DD'),
      account_name: '',
      product_name: '',
      product_thick: '',
      product_length: '',
      product_width: '',
      show_completed: false,
      limit: 10,
      offset: 0
    }

    this.props.fetchOrders(token, search);
  };

  onRowsPerPageChange = limit => {
    const { search } = this.props.orders;
    const token = this.props.auth.userToken;
    search.limit = Number(limit);
    search.offset = 0;
    this.props.fetchOrders(token, search);
  };

  onPageChange = change => {
    const { count, search } = this.props.orders;
    const token = this.props.auth.userToken;
    switch (change) {
      case 'prev':
        search.offset -= search.limit;
        break;
      case 'next':
        search.offset += search.limit;
        break;
      case 'first':
        search.offset = 0;
        break;
      case 'last':
        if (count % search.limit === 0) {
          search.offset =
            (parseInt(count / search.limit, 10) - 1) * search.limit;
        } else {
          search.offset = parseInt(count / search.limit, 10) * search.limit;
        }
        break;
      default:
        break;
    }
    this.props.fetchOrders(token, search);
  };

  onDeleteAllClick = () => {
    const { selected } = this.props.orders;
    this.showConfirmDeleteModal(selected);
  };

  onSelectAllChange = checked => {
    this.props.toggleOrdersChecked(checked);
  };

  onCancelSelection = () => {
    this.props.toggleOrdersChecked(false);
  };

  onListItemChecked = id => {
    this.props.toggleOrderChecked(id);
  };

  showConfirmDeleteModal = ids => {
    this.setState({
      isConfirmModalOpen: true,
      selectedOrderIds: ids,
      confirmModalTitle: '작업지시 취소',
      confirmModalDescription: `총 ${
        ids.length
      }개 작업지시를 취소 하시겠습니까?`
    });
  };

  onConfirmModalClose = result => {
    this.setState({
      isConfirmModalOpen: false,
      selectedOrderIds: [],
      confirmModalTitle: '',
      confirmModalDescription: ''
    });

    if (result) {
      const { search } = this.props.orders;
      const token = this.props.auth.userToken;
      const ids = this.state.selectedOrderIds;
      this.props.deleteOrders(token, ids, search);
    }
  };

  showCompleteOrderModal = ids => {
    const token = this.props.auth.userToken;
    fetch(`http://localhost:3000/orders-by-ids`, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      },
      method: 'post',
      body: JSON.stringify(ids)
    })
      .then(response => response.json())
      .then(({ success, error, data }) => {
        if (success) {
          this.setState({
            isCompleteOrderModalOpen: true,
            selectedOrders: data
          })
        }
      });
  }

  onCompleteOrderModalClose = (result, data) => {
    this.setState({
      isCompleteOrderModalOpen: false,
      selectedOrders: []
    })

    if (result) {
      const { search } = this.props.orders;
      const token = this.props.auth.userToken;
      this.props.completeOrders(token, data, search);
    }
  }

  showProductOrderForm = orderId => {
    const { orders } = this.props;
    const order = orders.current.find(({ id }) => id === orderId);
    Object.keys(order).forEach(key => {
      if (order[key] === null) delete order[key];
    });
    this.setState({
      isProductOrderFormOpen: true,
      orderToEdit: order
    });
  };

  onProductOrderFormClose = (result, data) => {
    this.setState({
      isProductOrderFormOpen: false,
      orderToEdit: {}
    });

    if (result) {
      const { search } = this.props.orders;
      const token = this.props.auth.userToken;
      this.props.updateOrder(token, data.id, data, search);
    }
  };

  render() {
    const { count, current, search, selected } = this.props.orders;
    const isFirstPage = search.offset === 0;
    const isLastPage = count <= search.offset + search.limit;
    const isSelectedAll = selected.length !== 0 && selected.length === count;
    return (
      <main>
        <PageHeader
          title="작업내역"
          ToolButtons={
            <Tooltip title="엑셀 다운로드">
              <IconButton aria-label="엑셀다운로드">
                <Icon>save_alt</Icon>
              </IconButton>
            </Tooltip>
          }
        />
        <Divider />
        <OrderSearch
          onInputChange={this.onSearchChange}
          onDateChange={this.onDateChange}
          onReset={this.onSearchReset}
        />
        <ListHeader
          rowsPerPage={search.limit}
          isFirstPage={isFirstPage}
          isLastPage={isLastPage}
          onRowsPerPageChange={this.onRowsPerPageChange}
          onPageChange={this.onPageChange}
          onDeleteAllClick={this.onDeleteAllClick}
          onSelectAllChange={this.onSelectAllChange}
          selectAllDisabled={search.show_completed}
          selectedCount={selected.length}
          isSelectedAll={isSelectedAll}
          onCancelSelection={this.onCancelSelection}
          totalCount={count}
          offset={search.offset}
          Buttons={
            <div>
              <Tooltip title="출력">
                <IconButton
                  color="primary"
                  aria-label="print"
                >
                  <Icon>print</Icon>
                </IconButton>
              </Tooltip>
              <Tooltip title="완료">
                <IconButton
                  color="primary"
                  aria-label="complete"
                  onClick={() => { this.showCompleteOrderModal(selected) }}
                >
                  <Icon>done</Icon>
                </IconButton>
              </Tooltip>
            </div>
          }
        />
        {current.length === 0 ? (
          <NoData />
        ) : (
          <ListBody>
            {current.map(order => (
              <OrderListItem
                key={order.id}
                search={search}
                order={order}
                onListItemChecked={this.onListItemChecked}
                onListItemCompleteClick={this.showCompleteOrderModal}
                onListItemEditClick={this.showProductOrderForm}
                onListItemDeleteClick={this.showConfirmDeleteModal}
              />
            ))}
          </ListBody>
        )}
        {this.state.isConfirmModalOpen && (
          <ConfirmModal
            open={this.state.isConfirmModalOpen}
            title={this.state.confirmModalTitle}
            description={this.state.confirmModalDescription}
            onClose={this.onConfirmModalClose}
          />
        )}
        {this.state.isCompleteOrderModalOpen && (
          <CompleteOrderModal
            open={this.state.isCompleteOrderModalOpen}
            orders={this.state.selectedOrders}
            onClose={this.onCompleteOrderModalClose}
          />
        )}
        {this.state.isProductOrderFormOpen && (
          <ProductOrderForm
            order={this.state.orderToEdit}
            open={this.state.isProductOrderFormOpen}
            onClose={this.onProductOrderFormClose}
          />
        )}
      </main>
    );
  }
}

const mapStateToProps = ({ auth, orders }) => {
  return { auth, orders };
};

export default connect(
  mapStateToProps,
  {
    fetchOrders,
    updateOrder,
    deleteOrders,
    completeOrders,
    toggleOrderChecked,
    toggleOrdersChecked
  }
)(OrdersPage);

import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import {
  fetchOrders,
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
// import ProductForm from '../../components/ProductForm/ProductForm';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import './OrdersPage.css';

class OrdersPage extends Component {
  constructor() {
    super();

    this.state = {
      isConfirmModalOpen: false,
      selectedOrders: [],
      confirmModalTitle: '',
      confirmModalDescription: '',
      // isProductFormOpen: false,
      // productFormTitle: '',
      // productToEdit: '',
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
    // this.onConfirmModalClose = this.onConfirmModalClose.bind(this);
    // this.onProductOrderFormClose = this.onProductOrderFormClose.bind(this);
    // this.showProductForm = this.showProductForm.bind(this);
    // this.onProductFormClose = this.onProductFormClose.bind(this);
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
      selectedOrders: ids,
      confirmModalTitle: '작업지시 취소',
      confirmModalDescription: `총 ${
        ids.length
      }개 작업지시를 취소 하시겠습니까?`
    });
  };

  // onConfirmModalClose = result => {
  //   this.setState({
  //     isConfirmModalOpen: false,
  //     selectedProducts: [],
  //     confirmModalTitle: '',
  //     confirmModalDescription: ''
  //   });
  //
  //   if (result) {
  //     const { search } = this.props.products;
  //     const token = this.props.auth.userToken;
  //     const ids = this.state.selectedProducts;
  //     this.props.deleteProducts(token, ids, search);
  //   }
  // };
  //
  // showProductOrderForm = productId => {
  //   const { products } = this.props;
  //   const product = products.current.find(({ id }) => id === productId);
  //   Object.keys(product).forEach(key => {
  //     if (product[key] === null) delete product[key];
  //   });
  //   this.setState({
  //     isProductOrderFormOpen: true,
  //     productToOrder: product
  //   });
  // };
  //
  // onProductOrderFormClose = (result, data) => {
  //   this.setState({
  //     isProductOrderFormOpen: false,
  //     productToOrder: {}
  //   });
  //
  //   if (result) {
  //     const token = this.props.auth.userToken;
  //     this.props.addOrder(token, data);
  //   }
  // };
  //
  // showProductForm = (mode, productToEdit) => {
  //   if (mode === 'new') {
  //     this.setState({
  //       isProductFormOpen: true,
  //       productFormTitle: '품목등록'
  //     });
  //   } else if (mode === 'edit') {
  //     this.setState({
  //       isProductFormOpen: true,
  //       productFormTitle: '품목수정',
  //       productToEdit
  //     });
  //   }
  // };
  //
  // onProductFormClose = (result, data, id) => {
  //   this.setState({
  //     isProductFormOpen: false,
  //     productFormTitle: '',
  //     productToEdit: ''
  //   });
  //
  //   if (result && id === undefined) {
  //     const { search } = this.props.products;
  //     const token = this.props.auth.userToken;
  //     this.props.addProducts(token, [data], search);
  //   } else if (result && id !== undefined) {
  //     const { search } = this.props.products;
  //     const token = this.props.auth.userToken;
  //     this.props.updateProduct(token, id, data, search);
  //   }
  // };

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
                // onListItemEditClick={this.showProductForm}
                onListItemDeleteClick={this.showConfirmDeleteModal}
              />
            ))}
          </ListBody>
        )}
        {/* {this.state.isConfirmModalOpen && (
          <ConfirmModal
            open={this.state.isConfirmModalOpen}
            title={this.state.confirmModalTitle}
            description={this.state.confirmModalDescription}
            onClose={this.onConfirmModalClose}
          />
        )} */}
        {/* {this.state.isProductFormOpen && (
          <ProductForm
            productId={this.state.productToEdit}
            open={this.state.isProductFormOpen}
            title={this.state.productFormTitle}
            onClose={this.onProductFormClose}
          />
        )} */}
        {/* {this.state.isProductOrderFormOpen && (
          <ProductOrderForm
            product={this.state.productToOrder}
            open={this.state.isProductOrderFormOpen}
            onClose={this.onProductOrderFormClose}
          />
        )} */}
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
    toggleOrderChecked,
    toggleOrdersChecked
  }
)(OrdersPage);

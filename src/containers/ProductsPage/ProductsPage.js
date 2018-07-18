import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  fetchProducts,
  toggleProductsChecked,
  toggleProductChecked,
  addProducts,
  updateProduct,
  deleteProducts
} from '../../actions';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import PageHeader from '../../components/PageHeader/PageHeader';
import ProductSearch from '../../components/ProductSearch/ProductSearch';
import ListHeader from '../../components/ListHeader/ListHeader';
import ListBody from '../../components/ListBody/ListBody';
import NoData from '../../components/NoData/NoData';
import ProductListItem from '../../components/ProductListItem/ProductListItem';
import ProductForm from '../../components/ProductForm/ProductForm';
import ProductOrderForm from '../../components/ProductOrderForm/ProductOrderForm';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import './ProductsPage.css';

class ProductsPage extends Component {
  constructor() {
    super();

    this.state = {
      isConfirmModalOpen: false,
      selectedProducts: [],
      confirmModalTitle: '',
      confirmModalDescription: '',
      isProductFormOpen: false,
      productFormTitle: '',
      productToEdit: '',
      isProductOrderFormOpen: false,
      productToOrder: {},
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
    this.showProductOrderForm = this.showProductOrderForm.bind(this);
    this.onProductOrderFormClose = this.onProductOrderFormClose.bind(this);
    this.showProductForm = this.showProductForm.bind(this);
    this.onProductFormClose = this.onProductFormClose.bind(this);
  }

  componentDidMount() {
    const { search } = this.props.products;
    const token = this.props.auth.userToken;
    this.props.fetchProducts(token, search);
  }

  onSearchChange = (name, event) => {
    const { search } = this.props.products;
    const token = this.props.auth.userToken;
    search[name] = event.target.value.toLowerCase();
    this.props.fetchProducts(token, search);
  };

  onSearchReset = () => {
    const token = this.props.auth.userToken;
    const search = {
      account_name: '',
      product_name: '',
      product_thick: '',
      product_length: '',
      product_width: '',
      ext_color: '',
      print_color: '',
      limit: 10,
      offset: 0
    };
    this.props.fetchProducts(token, search);
  };

  onRowsPerPageChange = limit => {
    const { search } = this.props.products;
    const token = this.props.auth.userToken;
    search.limit = Number(limit);
    search.offset = 0;
    this.props.fetchProducts(token, search);
  };

  onPageChange = change => {
    const { count, search } = this.props.products;
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
    this.props.fetchProducts(token, search);
  };

  onDeleteAllClick = () => {
    const { selected } = this.props.products;
    this.showConfirmDeleteModal(selected);
  };

  onSelectAllChange = checked => {
    this.props.toggleProductsChecked(checked);
  };

  onCancelSelection = () => {
    this.props.toggleProductsChecked(false);
  };

  onListItemChecked = id => {
    this.props.toggleProductChecked(id);
  };

  showConfirmDeleteModal = ids => {
    this.setState({
      isConfirmModalOpen: true,
      selectedProducts: ids,
      confirmModalTitle: '품목 삭제',
      confirmModalDescription: `총 ${
        ids.length
      }개 품목을 정말로 삭제 하시겠습니까?`
    });
  };

  onConfirmModalClose = result => {
    if (result) {
      const { search } = this.props.products;
      const token = this.props.auth.userToken;
      const ids = this.state.selectedProducts;
      this.props.deleteProducts(token, ids, search);
    }

    this.setState({
      isConfirmModalOpen: false,
      selectedProducts: [],
      confirmModalTitle: '',
      confirmModalDescription: ''
    });
  }

  showProductOrderForm = productId => {
    const { products } = this.props;
    const product = products.current.find(({ id }) => id === productId);
    Object.keys(product).forEach(key => {
      if (product[key] === null) delete product[key];
    });
    this.setState({
      isProductOrderFormOpen: true,
      productToOrder: product
    });
  }

  onProductOrderFormClose = (result, data, id) => {
    console.log(result, data, id);
    this.setState({
      isProductOrderFormOpen: false,
      productToOrder: {}
    });
  }

  showProductForm = (mode, productToEdit) => {
    if (mode === 'new') {
      this.setState({
        isProductFormOpen: true,
        productFormTitle: '품목등록'
      });
    } else if (mode === 'edit') {
      this.setState({
        isProductFormOpen: true,
        productFormTitle: '품목수정',
        productToEdit
      });
    }
  }

  onProductFormClose = (result, data, id) => {
    this.setState({
      isProductFormOpen: false,
      productFormTitle: '',
      productToEdit: ''
    });

    if (result && id === undefined) {
      const { search } = this.props.products;
      const token = this.props.auth.userToken;
      this.props.addProducts(token, [data], search);
    } else if (result && id !== undefined) {
      const { search } = this.props.products;
      const token = this.props.auth.userToken;
      this.props.updateProduct(token, id, data, search);
    }
  }

  render() {
    const { count, current, search, selected } = this.props.products;
    const isFirstPage = search.offset === 0;
    const isLastPage = count <= search.offset + search.limit;
    const isSelectedAll = selected.length !== 0 && selected.length === count;
    return (
      <main>
        <PageHeader
          title="품목관리"
          ToolButtons={
            <Tooltip title="엑셀 다운로드">
              <IconButton aria-label="엑셀다운로드">
                <Icon>save_alt</Icon>
              </IconButton>
            </Tooltip>
          }
        />
        <Divider />
        <ProductSearch
          onInputChange={this.onSearchChange}
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
          selectedCount={selected.length}
          isSelectedAll={isSelectedAll}
          onCancelSelection={this.onCancelSelection}
          totalCount={count}
          offset={search.offset}
        />
        {current.length === 0 ? (
          <NoData />
        ) : (
          <ListBody>
            {current.map(product => (
              <ProductListItem
                key={product.id}
                search={search}
                product={product}
                onListItemChecked={this.onListItemChecked}
                onListItemOrderClick={this.showProductOrderForm}
                onListItemEditClick={this.showProductForm}
                onListItemDeleteClick={this.showConfirmDeleteModal}
              />
            ))}
          </ListBody>
        )}
        <div className="fab-add">
          <Tooltip title="품목 추가">
            <Button
              variant="fab"
              color="primary"
              aria-label="add"
              onClick={() => {
                this.showProductForm('new');
              }}
            >
              <Icon>add</Icon>
            </Button>
          </Tooltip>
        </div>
        {this.state.isConfirmModalOpen && (
          <ConfirmModal
            open={this.state.isConfirmModalOpen}
            title={this.state.confirmModalTitle}
            description={this.state.confirmModalDescription}
            onClose={this.onConfirmModalClose}
          />
        )}
        {this.state.isProductFormOpen && (
          <ProductForm
            productId={this.state.productToEdit}
            open={this.state.isProductFormOpen}
            title={this.state.productFormTitle}
            onClose={this.onProductFormClose}
          />
        )}
        {this.state.isProductOrderFormOpen && (
          <ProductOrderForm
            product={this.state.productToOrder}
            open={this.state.isProductOrderFormOpen}
            onClose={this.onProductOrderFormClose}
          />
        )}
      </main>
    );
  }
}

const mapStateToProps = ({ auth, products }) => {
  return { auth, products };
};

export default connect(
  mapStateToProps,
  { fetchProducts, toggleProductsChecked, toggleProductChecked, addProducts, updateProduct, deleteProducts }
)(ProductsPage);
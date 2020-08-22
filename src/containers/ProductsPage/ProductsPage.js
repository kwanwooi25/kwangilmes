import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  fetchProducts,
  toggleProductsChecked,
  toggleProductChecked,
  addProducts,
  updateProduct,
  deleteProducts,
  addOrder,
} from '../../actions';
import Divider from '@material-ui/core/Divider';
import PageHeader from '../../components/PageHeader/PageHeader';
import ProductSearch from '../../components/ProductSearch/ProductSearch';
import ListHeader from '../../components/ListHeader/ListHeader';
import ListBody from '../../components/ListBody/ListBody';
import ProductListItem from '../../components/ProductListItem/ProductListItem';
import ProductForm from '../../components/ProductForm/ProductForm';
import ProductOrderForm from '../../components/ProductOrderForm/ProductOrderForm';
import AddMultiModal from '../../components/AddMultiModal/AddMultiModal';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import FabAdd from '../../components/FabAdd/FabAdd';
import { exportCSV } from '../../helpers/exportCSV';
import { calculateOffset } from '../../helpers/calculateOffset';
import { convertExcelToJSON } from '../../helpers/convertExcelToJSON';
import ProductsTemplate from '../../assets/products_template.xlsx';
import './ProductsPage.css';

const CSV_HEADERS = [
  { key: 'id', name: 'ID', type: 'integer' },
  { key: 'account_name', name: '업체명', type: 'string' },
  { key: 'product_name', name: '품목명', type: 'string' },
  { key: 'product_thick', name: '두께', type: 'string' },
  { key: 'product_length', name: '길이(압출)', type: 'string' },
  { key: 'product_width', name: '너비(가공)', type: 'string' },
  { key: 'is_print', name: '무지/인쇄', type: 'boolean' },
  { key: 'ext_color', name: '원단색상', type: 'string' },
  { key: 'ext_antistatic', name: '대전방지', type: 'boolean' },
  { key: 'ext_pretreat', name: '처리', type: 'string' },
  { key: 'ext_memo', name: '압출메모', type: 'string' },
  { key: 'print_front_color_count', name: '전면도수', type: 'integer' },
  { key: 'print_front_color', name: '전면색상', type: 'string' },
  { key: 'print_front_position', name: '전면인쇄위치', type: 'string' },
  { key: 'print_back_color_count', name: '후면도수', type: 'integer' },
  { key: 'print_back_color', name: '후면색상', type: 'string' },
  { key: 'print_back_position', name: '후면인쇄위치', type: 'string' },
  { key: 'print_image_url', name: '도안URL', type: 'string' },
  { key: 'print_memo', name: '인쇄메모', type: 'string' },
  { key: 'cut_position', name: '가공위치', type: 'string' },
  { key: 'cut_ultrasonic', name: '초음파가공', type: 'boolean' },
  { key: 'cut_powder_pack', name: '가루포장', type: 'boolean' },
  { key: 'cut_is_punched', name: '바람구멍', type: 'boolean' },
  { key: 'cut_punch_count', name: '바람구멍개수', type: 'integer' },
  { key: 'cut_punch_size', name: '바람구멍크기', type: 'string' },
  { key: 'cut_punch_position', name: '바람구멍위치', type: 'string' },
  { key: 'cut_memo', name: '가공메모', type: 'string' },
  { key: 'pack_material', name: '포장방법', type: 'string' },
  { key: 'pack_unit', name: '포장단위', type: 'integer' },
  { key: 'pack_deliver_all', name: '수량+/- 가능', type: 'boolean' },
  { key: 'pack_memo', name: '포장메모', type: 'string' },
  { key: 'unit_price', name: '단가', type: 'float' },
  { key: 'product_memo', name: '메모', type: 'string' },
];

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
      isAddMultiModalOpen: false,
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
    this.onExportExcelClick = this.onExportExcelClick.bind(this);
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
    search.offset = 0;
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
      offset: 0,
    };
    this.props.fetchProducts(token, search);
  };

  onRowsPerPageChange = (limit) => {
    const { search } = this.props.products;
    const token = this.props.auth.userToken;
    search.limit = Number(limit);
    search.offset = 0;
    this.props.fetchProducts(token, search);
  };

  onPageChange = (change) => {
    const { count, search } = this.props.products;
    const token = this.props.auth.userToken;

    search.offset = calculateOffset(change, search.offset, search.limit, count);

    this.props.fetchProducts(token, search);
  };

  onDeleteAllClick = () => {
    const { selected } = this.props.products;
    this.showConfirmDeleteModal(selected);
  };

  onSelectAllChange = (checked) => {
    this.props.toggleProductsChecked(checked);
  };

  onCancelSelection = () => {
    this.props.toggleProductsChecked(false);
  };

  onListItemChecked = (id) => {
    this.props.toggleProductChecked(id);
  };

  showConfirmDeleteModal = (ids) => {
    this.setState({
      isConfirmModalOpen: true,
      selectedProducts: ids,
      confirmModalTitle: '품목 삭제',
      confirmModalDescription: `총 ${ids.length}개 품목을 정말로 삭제 하시겠습니까?`,
    });
  };

  onConfirmModalClose = (result) => {
    this.setState({
      isConfirmModalOpen: false,
      selectedProducts: [],
      confirmModalTitle: '',
      confirmModalDescription: '',
    });

    if (result) {
      const { search } = this.props.products;
      const token = this.props.auth.userToken;
      const ids = this.state.selectedProducts;
      this.props.deleteProducts(token, ids, search);
    }
  };

  showProductOrderForm = (productId) => {
    const { products } = this.props;
    const product = products.current.find(({ id }) => id === productId);
    this.setState({
      isProductOrderFormOpen: true,
      productToOrder: product,
    });
  };

  onProductOrderFormClose = (result, data) => {
    this.setState({
      isProductOrderFormOpen: false,
      productToOrder: {},
    });

    if (result) {
      const token = this.props.auth.userToken;
      this.props.addOrder(token, data);
    }
  };

  showProductForm = (mode, productToEdit) => {
    if (mode === 'new') {
      this.setState({
        isProductFormOpen: true,
        productFormTitle: '품목등록',
      });
    } else if (mode === 'edit') {
      this.setState({
        isProductFormOpen: true,
        productFormTitle: '품목수정',
        productToEdit,
      });
    }
  };

  onProductFormClose = (result, data, id) => {
    this.setState({
      isProductFormOpen: false,
      productFormTitle: '',
      productToEdit: '',
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
  };

  showAddMultiModal = () => {
    this.setState({ isAddMultiModalOpen: true });
  };

  onAddMultiModalClose = (result, rows) => {
    this.setState({ isAddMultiModalOpen: false });

    if (result) {
      CSV_HEADERS.push({
        key: 'old_history',
        name: '작업내역',
        type: 'string',
      });
      const products = convertExcelToJSON(rows, CSV_HEADERS);

      // add products
      const { search } = this.props.products;
      const token = this.props.auth.userToken;
      this.props.addProducts(token, products, search);
    }
  };

  onExportExcelClick = () => {
    const { search } = this.props.products;
    const token = this.props.auth.userToken;

    exportCSV('광일_제품목록.csv', CSV_HEADERS, 'products', search, token);
  };

  render() {
    const hasWritePermission = this.props.auth.current_user.can_write_products;
    const { isPending, count, current, search, selected } = this.props.products;
    const isFirstPage = search.offset === 0;
    const isLastPage = count <= search.offset + search.limit;
    const isSelectedAll = selected.length !== 0 && selected.length === count;
    return (
      <main>
        <PageHeader
          title="품목관리"
          uploadButton={hasWritePermission}
          onUploadButtonClick={this.showAddMultiModal}
          exportButton={true}
          onExportButtonClick={this.onExportExcelClick}
        />
        <Divider />
        <ProductSearch onInputChange={this.onSearchChange} onReset={this.onSearchReset} searchValues={search} />
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
          {current.map((product) => (
            <ProductListItem
              key={product.id}
              search={search}
              product={product}
              hasWritePermission={hasWritePermission}
              onListItemChecked={this.onListItemChecked}
              onListItemOrderClick={this.showProductOrderForm}
              onListItemEditClick={this.showProductForm}
              onListItemDeleteClick={this.showConfirmDeleteModal}
            />
          ))}
        </ListBody>
        {hasWritePermission && (
          <FabAdd
            title="품목 추가"
            onClick={() => {
              this.showProductForm('new');
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
        {this.state.isAddMultiModalOpen && (
          <AddMultiModal
            open={this.state.isAddMultiModalOpen}
            template={ProductsTemplate}
            onClose={this.onAddMultiModalClose}
          />
        )}
      </main>
    );
  }
}

const mapStateToProps = ({ auth, products }) => {
  return { auth, products };
};

export default connect(mapStateToProps, {
  fetchProducts,
  toggleProductsChecked,
  toggleProductChecked,
  addProducts,
  updateProduct,
  deleteProducts,
  addOrder,
})(ProductsPage);

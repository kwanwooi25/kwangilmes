import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  fetchPlates,
  togglePlatesChecked,
  togglePlateChecked
} from '../../actions';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import PageHeader from '../../components/PageHeader/PageHeader';
// import ProductSearch from '../../components/ProductSearch/ProductSearch';
import ListHeader from '../../components/ListHeader/ListHeader';
import ListBody from '../../components/ListBody/ListBody';
import NoData from '../../components/NoData/NoData';
import PlateListItem from '../../components/PlateListItem/PlateListItem';
// import ProductForm from '../../components/ProductForm/ProductForm';
// import ProductOrderForm from '../../components/ProductOrderForm/ProductOrderForm';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import './PlatesPage.css';

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
      plateToEdit: ''
    };

    // this.onSearchChange = this.onSearchChange.bind(this);
    this.onRowsPerPageChange = this.onRowsPerPageChange.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.onListItemChecked = this.onListItemChecked.bind(this);
    this.onSelectAllChange = this.onSelectAllChange.bind(this);
    this.onDeleteAllClick = this.onDeleteAllClick.bind(this);
    this.onCancelSelection = this.onCancelSelection.bind(this);
    this.showConfirmDeleteModal = this.showConfirmDeleteModal.bind(this);
    // this.onConfirmModalClose = this.onConfirmModalClose.bind(this);
    this.showPlateForm = this.showPlateForm.bind(this);
    // this.onProductFormClose = this.onProductFormClose.bind(this);
  }

  componentDidMount() {
    const { search } = this.props.plates;
    const token = this.props.auth.userToken;
    this.props.fetchPlates(token, search);
  }

  // onSearchChange = (name, event) => {
  //   const { search } = this.props.products;
  //   const token = this.props.auth.userToken;
  //   search[name] = event.target.value.toLowerCase();
  //   this.props.fetchProducts(token, search);
  // };
  //
  // onSearchReset = () => {
  //   const token = this.props.auth.userToken;
  //   const search = {
  //     account_name: '',
  //     product_name: '',
  //     product_thick: '',
  //     product_length: '',
  //     product_width: '',
  //     ext_color: '',
  //     print_color: '',
  //     limit: 10,
  //     offset: 0
  //   };
  //   this.props.fetchProducts(token, search);
  // };

  onRowsPerPageChange = limit => {
    const { search } = this.props.plates;
    const token = this.props.auth.userToken;
    search.limit = Number(limit);
    search.offset = 0;
    this.props.fetchPlates(token, search);
  };

  onPageChange = change => {
    const { count, search } = this.props.plates;
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
    this.props.fetchPlates(token, search);
  };

  onDeleteAllClick = () => {
    const { selected } = this.props.plates;
    this.showConfirmDeleteModal(selected);
  };

  onSelectAllChange = checked => {
    this.props.togglePlatesChecked(checked);
  };

  onCancelSelection = () => {
    this.props.togglePlatesChecked(false);
  };

  onListItemChecked = id => {
    this.props.togglePlateChecked(id);
  };

  showConfirmDeleteModal = ids => {
    this.setState({
      isConfirmModalOpen: true,
      selectedPlates: ids,
      confirmModalTitle: '동판 삭제',
      confirmModalDescription: `총 ${
        ids.length
      }개 동판을 정말로 삭제 하시겠습니까?`
    });
  };

  onConfirmModalClose = result => {
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
      // this.props.deleteProducts(token, ids, search);
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

  // onProductFormClose = (result, data, id) => {
  //   this.setState({
  //     isPlateFormOpen: false,
  //     plateFormTitle: '',
  //     plateToEdit: ''
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

  fetchProductInfo = async (userToken, productId) => {
    const result = await fetch(`http://localhost:3000/products/${productId}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': userToken
      },
      method: 'get'
    }).then(response => response.json());

    const { success, data } = result;
    if (success) {
      return data;
    } else {
      return undefined;
    }
  };

  render() {
    const { count, current, search, selected } = this.props.plates;
    const isFirstPage = search.offset === 0;
    const isLastPage = count <= search.offset + search.limit;
    const isSelectedAll = selected.length !== 0 && selected.length === count;
    return (
      <main>
        <PageHeader
          title="동판관리"
          ToolButtons={
            <Tooltip title="엑셀 다운로드">
              <IconButton aria-label="엑셀다운로드">
                <Icon>save_alt</Icon>
              </IconButton>
            </Tooltip>
          }
        />
        <Divider />
        {/* <ProductSearch
          onInputChange={this.onSearchChange}
          onReset={this.onSearchReset}
        /> */}
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
            {current.map(plate => {
              return (
                <PlateListItem
                  key={plate.id}
                  search={search}
                  plate={plate}
                  onListItemChecked={this.onListItemChecked}
                  onListItemEditClick={this.showPlateForm}
                  onListItemDeleteClick={this.showConfirmDeleteModal}
                />
              );
            })}
          </ListBody>
        )}
        <div className="fab-add">
          <Tooltip title="동판 추가">
            <Button
              variant="fab"
              color="primary"
              aria-label="add"
              // onClick={() => {
              //   this.showPlateForm('new');
              // }}
            >
              <Icon>add</Icon>
            </Button>
          </Tooltip>
        </div>
        {/* {this.state.isConfirmModalOpen && (
          <ConfirmModal
            open={this.state.isConfirmModalOpen}
            title={this.state.confirmModalTitle}
            description={this.state.confirmModalDescription}
            onClose={this.onConfirmModalClose}
          />
        )} */}
        {/* {this.state.isPlateFormOpen && (
          <ProductForm
            productId={this.state.plateToEdit}
            open={this.state.isPlateFormOpen}
            title={this.state.plateFormTitle}
            onClose={this.onProductFormClose}
          />
        )} */}
      </main>
    );
  }
}

const mapStateToProps = ({ auth, plates }) => {
  return { auth, plates };
};

export default connect(
  mapStateToProps,
  { fetchPlates, togglePlatesChecked, togglePlateChecked }
)(PlatesPage);

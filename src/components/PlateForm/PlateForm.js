import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Checkbox from '@material-ui/core/Checkbox';
import FormHelperText from '@material-ui/core/FormHelperText';
import FullScreenDialog from '../../components/FullScreenDialog/FullScreenDialog';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import './PlateForm.css';

const HOST = process.env.REACT_APP_API_HOST;

const PLATE_FORM_FIELDS = [
  { varName: 'plate_round', displayName: '둘레', xs: 6, sm: 3, md: 2 },
  { varName: 'plate_length', displayName: '기장', xs: 6, sm: 3, md: 2 },
  {
    type: 'select',
    varName: 'plate_material',
    displayName: '재질',
    options: ['신주', '데스'],
    xs: 4,
    sm: 2,
    md: 2
  },
  { varName: 'storage_location', displayName: '위치', xs: 8, sm: 4, md: 2 },
  { varName: 'memo', displayName: '메모', xs: 12, md: 4 }
];

const PLATE_FORM_REQUIRED = [
  { varName: 'plate_round', error: '동판둘레를 입력하세요.' },
  { varName: 'plate_length', error: '동판기장을 입력하세요.' },
  { varName: 'plate_material', error: '동판재질을 선택하세요.' }
];

class PlateForm extends Component {
  state = {
    isConfirmModalOpen: false,
    confirmDescription: '',

    // plate props
    plate_round: '',
    plate_length: '',
    plate_material: '',
    storage_location: '',
    products: [],
    memo: '',

    // error message
    plate_round_error: '',
    plate_length_error: '',
    plate_material_error: '',
    product_search_error: '',

    // search input
    product_search: '',
    product_search_result: [],
    selectedProduct: null
  };

  componentDidMount() {
    const { plateId, plates } = this.props;
    if (plateId !== '') {
      const plate = plates.current.find(({ id }) => id === plateId);
      plate.products = [];
      for (let i = 1; i < 4; i++) {
        if (plate[`product_${i}`]) {
          plate.products.push({
            id: plate[`product_${i}`],
            product_name: plate[`product_${i}_name`],
            product_thick: plate[`product_${i}_thick`],
            product_length: plate[`product_${i}_length`],
            product_width: plate[`product_${i}_width`]
          });
        }
      }

      this.setState(Object.assign(this.state, plate));
    }
  }

  onClickOk = () => {
    if (this.validate()) {
      this.setState({
        isConfirmModalOpen: true,
        confirmDescription: this.state.id
          ? '동판 수정 하시겠습니까?'
          : '동판 추가 하시겠습니까?',
        plate_round_error: '',
        plate_length_error: '',
        plate_material_error: '',
        product_search_error: ''
      });
    }
  };

  onConfirmModalClose = result => {
    this.setState({ isConfirmModalOpen: false });
    if (result) {
      const data = {
        plate_round: this.state.plate_round,
        plate_length: this.state.plate_length,
        plate_material: this.state.plate_material,
        storage_location: this.state.storage_location,
        product_1: this.state.products[0] ? this.state.products[0].id : null,
        product_2: this.state.products[1] ? this.state.products[1].id : null,
        product_3: this.state.products[2] ? this.state.products[2].id : null,
        memo: this.state.memo
      };

      this.setState({
        isConfirmModalOpen: false,
        confirmDescription: '',

        // plate props
        plate_round: '',
        plate_length: '',
        plate_material: '',
        storage_location: '',
        products: [],
        memo: '',

        // error message
        plate_round_error: '',
        plate_length_error: '',
        plate_material_error: '',
        product_search_error: '',

        // search input
        product_search: '',
        product_search_result: [],
        selectedProduct: null
      });
      this.props.onClose(true, data, this.state.id);
    }
  };

  validate = name => {
    let isValid = true;

    // check required field
    if (name) {
      PLATE_FORM_REQUIRED.forEach(({ varName, error }) => {
        if (varName === name && this.state[varName] === '') {
          this.setState({ [`${varName}_error`]: error });
        } else if (varName === name && this.state[varName] !== '') {
          this.setState({ [`${varName}_error`]: '' });
        }
      });
    } else {
      PLATE_FORM_REQUIRED.forEach(({ varName, error }) => {
        if (this.state[varName] === '') {
          this.setState({ [`${varName}_error`]: error });
          isValid = isValid && false;
        }
      });
    }

    return isValid;
  };

  onInputChange = name => event => {
    let value;

    if (event.target.type === 'checkbox') {
      value = event.target.checked;
    } else if (event.target.id === 'product_search') {
      this.setState({ product_search_error: '' });
      value = event.target.value;
    } else {
      value = event.target.value;
    }

    this.setState({ [name]: value }, () => {
      this.validate(name);
    });
  };

  resetProductSearch = () => {
    this.setState({
      product_search: '',
      product_search_result: [],
      selectedProduct: null
    });
  };

  searchProduct = () => {
    if (this.state.product_search === '') {
      this.setState({ product_search_error: '검색어를 입력해야 합니다.' });
    } else {
      this.setState({ product_search_error: '' });
      const { userToken } = this.props.auth;
      fetch(`${HOST}/products?product_name=${this.state.product_search}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': userToken
        },
        method: 'get'
      })
        .then(response => response.json())
        .then(({ success, data }) => {
          if (success) {
            data.products.forEach(product => {
              product.checked = false;
            });
            this.setState({ product_search_result: data.products });
          }
        });
    }
  };

  renderSearchResult = () => {
    return this.state.product_search_result.map(product => {
      const {
        id,
        checked,
        product_name,
        product_thick,
        product_length,
        product_width
      } = product;
      const productName = `${product_name} (${product_thick} x ${product_length} x ${product_width})`;
      return (
        <Grid
          item
          xs={12}
          key={id}
          onClick={event => {
            let newArray = [];
            let selectedProduct = null;
            if (!checked) {
              newArray = this.state.product_search_result.map(product => {
                if (product.id === id) {
                  product.checked = true;
                  selectedProduct = product;
                } else {
                  product.checked = false;
                }
                return product;
              });
            } else {
              newArray = this.state.product_search_result.map(product => {
                product.checked = false;
                return product;
              });
            }

            this.setState({
              product_search_result: newArray,
              selectedProduct
            });
          }}
        >
          <Checkbox checked={checked} color="primary" />
          <span>{productName}</span>
        </Grid>
      );
    });
  };

  renderFields = () => {
    return PLATE_FORM_FIELDS.map(
      ({ type, varName, displayName, options, xs, sm, md, lg, multiline }) => {
        const error = this.state[`${varName}_error`];
        if (type === 'select') {
          return (
            <Grid item xs={xs} sm={sm} md={md} lg={lg} key={varName}>
              <FormControl
                fullWidth
                error={error !== undefined && error !== ''}
              >
                <InputLabel htmlFor={varName}>{displayName}</InputLabel>
                <Select
                  value={this.state[varName]}
                  onChange={this.onInputChange(varName)}
                >
                  {options.map(option => {
                    return (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    );
                  })}
                </Select>
                <FormHelperText id={varName}>{error}</FormHelperText>
              </FormControl>
            </Grid>
          );
        }

        return (
          <Grid item xs={xs} sm={sm} md={md} lg={lg} key={varName}>
            <FormControl fullWidth error={error !== undefined && error !== ''}>
              <InputLabel htmlFor={varName}>{displayName}</InputLabel>
              <Input
                id={varName}
                value={this.state[varName]}
                onChange={this.onInputChange(varName)}
                multiline={multiline}
              />
              <FormHelperText id={varName}>{error}</FormHelperText>
            </FormControl>
          </Grid>
        );
      }
    );
  };

  renderProducts = () => {
    return this.state.products.map((product, index) => {
      const {
        product_name,
        product_thick,
        product_length,
        product_width
      } = product;
      const productName = `${product_name} (${product_thick} x ${product_length} x ${product_width})`;
      return (
        <Chip
          key={index}
          label={productName}
          className="plate-form__product"
          onDelete={() => {
            const { products } = this.state;
            products.splice(index, 1);
            this.setState({ products });
          }}
        />
      );
    });
  };

  render() {
    const { open, onClose, title } = this.props;

    return (
      <FullScreenDialog
        open={open}
        onClose={onClose}
        title={title}
        Buttons={
          <Button color="inherit" onClick={this.onClickOk.bind(this)}>
            <Icon>check</Icon>
            <span> 저장</span>
          </Button>
        }
      >
        <form className="full-screen-form">
          <div className="plate-form__section">
            <div className="plate-form__section-title">
              <Typography variant="title">동판정보</Typography>
            </div>
            <div className="plate-form__section-content">
              <Grid container spacing={24}>
                {this.renderFields()}
              </Grid>
            </div>
          </div>

          <div className="plate-form__section">
            <div className="plate-form__section-title">
              <Typography variant="title">사용품목</Typography>
            </div>
            {this.state.products.length > 0 && (
              <div className="plate-form__section-content">
                <Grid container spacing={24}>
                  {this.renderProducts()}
                </Grid>
              </div>
            )}
          </div>

          {this.state.products.length < 3 && (
            <div className="plate-form__section">
              <div className="plate-form__section-content">
                <Grid container spacing={24}>
                  <Grid item xs={9} md={3}>
                    <FormControl
                      fullWidth
                      error={this.state.product_search_error !== ''}
                    >
                      <Input
                        id="product_search"
                        value={this.state.product_search}
                        placeholder="품명으로 검색"
                        onChange={this.onInputChange('product_search')}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => {
                                this.setState({ product_search: '' });
                                this.resetProductSearch();
                              }}
                            >
                              <Icon>clear</Icon>
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                      <FormHelperText id="product_search">
                        {this.state.product_search_error}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={3} md={1}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={this.searchProduct.bind(this)}
                    >
                      검색
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      disabled={!this.state.selectedProduct}
                      onClick={() => {
                        const { products } = this.state;
                        products.push(this.state.selectedProduct);
                        this.setState({ products });
                        this.resetProductSearch();
                      }}
                    >
                      사용품목 등록
                    </Button>
                  </Grid>

                  {this.state.product_search_result.length > 0 && (
                    <Grid
                      item
                      xs={12}
                      md={6}
                      className="plate-form__product_search_result"
                    >
                      {this.renderSearchResult()}
                    </Grid>
                  )}
                </Grid>
              </div>
            </div>
          )}
        </form>
        {this.state.isConfirmModalOpen && (
          <ConfirmModal
            open={this.state.isConfirmModalOpen}
            title={`${title} 확인`}
            description={this.state.confirmDescription}
            onClose={this.onConfirmModalClose.bind(this)}
          />
        )}
      </FullScreenDialog>
    );
  }
}

const mapStateToProps = ({ auth, plates }) => {
  return { auth, plates };
};

export default connect(mapStateToProps)(PlateForm);

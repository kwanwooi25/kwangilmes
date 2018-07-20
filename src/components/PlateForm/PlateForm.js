import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FullScreenDialog from '../../components/FullScreenDialog/FullScreenDialog';
import './PlateForm.css';
// import { PLATE_FORM_FIELDS } from '../../helpers/constants';

const PLATE_FORM_FIELDS = [
  { varName: 'plate_round', displayName: '둘레', xs: 6 },
  { varName: 'plate_length', displayName: '기장', xs: 6 },
  {
    type: 'select',
    varName: 'plate_material',
    displayName: '재질',
    options: ['신주', '데스'],
    xs: 4
  },
  { varName: 'storage_location', displayName: '위치', xs: 8 }
];

const PLATE_FORM_REQUIRED = [
  { varName: 'plate_round', error: '동판둘레를 입력하세요.' },
  { varName: 'plate_length', error: '동판기장을 입력하세요.' },
  { varName: 'plate_material', error: '동판재질을 선택하세요.' }
];

const PLATE_FORM_INITIAL_STATE = {
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

class PlateForm extends Component {
  state = PLATE_FORM_INITIAL_STATE;

  componentDidMount() {
    const { auth, plateId, plates } = this.props;
    const token = auth.userToken;
    // this.props.fetchAccountNames(token);
    // if (productId !== '') {
    //   const product = products.current.find(({ id }) => id === productId);
    //   Object.keys(product).forEach(key => {
    //     if (product[key] === null) delete product[key];
    //     if (key === 'is_print') {
    //       product[key] = product[key] ? 'is_print_true' : 'is_print_false';
    //     }
    //   });
    //   this.setState(Object.assign({}, PRODUCT_FORM_INITIAL_STATE, product));
    // }
  }

  onClickOk = () => {
    if (this.validate()) {
      this.setState({});
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

    switch (name) {
      default:
        break;
    }

    this.setState({ [name]: value }, () => {
      console.log(this.state);
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
    console.log('search for:::', this.state.product_search);
    if (this.state.product_search === '') {
      this.setState({ product_search_error: '검색어를 입력해야 합니다.' });
    } else {
      this.setState({ product_search_error: '' });
      const { userToken } = this.props.auth;
      fetch(
        `http://localhost:3000/products?product_name=${
          this.state.product_search
        }`,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': userToken
          },
          method: 'get'
        }
      )
        .then(response => response.json())
        .then(({ success, data }) => {
          if (success) {
            data.products.forEach(product => {
              product.checked = false;
            });
            this.setState({ product_search_result: data.products }, () => {
              console.log(this.state);
            });
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
          onClick={event => {
            if (!checked) {
              const newArray = this.state.product_search_result.map(product => {
                if (product.id === id) {
                  product.checked = true;
                } else {
                  product.checked = false;
                }
                return product;
              });

              this.setState({
                product_search_result: newArray,
                selectedProduct: product
              });
            }
          }}
        >
          <Checkbox checked={checked} color="primary" />
          <span>{productName}</span>
        </Grid>
      );
    });
  };

  onReviewClose = result => {
    this.setState({ isReviewOpen: false });
    // if (result) {
    //   const data = {
    //   };
    //
    //   this.setState(PRODUCT_FORM_INITIAL_STATE);
    //   this.props.onClose(true, data, this.state.id);
    // }
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
        <Grid item xs={12} key={index} className="plate-form__product">
          <Chip
            fullWidth
            label={productName}
            onDelete={() => {
              const { products } = this.state;
              products.splice(index, 1);
              this.setState({ products });
            }}
          />
        </Grid>
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
          <Grid container spacing={16} className="plate-form__contents">
            {this.renderFields()}
          </Grid>
          {this.state.products.length > 0 && (
            <Grid container spacing={16} className="plate-form__contents">
              <h3>사용품목</h3>
              {this.renderProducts()}
            </Grid>
          )}
          {this.state.products.length < 3 && (
            <Grid container spacing={16} className="plate-form__contents">
              <Grid item xs={9}>
                <FormControl
                  fullWidth
                  error={this.state.product_search_error !== ''}
                >
                  <Input
                    id="product_search"
                    value={this.state.product_search}
                    placeholder="품명으로 검색"
                    onChange={this.onInputChange('product_search')}
                  />
                  <FormHelperText id="product_search">
                    {this.state.product_search_error}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={this.searchProduct.bind(this)}
                >
                  검색
                </Button>
              </Grid>
              <Grid item xs={12}>
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

              <Grid
                item
                xs={12}
                className="plate-form__product_search_result"
              >
                {this.state.product_search_result.length ? (
                  this.renderSearchResult()
                ) : (
                  <span>검색된 품목이 없습니다.</span>
                )}
              </Grid>
            </Grid>
          )}
        </form>
        {/* {this.state.isReviewOpen && (
          <ProductReview
            data={this.state}
            open={this.state.isReviewOpen}
            onClose={this.onReviewClose.bind(this)}
            title={`${title} 확인`}
          />
        )} */}
      </FullScreenDialog>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  return { auth };
};

export default connect(mapStateToProps)(PlateForm);

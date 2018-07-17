import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAccountNames } from '../../actions';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
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
import ProductReview from '../../components/ProductReview/ProductReview';
import './ProductForm.css';
import { SECTIONS, REQUIRED, INITIAL_STATE } from './constants';

class ProductForm extends Component {
  state = INITIAL_STATE;

  componentDidMount() {
    const { auth, productId, accounts, products } = this.props;
    const token = auth.userToken;
    this.props.fetchAccountNames(token);
    // if (productId !== '') {
    //   const product = products.current.find(({ id }) => id === productId);
    //   Object.keys(product).forEach(key => {
    //     if (product[key] === null) delete product[key];
    //   });
    //   this.setState(Object.assign({}, INITIAL_STATE, product));
    // }
  }

  onClickOk = () => {
    if (this.validate()) {
      this.setState({
        isReviewOpen: true,
        account_name_error: '',
        product_name_error: '',
        product_thick_error: '',
        product_length_error: '',
        product_width_error: '',
        ext_color_error: ''
      });
    }
  };

  validate = name => {
    let isValid = true;

    // check required field
    if (name) {
      REQUIRED.forEach(({ varName, error }) => {
        if (varName === name && this.state[varName] === '') {
          this.setState({ [`${varName}_error`]: error });
        } else if (varName === name && this.state[varName] !== '') {
          this.setState({ [`${varName}_error`]: '' });
        }
      });
    } else {
      REQUIRED.forEach(({ varName, error }) => {
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
    } else if (event.target.type === 'file') {
      const reader = new FileReader();
      reader.onload = e => {
        this.setState({ print_image_preview: e.target.result });
      };
      reader.readAsDataURL(event.target.files[0]);
      value = event.target.value;
      this.setState({ print_image_file: event.target.files[0] });
    } else {
      value = event.target.value;
    }

    switch (name) {
      case 'account_name':
        const account_id = this.props.accounts.names.filter(
          ({ account_name }) => account_name === value
        )[0].id;
        this.setState({ account_id });
        break;

      case 'is_print':
        if (value === 'is_print_false') {
          this.setState({
            ext_pretreat: '',
            print_front_color_count: 0,
            print_front_color: '',
            print_front_position: '',
            print_back_color_count: 0,
            print_back_color: '',
            print_back_position: '',
            print_image_url: '',
            print_memo: ''
          });
        } else if (value === 'is_print_true') {
          this.setState({ ext_pretreat: 'single' });
        }
        break;

      case 'ext_pretreat':
        if (value === 'single') {
          this.setState({
            print_back_color_count: 0,
            print_back_color: '',
            print_back_position: ''
          });
        }
        break;

      case 'cut_is_punched':
        if (value === false) {
          this.setState({
            cut_punch_count: 0,
            cut_punch_size: '',
            cut_punch_position: ''
          });
        }
        break;

      default:
        break;
    }

    this.setState({ [name]: value }, () => {
      this.validate(name);
    });
  };

  onReviewClose = result => {
    this.setState({ isReviewOpen: false });
    console.log(this.state);
    let data = new FormData();
    if (result) {
      data = {
        // basic info
        account_id: this.state.account_id,
        product_name: this.state.product_name,
        product_thick: this.state.product_thick,
        product_length: this.state.product_length,
        product_width: this.state.product_width,
        is_print: this.state.is_print === 'is_print_true',

        // extrusion
        ext_color: this.state.ext_color,
        ext_antistatic: this.state.ext_antistatic,
        ext_pretreat: this.state.ext_pretreat,
        ext_memo: this.state.ext_memo,

        // printing
        print_front_color_count: this.state.print_front_color_count,
        print_front_color: this.state.print_front_color,
        print_front_position: this.state.print_front_position,
        print_back_color_count: this.state.print_back_color_count,
        print_back_color: this.state.print_back_color,
        print_back_position: this.state.print_back_position,
        print_image_file: this.state.print_image_file,
        print_image_url: this.state.print_image_url,
        print_memo: this.state.print_memo,

        // cutting
        cut_position: this.state.cut_position,
        cut_ultrasonic: this.state.cut_ultrasonic,
        cut_powder_pack: this.state.cut_powder_pack,
        cut_is_punched: this.state.cut_is_punched,
        cut_punch_count: this.state.cut_punch_count,
        cut_punch_size: this.state.cut_punch_size,
        cut_punch_position: this.state.cut_punch_position,
        cut_memo: this.state.cut_memo,

        // packaging
        pack_material: this.state.pack_material,
        pack_unit: this.state.pack_unit,
        pack_deliver_all: this.state.pack_deliver_all,
        pack_memo: this.state.pack_memo,

        // for manager
        unit_price: this.state.unit_price,
        product_memo: this.state.product_memo
      };
    }

    // fetch('http://localhost:3000/products/add', {
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //     'x-access-token': this.props.auth.userToken
    //   },
    //   method: 'post',
    //   body: JSON.stringify([data])
    // }).then(response => response.json())
    // .then(console.log)

    console.log(data);

    // if (result) {
    //   this.setState(INITIAL_STATE);
    //   this.props.onClose(true, data, this.state.id);
    // }
  };

  renderSections = () => {
    return SECTIONS.map(({ title, fields }) => {
      if (title === '인쇄' && this.state.is_print === 'is_print_false') {
        return undefined;
      }

      return (
        <div className="product-form__section" key={title}>
          <div className="product-form__section-title">
            <Typography variant="title">{title}</Typography>
          </div>
          <div className="product-form__section-content">
            <Grid container spacing={24}>
              {this.renderFields(fields)}
            </Grid>
          </div>
        </div>
      );
    });
  };

  renderFields = fields => {
    return fields.map(
      ({ type, varName, displayName, options, xs, sm, md, lg, multiline }) => {
        const error = this.state[`${varName}_error`];

        let disabled;
        switch (varName) {
          case 'ext_pretreat':
            disabled = this.state.is_print === 'is_print_false';
            break;

          case 'print_back_color_count':
          case 'print_back_color':
          case 'print_back_position':
            disabled = this.state.ext_pretreat !== 'double';
            break;

          case 'cut_punch_count':
          case 'cut_punch_size':
          case 'cut_punch_position':
            disabled = this.state.cut_is_punched === false;
            break;

          default:
            break;
        }

        if (type === 'radio') {
          return (
            <Grid item xs={xs} sm={sm} md={md} lg={lg} key={varName}>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label={varName}
                  name={varName}
                  className={`product-form__${varName}`}
                  value={this.state[varName]}
                  onChange={this.onInputChange(varName)}
                >
                  {options.map(({ value, label }) => {
                    return (
                      <FormControlLabel
                        key={value}
                        value={value}
                        control={<Radio color="primary" />}
                        disabled={disabled}
                        label={label}
                      />
                    );
                  })}
                </RadioGroup>
              </FormControl>
            </Grid>
          );
        } else if (type === 'checkbox') {
          return (
            <Grid item xs={xs} sm={sm} md={md} lg={lg} key={varName}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state[varName]}
                    onChange={this.onInputChange(varName)}
                    color="primary"
                  />
                }
                label={displayName}
              />
            </Grid>
          );
        } else if (type === 'file') {
          return (
            <Grid item xs={xs} sm={sm} md={md} lg={lg} key={varName}>
              <Input
                fullWidth
                type="file"
                id={varName}
                value={this.state[varName]}
                onChange={this.onInputChange(varName)}
              />
            </Grid>
          );
        } else if (varName === 'account_name') {
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
                  inputProps={{
                    name: varName,
                    id: varName
                  }}
                >
                  {this.props.accounts.names.map(({ id, account_name }) => {
                    return (
                      <MenuItem key={id} value={account_name}>
                        {account_name}
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
            <FormControl
              fullWidth
              disabled={disabled}
              error={error !== undefined && error !== ''}
            >
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
        <form className="full-screen-form">{this.renderSections()}</form>
        {this.state.isReviewOpen && (
          <ProductReview
            data={this.state}
            open={this.state.isReviewOpen}
            onClose={this.onReviewClose.bind(this)}
            title={`${title} 확인`}
          />
        )}
      </FullScreenDialog>
    );
  }
}

const mapStateToProps = ({ auth, accounts, products }) => {
  return { auth, accounts, products };
};

export default connect(
  mapStateToProps,
  { fetchAccountNames }
)(ProductForm);

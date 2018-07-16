import React, { Component } from 'react';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Checkbox from '@material-ui/core/Checkbox';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FullScreenDialog from '../../components/FullScreenDialog/FullScreenDialog';
// import AccountReview from '../../components/AccountReview/AccountReview';
import './ProductForm.css';

const SECTIONS = [
  {
    title: '기본정보',
    fields: [
      { varName: 'account_name', displayName: '업체명', xs: 12, sm: 5, lg: 3 },
      { varName: 'product_name', displayName: '품명', xs: 12, sm: 7, lg: 4 },
      { varName: 'product_thick', displayName: '두께', xs: 4, sm: 3, lg: 1 },
      {
        varName: 'product_length',
        displayName: '길이(압출)',
        xs: 4,
        sm: 3,
        lg: 1
      },
      {
        varName: 'product_width',
        displayName: '너비(가공)',
        xs: 4,
        sm: 3,
        lg: 1
      },
      {
        type: 'radio',
        varName: 'is_print',
        options: [
          { value: 'is_print_false', label: '무지' },
          { value: 'is_print_true', label: '인쇄' }
        ],
        xs: 12,
        sm: 3,
        lg: 2
      }
    ]
  },
  {
    title: '압출',
    fields: [
      { varName: 'ext_color', displayName: '압출색상', xs: 12, sm: 7, lg: 3 },
      {
        type: 'radio',
        varName: 'ext_pretreat',
        options: [
          { value: 'single', label: '단면' },
          { value: 'double', label: '양면' }
        ],
        xs: 7,
        sm: 3,
        lg: 2
      },
      {
        type: 'checkbox',
        varName: 'ext_antistatic',
        displayName: '대전방지',
        xs: 5,
        sm: 2,
        lg: 2
      },
      {
        varName: 'ext_memo',
        displayName: '압출메모',
        xs: 12,
        lg: 5,
        multiline: true
      }
    ]
  },
  {
    title: '인쇄',
    fields: [
      {
        varName: 'print_front_color_count',
        displayName: '전면도수',
        xs: 4,
        sm: 2
      },
      { varName: 'print_front_color', displayName: '전면색상', xs: 8, sm: 4 },
      {
        varName: 'print_front_position',
        displayName: '전면인쇄위치',
        xs: 12,
        sm: 6
      },
      {
        varName: 'print_back_color_count',
        displayName: '후면도수',
        xs: 4,
        sm: 2
      },
      { varName: 'print_back_color', displayName: '후면색상', xs: 8, sm: 4 },
      {
        varName: 'print_back_position',
        displayName: '후면인쇄위치',
        xs: 12,
        sm: 6
      },
      {
        varName: 'print_memo',
        displayName: '인쇄메모',
        xs: 12,
        multiline: true
      }
    ]
  },
  {
    title: '가공',
    fields: [
      {
        varName: 'cut_position',
        displayName: '가공위치',
        xs: 12,
        sm: 7,
        lg: 6
      },
      {
        type: 'checkbox',
        varName: 'cut_ultrasonic',
        displayName: '초음파가공',
        xs: 6,
        sm: 3,
        lg: 2
      },
      {
        type: 'checkbox',
        varName: 'cut_powder_pack',
        displayName: '가루포장',
        xs: 6,
        sm: 2,
        lg: 2
      },
      {
        type: 'checkbox',
        varName: 'cut_is_punched',
        displayName: '바람구멍',
        xs: 12,
        sm: 2,
        lg: 2
      },
      {
        varName: 'cut_punch_count',
        displayName: '바람구멍개수',
        xs: 4,
        sm: 2,
        lg: 2
      },
      {
        varName: 'cut_punch_size',
        displayName: '바람구멍크기',
        xs: 8,
        sm: 3,
        lg: 2
      },
      {
        varName: 'cut_punch_position',
        displayName: '바람구멍위치',
        xs: 12,
        sm: 5,
        lg: 3
      },
      {
        varName: 'cut_memo',
        displayName: '가공메모',
        xs: 12,
        lg: 5,
        multiline: true
      }
    ]
  },
  {
    title: '포장',
    fields: [
      {
        varName: 'pack_material',
        displayName: '포장방법',
        xs: 5,
        sm: 6,
        lg: 3
      },
      { varName: 'pack_unit', displayName: '포장단위', xs: 3, sm: 4, lg: 2 },
      {
        type: 'checkbox',
        varName: 'pack_deliver_all',
        displayName: '전량납',
        xs: 4,
        sm: 2,
        lg: 2
      },
      {
        varName: 'cut_memo',
        displayName: '포장메모',
        xs: 12,
        lg: 5,
        multiline: true
      }
    ]
  },
  {
    title: '참고사항',
    fields: [
      { varName: 'unit_price', displayName: '단가', xs: 12, lg: 7 },
      {
        varName: 'product_memo',
        displayName: '메모',
        xs: 12,
        lg: 5,
        multiline: true
      }
    ]
  }
];

const REQUIRED = [
  {
    varName: 'account_name',
    displayName: '업체명',
    error: '업체명을 입력하세요.'
  },
  { varName: 'product_name', displayName: '품명', error: '품명을 입력하세요.' },
  {
    varName: 'product_thick',
    displayName: '두께',
    error: '두께를 입력하세요.'
  },
  {
    varName: 'product_length',
    displayName: '길이(압출)',
    error: '길이(압출)를 입력하세요.'
  },
  {
    varName: 'product_width',
    displayName: '너비(가공)',
    error: '너비(가공)를 입력하세요.'
  },
  {
    varName: 'ext_color',
    displayName: '원단색상',
    error: '원단색상을 입력하세요.'
  }
];

const INITIAL_STATE = {
  isReviewOpen: false,
  currentTab: 0,

  // inputs
  // basic info
  account_id: '',
  account_name: '',
  product_name: '',
  product_thick: '',
  product_length: '',
  product_width: '',
  is_print: 'is_print_false',

  // extrusion
  ext_color: '',
  ext_antistatic: false,
  ext_pretreat: '', // 없음: '', 단면: 'single', 양면: 'double'
  ext_memo: '',

  // printing
  print_front_color_count: 0,
  print_front_color: '',
  print_front_position: '',
  print_back_color_count: 0,
  print_back_color: '',
  print_back_position: '',
  print_image_url: '',
  print_memo: '',

  // cutting
  cut_position: '',
  cut_ultrasonic: false,
  cut_powder_pack: false,
  cut_is_punched: false,
  cut_punch_count: 0,
  cut_punch_size: '',
  cut_punch_position: '',
  cut_memo: '',

  // packaging
  pack_material: '',
  pack_unit: 0,
  pack_deliver_all: false,
  pack_memo: '',

  // for manager
  unit_price: 0,
  product_memo: '',

  // validation errors
  account_name_error: '',
  product_name_error: '',
  product_thick_error: '',
  product_length_error: '',
  product_width_error: '',
  ext_color_error: ''
};

class ProductForm extends Component {
  state = INITIAL_STATE;

  componentDidMount() {
    const { productId, products } = this.props;
    console.log(productId, products);
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
        account_id_error: '',
        product_name_error: '',
        product_thick_error: '',
        product_length_error: '',
        product_width_error: '',
        ext_color_error: ''
      });
    }
  };

  validate = () => {
    let isValid = true;

    // check required field
    REQUIRED.forEach(({ varName, displayName, error }) => {
      if (this.state[varName] === '') {
        this.setState({ [`${varName}_error`]: error });
        isValid = isValid && false;
      }
    });

    return isValid;
  };

  onInputChange = name => event => {
    let value;

    if (event.target.type === 'checkbox') {
      value = event.target.checked;
    } else {
      value = event.target.value;
    }

    switch (name) {
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

      case 'cut_is_punched':
        if (value === false) {
          this.setState({
            cut_punch_count: 0,
            cut_punch_size: '',
            cut_punch_position: ''
          });
        }

      default:
        break;
    }

    this.setState({ [name]: value });
  };

  onReviewClose = result => {
    this.setState({ isReviewOpen: false });
    // if (result) {
    //   const data = {
    //     account_name: this.state.account_name,
    //     reg_no: this.state.reg_no,
    //     phone: this.state.phone,
    //     fax: this.state.fax,
    //     email: this.state.email,
    //     email_tax: this.state.email_tax,
    //     address: this.state.address,
    //     account_memo: this.state.account_memo,
    //     ceo_name: this.state.ceo_name,
    //     ceo_phone: this.state.ceo_phone,
    //     ceo_email: this.state.ceo_email,
    //     manager_name: this.state.manager_name,
    //     manager_phone: this.state.manager_phone,
    //     manager_email: this.state.manager_email
    //   };
    //
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
        {/* {this.state.isReviewOpen && (
          <AccountReview
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

const mapStateToProps = ({ products }) => {
  return { products };
};

export default connect(mapStateToProps)(ProductForm);

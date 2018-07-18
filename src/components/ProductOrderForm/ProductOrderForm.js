import React, { Component } from 'react';
import moment from 'moment';
import { DatePicker } from 'material-ui-pickers';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputAdornment from '@material-ui/core/InputAdornment';
import FullScreenDialog from '../../components/FullScreenDialog/FullScreenDialog';
import { PRODUCT_DETAIL_SECTIONS } from '../../helpers/constants';
import './ProductOrderForm.css';

class ProductOrderForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      product: props.product,

      ordered_at: moment(),
      deliver_by: moment().add(10, 'days'),
      order_quantity: '',
      is_delivery_strict: false,
      is_urgent: false,
      order_memo_work: '',
      order_memo_delivery: '',

      order_quantity_error: '',
    }

    this.onClickOk = this.onClickOk.bind(this);
  }

  componentDidMount() {

  }

  onClickOk = () => {
    console.log('ok! proceed!');
  }

  renderProductFields = (fields, data) =>
    fields.map(({ varName, displayName }) => {
      let value;

      switch (varName) {
        case 'product_size':
          value = `${data.product_thick} x ${data.product_length} x ${
            data.product_width
          }`;
          break;
        case 'is_print':
          value = data.is_print === 'is_print_true' ? '인쇄' : '무지';
          break;
        case 'ext_pretreat':
          value =
            data.ext_pretreat === 'single'
              ? '단면'
              : data.ext_pretreat === 'double'
                ? '양면'
                : '';
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
        if (varName === 'print_image_preview') {
          return (
            <div key={displayName} className="product-order-form__row">
              <span className="product-order-form__name">{displayName}</span>
              <span className="product-order-form__value">
                <Button
                  fullWidth
                  variant="contained"
                  onClick={event => {
                    this.setState({ anchorEl: event.target });
                  }}
                >
                  도안보기
                </Button>
                <Popover
                  className="product-order-form__image-container"
                  open={Boolean(this.state.anchorEl)}
                  anchorEl={this.state.anchorEl}
                  onClose={() => {
                    this.setState({ anchorEl: null });
                  }}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                  }}
                  transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                  }}
                >
                  <img
                    className="product-order-form__image"
                    src={value || data.print_image_url}
                    alt={displayName}
                    onClick={() => {
                      this.setState({ anchorEl: null });
                    }}
                  />
                </Popover>
              </span>
            </div>
          );
        }

        return (
          <div key={displayName} className="product-order-form__row">
            <span className="product-order-form__name">{displayName}</span>
            <span className="product-order-form__value">{value}</span>
          </div>
        );
      } else return undefined;
    });

  renderProductSection = () => {
    const { product } = this.props;
    return PRODUCT_DETAIL_SECTIONS.map(({ title, fields }) => {
      const hasInfo =
        fields
          .map(({ varName }) => !!product[varName])
          .filter(value => value === true).length > 0;

      if (hasInfo) {
        return (
          <Grid item xs={12} md={6} key={title}>
            <h2 className="product-order-form__title">{title}</h2>
            {this.renderProductFields(fields, product)}
          </Grid>
        );
      } else return undefined;
    });
  }

  renderOrderSection = () => {

  }

  onInputChange = name => event => {
    console.log(name, event.target.value);

    let value;
    if (event.target.type === 'checkbox') {
      value = event.target.checked;
    } else {
      value = event.target.value;
    }

    this.setState({ [name]: value });
  }

  // table.timestamp('ordered_at').notNullable();
  //           table.timestamp('order_modified_at');
  //           table.boolean('is_order_modified').defaultTo(false);
  //           table.integer('account_id').notNullable();
  //           table.integer('product_id').notNullable();
  //           table.integer('order_quantity').notNullable();
  //           table.float('order_quantity_weight').notNullable();
  //           table.string('plate_status'); // 신규, 수정, 확인
  //           table.boolean('is_plate_ready').defaultTo(true);
  //           table.string('order_status').defaultTo('압출중'); // 압출중, 인쇄중, 가공중, 완료
  //           table.timestamp('deliver_by').notNullable();
  //           table.boolean('is_delivery_strict').defaultTo(false);
  //           table.boolean('is_urgent').defaultTo(false);
  //           table.text('order_memo_work');
  //           table.text('order_memo_delivery');
  //           table.boolean('is_completed').defaultTo(false);
  //           table.timestamp('completed_at');
  //           table.integer('completed_quantity');
  //           table.boolean('is_delivered').defaultTo(false);
  //           table.timestamp('delivered_at');

  render() {
    const { open, onClose } = this.props;
    return (
      <FullScreenDialog
        open={open}
        onClose={onClose}
        title="작업지시"
        Buttons={
          <Button color="inherit" onClick={this.onClickOk.bind(this)}>
            <Icon>check</Icon>
            <span> 저장</span>
          </Button>
        }
      >
        <form className="full-screen-form">
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="title">품목정보</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container spacing={24}>
                {this.renderProductSection()}
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel defaultExpanded>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="title">주문정보</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container spacing={24}>
                <Grid item xs={6}>
                  <DatePicker
                    className="product-order-form__datepicker"
                    keyboard
                    label="발주일"
                    format="YYYY/MM/DD"
                    disableFuture={true}
                    mask={value => (value ? [/\d/, /\d/, /\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/] : [])}
                    value={this.state.ordered_at}
                    onChange={date => { this.setState({ ordered_at: date }) }}
                    disableOpenOnEnter
                    animateYearScrolling={false}
                  />
                </Grid>
                <Grid item xs={6}>
                  <DatePicker
                    keyboard
                    className="product-order-form__datepicker"
                    label="납기일"
                    format="YYYY/MM/DD"
                    disablePast={true}
                    mask={value => (value ? [/\d/, /\d/, /\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/] : [])}
                    value={this.state.deliver_by}
                    onChange={date => { this.setState({ deliver_by: date }) }}
                    disableOpenOnEnter
                    animateYearScrolling={false}
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormControl
                    fullWidth
                    error={this.state.order_quantity_error !== ''}
                  >
                    <InputLabel htmlFor="order_quantity">주문수량</InputLabel>
                    <Input
                      id="order_quantity"
                      value={this.state.order_quantity}
                      onChange={this.onInputChange('order_quantity')}
                      endAdornment={
                        <InputAdornment position="end">
                          매
                        </InputAdornment>
                      }
                    />
                    <FormHelperText id="order_quantity">{this.state.order_quantity_error}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.is_delivery_strict}
                        onChange={this.onInputChange('is_delivery_strict')}
                        color="primary"
                      />
                    }
                    label="엄수"
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.is_urgent}
                        onChange={this.onInputChange('is_urgent')}
                        color="primary"
                      />
                    }
                    label="지급"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="order_memo_work">작업참고</InputLabel>
                    <Input
                      id="order_memo_work"
                      value={this.state.order_memo_work}
                      onChange={this.onInputChange('order_memo_work')}
                      multiline
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="order_memo_delivery">납품참고</InputLabel>
                    <Input
                      id="order_memo_delivery"
                      value={this.state.order_memo_delivery}
                      onChange={this.onInputChange('order_memo_delivery')}
                      multiline
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </form>
        {/* {this.state.isReviewOpen && (
          <ProductOrderReview
            data={this.state}
            open={this.state.isReviewOpen}
            onClose={this.onReviewClose.bind(this)}
            title="작업지시 확인"
          />
        )} */}
      </FullScreenDialog>
    )
  }
}

export default ProductOrderForm;

import React from 'react';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import Popover from '@material-ui/core/Popover';
import FullScreenDialog from '../../components/FullScreenDialog/FullScreenDialog';
import './ProductReview.css';
import { PRODUCT_DETAIL_SECTIONS } from '../../helpers/constants';

class ProductReview extends React.Component {
  state = {
    anchorEl: null
  };

  renderFields = (fields, data) =>
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
            <div key={displayName} className="product-review__row">
              <span className="product-review__name">{displayName}</span>
              <span className="product-review__value">
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
                  className="product-review__image-container"
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
                    className="product-review__image"
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
          <div key={displayName} className="product-review__row">
            <span className="product-review__name">{displayName}</span>
            <span className="product-review__value">{value}</span>
          </div>
        );
      } else return undefined;
    });

  renderSections = data =>
    PRODUCT_DETAIL_SECTIONS.map(({ title, fields }) => {
      const hasInfo =
        fields
          .map(({ varName }) => !!data[varName])
          .filter(value => value === true).length > 0;

      if (hasInfo) {
        return (
          <Grid item xs={12} md={6} key={title}>
            <h2 className="product-review__title">{title}</h2>
            {this.renderFields(fields, data)}
          </Grid>
        );
      } else return undefined;
    });

  render() {
    const { data, open, onClose, title } = this.props;
    return (
      <FullScreenDialog
        open={open}
        onClose={() => {
          onClose(false);
        }}
        closeIcon="navigate_before"
        title={title}
        Buttons={
          <Button
            color="inherit"
            onClick={() => {
              onClose(true);
            }}
          >
            <Icon>check</Icon>
            <span> 완료</span>
          </Button>
        }
      >
        <form className="full-screen-form">
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <p className="product-review__message">
                입력하신 정보를 확인하세요.
              </p>
            </Grid>
            {this.renderSections(data)}
          </Grid>
        </form>
      </FullScreenDialog>
    );
  }
}

export default ProductReview;

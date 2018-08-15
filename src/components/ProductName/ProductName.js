import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import { highlight } from '../../helpers/highlight';
import CustomModal from '../../components/CustomModal/CustomModal';
import './ProductName.css';
import { PRODUCT_DETAIL_SECTIONS } from '../../helpers/constants';

class ProductName extends Component {
  state = {
    isDetailViewOpen: false,
    anchorEl: null
  };

  showDetailView = () => {
    this.setState({ isDetailViewOpen: true });
  };

  hideDetailView = () => {
    this.setState({ isDetailViewOpen: false });
  };

  renderSections = data =>
    PRODUCT_DETAIL_SECTIONS.map(({ title, fields }) => {
      const hasInfo =
        fields
          .map(({ varName }) => !!data[varName])
          .filter(value => value === true).length > 0;

      if (hasInfo) {
        return (
          <Grid item xs={12} md={6} key={title}>
            <h2 className="detail-view__subtitle">{title}</h2>
            {this.renderFields(fields, data)}
          </Grid>
        );
      } else if (title === '작업이력') {
        return (
          <Grid item xs={12} md={6} key={title}>
            <h2 className="detail-view__subtitle">{title}</h2>
            {this.renderHistory(data)}
          </Grid>
        );
      } else {
        return undefined;
      }
    });

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
        case 'print_image_preview':
          value = data.print_image_url;
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
            <div key={displayName} className="detail-view__row">
              <span className="detail-view__name">{displayName}</span>
              <span className="detail-view__value">
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
                  className="detail-view__image-container"
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
                    className="detail-view__image"
                    src={data.print_image_url}
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
          <div key={displayName} className="detail-view__row">
            <span className="detail-view__name">{displayName}</span>
            <span className="detail-view__value">{value}</span>
          </div>
        );
      } else return undefined;
    });

  renderHistory = data => {
    /*TODO: display history on product detail view */
    console.log(data.old_history);
    return <div className="detail-view__row">History</div>;
  };

  render() {
    const { product, searchTerm, className } = this.props;

    const productName = highlight(product.product_name, searchTerm);

    return (
      <div>
        <a
          className={`product-name ${className}`}
          onClick={this.showDetailView.bind(this)}
          dangerouslySetInnerHTML={{ __html: productName }}
        />
        {this.state.isDetailViewOpen && (
          <CustomModal
            className="product-detail-view"
            title="품목 상세 정보"
            open={this.state.isDetailViewOpen}
            onClose={this.hideDetailView.bind(this)}
            Buttons={
              <Button
                variant="contained"
                color="primary"
                onClick={this.hideDetailView.bind(this)}
              >
                확인
              </Button>
            }
          >
            <div className="product-detail-view__contents">
              {this.renderSections(product)}
            </div>
          </CustomModal>
        )}
      </div>
    );
  }
}

export default ProductName;

import React, { Component } from 'react';
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { highlight } from '../../helpers/highlight';
import './PlateSize.css';

const FIELDS = [
  { varName: 'plate_size', displayName: '규격' },
  { varName: 'plate_material', displayName: '재질' },
  { varName: 'storage_location', displayName: '보관위치' },
  { varName: 'products', displayName: '사용품목' },
  { varName: 'memo', displayName: '메모' }
];

class PlateSize extends Component {
  state = {
    isDetailViewOpen: false
  };

  showDetailView = () => {
    this.setState({ isDetailViewOpen: true });
  };

  hideDetailView = () => {
    this.setState({ isDetailViewOpen: false });
  };

  renderFields = () => {
    const { plate } = this.props;
    return FIELDS.map(({ varName, displayName }) => {
      let value = '';
      switch (varName) {
        case 'plate_size':
          value = `${plate.plate_round} x ${plate.plate_length}`;
          break;

        case 'products':
          for (let i = 1; i < 4; i++) {
            if (plate[`product_${i}`]) {
              let name = plate[`product_${i}_name`];
              let thick = plate[`product_${i}_thick`];
              let length = plate[`product_${i}_length`];
              let width = plate[`product_${i}_width`];
              value += `
                <span class="plate-detail-view__product">
                  <span class="plate-detail-view__product-name">
                    ${name}
                  </span>
                  <span class="plate-detail-view__product-size">
                     (${thick} x ${length} x ${width})
                  </span>
                </span>
              `;
            }
          }
          break;

        default:
          value = plate[varName];
          break;
      }

      if (value) {
        return (
          <Grid item xs={12} key={varName} className="detail-view__row">
            <span className="detail-view__name">{displayName}</span>
            {varName === 'products' ? (
              <span
                className="detail-view__value"
                dangerouslySetInnerHTML={{ __html: value }}
              />
            ) : (
              <span className="detail-view__value">{value}</span>
            )}
          </Grid>
        );
      }

      return undefined;
    });
  };

  render() {
    const { plate, search, className } = this.props;

    const plateRound = highlight(plate.plate_round, search.plate_round);
    const plateLength = highlight(plate.plate_length, search.plate_length);
    const plateSize = `${plateRound} x ${plateLength}`;

    return (
      <div>
        <a
          className={`plate-size ${className}`}
          onClick={this.showDetailView.bind(this)}
          dangerouslySetInnerHTML={{ __html: plateSize }}
        />
        {this.state.isDetailViewOpen && (
          <Modal
            className="detail-view__bg"
            aria-labelledby="plate-detail-view"
            open={this.state.isDetailViewOpen}
            onClose={this.hideDetailView.bind(this)}
          >
            <div className="detail-view plate-detail-view">
              <Grid container>
                <Grid item xs={12} className="detail-view__title">
                  <h1>동판 상세 정보</h1>
                </Grid>
                <Grid item xs={12}>
                  {this.renderFields()}
                </Grid>
                <Grid item xs={12} className="detail-view__buttons">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.hideDetailView.bind(this)}
                  >
                    확인
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Modal>
        )}
      </div>
    );
  }
}

export default PlateSize;

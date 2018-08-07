import React, { Component } from 'react';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import CustomDatePicker from '../../components/CustomDatePicker/CustomDatePicker';
import './OrderSearch.css';

const SEARCH_FIELDS = [
  { varName: 'date_from', displayName: '검색시작일', xs: 6, sm: 3, lg: 2 },
  { varName: 'date_to', displayName: '검색종료일', xs: 6, sm: 3, lg: 2 },
  { varName: 'date_presets', xs: 12, sm: 6, lg: 8 },
  { varName: 'account_name', displayName: '업체명', xs: 6, md: 5, lg: 3 },
  { varName: 'product_name', displayName: '품명', xs: 6, md: 7, lg: 4 },
  { varName: 'product_thick', displayName: '두께', xs: 4, sm: 3, lg: 1 },
  { varName: 'product_length', displayName: '길이(압출)', xs: 4, sm: 3, lg: 1 },
  { varName: 'product_width', displayName: '너비(가공)', xs: 4, sm: 3, lg: 1 },
  {
    varName: 'show_completed',
    displayName: '완료품목 표시',
    xs: 12,
    sm: 3,
    lg: 2
  }
];

class OrderSearch extends Component {

  onDateChange = (varName, date) => {
    let { date_from, date_to } = this.props.searchValues;
    if (varName === 'date_from') {
      date_from = date;
      if (date > date_to) date_to = date;
    } else if (varName === 'date_to') {
      date_to = date;
      if (date < date_from) date_from = date;
    }

    this.props.onDateChange(date_from, date_to);
  };

  onDatePresetClick = (number, string) => {
    const date_from = moment().subtract(number, string);
    const date_to = moment();

    this.props.onDateChange(date_from, date_to);
  };

  renderFields = (searchValues) => {
    return SEARCH_FIELDS.map(({ varName, displayName, xs, sm, md, lg }) => {
      switch (varName) {
        case 'date_from':
        case 'date_to':
          return (
            <Grid item xs={xs} sm={sm} md={md} lg={lg} key={varName}>
              <CustomDatePicker
                id={varName}
                label={displayName}
                value={searchValues[varName]}
                onChange={date => {
                  this.onDateChange(varName, date);
                }}
              />
            </Grid>
          );

        case 'date_presets':
          return (
            <Grid
              item
              xs={xs}
              sm={sm}
              md={md}
              lg={lg}
              key={varName}
              className="order-search__preset-buttons"
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  this.onDatePresetClick(0, 'days');
                }}
              >
                오늘
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  this.onDatePresetClick(2, 'weeks');
                }}
              >
                2주
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  this.onDatePresetClick(1, 'months');
                }}
              >
                1개월
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  this.onDatePresetClick(3, 'months');
                }}
              >
                3개월
              </Button>
            </Grid>
          );

        case 'show_completed':
          return (
            <Grid item xs={xs} sm={sm} md={md} lg={lg} key={varName}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={searchValues[varName]}
                    onChange={event => {
                      this.props.onInputChange(varName, event.target.checked);
                    }}
                  />
                }
                label={displayName}
              />
            </Grid>
          );

        default:
          return (
            <Grid item xs={xs} sm={sm} md={md} lg={lg} key={varName}>
              <TextField
                fullWidth
                id={varName}
                label={displayName}
                onChange={event => {
                  this.props.onInputChange(
                    varName,
                    event.target.value.toLowerCase()
                  );
                }}
                value={searchValues[varName]}
              />
            </Grid>
          );
      }
    });
  };

  render() {
    const { onReset, searchValues } = this.props;
    return (
      <Grid container spacing={24} className="search-wrapper">
        <Grid container spacing={16} className="search-inputs">
          {this.renderFields(searchValues)}
        </Grid>
        <Grid item className="search-buttons">
          <Tooltip title="초기화">
            <IconButton
              color="primary"
              aria-label="초기화"
              onClick={() => {
                SEARCH_FIELDS.forEach(({ varName }) => {
                  const target = document.getElementById(varName);
                  if (target) target.value = '';
                });

                onReset();
              }}
            >
              <Icon>refresh</Icon>
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    );
  }
}

export default OrderSearch;

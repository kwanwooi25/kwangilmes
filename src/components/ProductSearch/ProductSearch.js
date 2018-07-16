import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Hidden from '@material-ui/core/Hidden';
import './ProductSearch.css';

const SEARCH_FIELDS = [
  { varName: 'account_name', displayName: '업체명', xs: 6, lg: 2 },
  { varName: 'product_name', displayName: '품명', xs: 6, lg: 3 },
  { varName: 'product_thick', displayName: '두께', xs: 4, md: 2, lg: 1 },
  { varName: 'product_length', displayName: '길이(압출)', xs: 4, md: 2, lg: 1 },
  { varName: 'product_width', displayName: '너비(가공)', xs: 4, md: 2, lg: 1 }
];

const SEARCH_FIELDS_MD_UP = [
  { varName: 'ext_color', displayName: '원단색상', xs: 6, md: 3, lg: 2 },
  { varName: 'print_color', displayName: '인쇄색상', xs: 6, md: 3, lg: 2 }
];

const renderFields = (elements, onInputChange) => {
  return elements.map(({ varName, displayName, xs, sm, md, lg }) => {
    return (
      <Grid item xs={xs} sm={sm} md={md} lg={lg} key={varName}>
        <TextField
          fullWidth
          id={varName}
          label={displayName}
          onChange={event => {
            onInputChange(varName, event);
          }}
        />
      </Grid>
    );
  });
};

const renderFieldsMdUp = (elements, onInputChange) => {
  return elements.map(({ varName, displayName, xs, sm, md, lg }) => {
    return (
      <Hidden smDown key={varName}>
        <Grid item xs={xs} sm={sm} md={md} lg={lg}>
          <TextField
            fullWidth
            id={varName}
            label={displayName}
            onChange={event => {
              onInputChange(varName, event);
            }}
          />
        </Grid>
      </Hidden>
    );
  });
};

const ProductSearch = ({ onInputChange, onReset }) => {
  return (
    <Grid container>
      <Grid item xs={10} sm={11} className="product-search__inputs">
        <Grid container spacing={16}>
          {renderFields(SEARCH_FIELDS, onInputChange)}
          {renderFieldsMdUp(SEARCH_FIELDS_MD_UP, onInputChange)}
        </Grid>
      </Grid>
      <Grid item xs={2} sm={1} className="product-search__buttons">
        <Tooltip title="초기화">
          <IconButton
            color="primary"
            aria-label="초기화"
            onClick={() => {
              SEARCH_FIELDS.forEach(({ varName }) => {
                const target = document.getElementById(varName);
                if (target) target.value = '';
              });
              SEARCH_FIELDS_MD_UP.forEach(({ varName }) => {
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
};

export default ProductSearch;

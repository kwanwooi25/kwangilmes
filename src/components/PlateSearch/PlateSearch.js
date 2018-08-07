import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import './PlateSearch.css';

const SEARCH_FIELDS = [
  { varName: 'product_name', displayName: '품명', xs: 12, sm: 6 },
  { varName: 'plate_round', displayName: '둘레', xs: 6, sm: 3 },
  { varName: 'plate_length', displayName: '기장', xs: 6, sm: 3 }
];

const renderFields = (elements, onInputChange, searchValues) => {
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
          value={searchValues[varName]}
        />
      </Grid>
    );
  });
};

const PlateSearch = ({ onInputChange, onReset, searchValues }) => {
  return (
    <Grid container spacing={24} className="search-wrapper">
      <Grid container spacing={16} className="search-inputs">
        {renderFields(SEARCH_FIELDS, onInputChange, searchValues)}
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
};

export default PlateSearch;

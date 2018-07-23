import React from 'react';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import './PageHeader.css';

const PageHeader = ({ title, searchBox, onSearchChange, ToolButtons }) => {
  return (
    <Grid container className="page-header">
      <Grid item xs={4} sm={6} md={7}>
        <h2 className="page-header__title">{title}</h2>
      </Grid>
      <Grid item xs={8} sm={6} md={5} className="page-header__tools">
        <div className="page-header__search">
          {searchBox && onSearchChange && (
            <Input
              fullWidth
              id="page-header__search"
              type="text"
              onChange={(e) => { onSearchChange(e.target.value) }}
              startAdornment={
                <InputAdornment position="start">
                  <Icon>search</Icon>
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={() => {
                    document.getElementById('page-header__search').value = '';
                    onSearchChange('');
                  }}>
                    <Icon>clear</Icon>
                  </IconButton>
                </InputAdornment>
              }
            />
          )}
        </div>
        <div className="page-header__buttons">
          {ToolButtons}
        </div>
      </Grid>
    </Grid>
  );
};

export default PageHeader;

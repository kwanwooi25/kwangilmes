import React from 'react';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Icon from '@material-ui/core/Icon';
import './PageHeader.css';

const PageHeader = ({ title, searchBox, onSearchChange }) => {
  return (
    <div className="page-header">
      <h2 className="page-header__title">{title}</h2>
      {searchBox && onSearchChange && (
        <Input
          id="page-header__search"
          className="page-header__search"
          type="text"
          onChange={(e) => { onSearchChange(e.target.value) }}
          startAdornment={
            <InputAdornment position="start">
              <Icon>search</Icon>
            </InputAdornment>
          }
        />
      )}
    </div>
  );
};

export default PageHeader;

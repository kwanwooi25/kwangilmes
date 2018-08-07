import React from 'react';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import './PageHeader.css';

const PageHeader = ({
  title,
  searchBox,
  searchValue,
  onSearchChange,
  uploadButton,
  onUploadButtonClick,
  exportButton,
  onExportButtonClick
}) => {
  return (
    <Grid container className="page-header">
      <Grid item xs={4} sm={6} md={7}>
        <h2 className="page-header__title">{title}</h2>
      </Grid>
      <Grid item xs={8} sm={6} md={5} className="page-header__tools">
        <div className="page-header__search">
          {searchBox &&
            onSearchChange && (
              <Input
                fullWidth
                id="page-header__search"
                type="text"
                onChange={e => {
                  onSearchChange(e.target.value);
                }}
                value={searchValue}
                startAdornment={
                  <InputAdornment position="start">
                    <Icon>search</Icon>
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        document.getElementById('page-header__search').value =
                          '';
                        onSearchChange('');
                      }}
                    >
                      <Icon>clear</Icon>
                    </IconButton>
                  </InputAdornment>
                }
              />
            )}
        </div>
        <div className="page-header__buttons">
          {uploadButton && (
            <Tooltip title="엑셀 업로드">
              <IconButton
                aria-label="엑셀업로드"
                component="span"
                onClick={onUploadButtonClick}
              >
                <Icon>publish</Icon>
              </IconButton>
            </Tooltip>
          )}
          {exportButton && (
            <Tooltip title="엑셀 다운로드">
              <IconButton
                aria-label="엑셀다운로드"
                onClick={onExportButtonClick}
              >
                <Icon>save_alt</Icon>
              </IconButton>
            </Tooltip>
          )}
        </div>
      </Grid>
    </Grid>
  );
};

export default PageHeader;

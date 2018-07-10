import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import './ListHeader.css';

const ListHeader = ({
  rowsPerPage,
  isFirstPage,
  isLastPage,
  onRowsPerPageChange,
  onPageChange,
  onSelectAllChange
}) => {
  return (
    <div className="list-header">
      <div className="list-header__row">
        <FormControlLabel
          control={
            <Checkbox
              onChange={(e) => { onSelectAllChange(e.target.checked) }}
              color="primary"
            />
          }
          label="전체선택"
        />
        <Button variant="contained">전체삭제</Button>
      </div>
      <div className="list-header__row">
        <FormControl>
          <Select
            className="list-header__limit"
            native
            onChange={e => {
              onRowsPerPageChange(e.target.value);
            }}
            value={rowsPerPage}
            inputProps={{
              name: 'limit',
              id: 'limit'
            }}
          >
            <option value={5}>5개씩</option>
            <option value={10}>10개씩</option>
            <option value={20}>20개씩</option>
          </Select>
        </FormControl>
        <div className="paginator">
          <IconButton
            aria-label="first page"
            disabled={isFirstPage}
            onClick={() => {
              onPageChange('first');
            }}
          >
            <Icon>first_page</Icon>
          </IconButton>
          <IconButton
            aria-label="previous page"
            disabled={isFirstPage}
            onClick={() => {
              onPageChange('prev');
            }}
          >
            <Icon>navigate_before</Icon>
          </IconButton>
          <IconButton
            aria-label="next page"
            disabled={isLastPage}
            onClick={() => {
              onPageChange('next');
            }}
          >
            <Icon>navigate_next</Icon>
          </IconButton>
          <IconButton
            aria-label="last page"
            disabled={isLastPage}
            onClick={() => {
              onPageChange('last');
            }}
          >
            <Icon>last_page</Icon>
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default ListHeader;

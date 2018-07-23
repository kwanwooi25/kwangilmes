import React from 'react';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import './ListHeader.css';

const ListHeader = ({
  rowsPerPage,
  isFirstPage,
  isLastPage,
  onRowsPerPageChange,
  onPageChange,
  onDeleteAllClick,
  onSelectAllChange,
  selectAllDisabled,
  selectedCount,
  isSelectedAll,
  onCancelSelection,
  totalCount,
  offset,
  Buttons
}) => {
  return (
    <Grid container spacing={8} className="list-header">
      <Grid item xs={4} sm={2}>
        <FormControlLabel
          control={
            <Checkbox
              indeterminate={selectedCount > 0 && isSelectedAll === false}
              checked={isSelectedAll}
              disabled={selectAllDisabled}
              onChange={e => {
                onSelectAllChange(e.target.checked);
              }}
              color="primary"
            />
          }
          label="전체선택"
        />
      </Grid>
      <Grid item xs={8} sm={10} lg={4} className="list-header__selected">
        {selectedCount !== 0 && <span>{selectedCount}개 항목 선택됨</span>}
        {selectedCount !== 0 && (
          <div className="list-header__button-group">
            {Buttons}
            <Tooltip title="전체삭제">
              <IconButton aria-label="delete all" onClick={onDeleteAllClick}>
                <Icon>delete</Icon>
              </IconButton>
            </Tooltip>
            <Tooltip title="선택취소">
              <IconButton
                aria-label="cancel selection"
                onClick={onCancelSelection}
              >
                <Icon>clear</Icon>
              </IconButton>
            </Tooltip>
          </div>
        )}
      </Grid>
      <Grid item xs={4} lg={2} className="list-header__limit">
        <FormControl>
          <Select
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
      </Grid>
      <Grid item xs={8} lg={4} className="paginator">
        <div className="paginator__message">
          총
          <span>{totalCount}</span>
          개 중
          <span>
            {offset + 1}-{Math.min(rowsPerPage + offset, totalCount)}
          </span>
          번째 항목
        </div>
        <div className="paginator__buttons">
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
      </Grid>
    </Grid>
  );
};

export default ListHeader;

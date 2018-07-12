import React from 'react';
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
  selectedCount,
  isSelectedAll,
  onCancelSelection,
  totalCount,
  offset
}) => {
  return (
    <div className="list-header">
      <div className="list-header__row">
        <FormControlLabel
          control={
            <Checkbox
              indeterminate={selectedCount > 0 && isSelectedAll === false}
              checked={isSelectedAll}
              onChange={e => {
                onSelectAllChange(e.target.checked);
              }}
              color="primary"
            />
          }
          label="전체선택"
        />
        {selectedCount !== 0 && (
          <div className="list-header__has-selection">
            <p>{selectedCount}개 항목 선택됨</p>
            <div className="list-header__button-group">
              <Tooltip title="전체삭제">
                <IconButton
                  aria-label="delete all"
                  onClick={onDeleteAllClick}
                >
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
          </div>
        )}
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
        </div>
      </div>
    </div>
  );
};

export default ListHeader;

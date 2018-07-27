import React from 'react';
import Icon from '@material-ui/core/Icon';
import './NoData.css';

const NoData = () => {
  return (
    <div className="no-data">
      <Icon className="no-data-icon">highlight_off</Icon>
      <p className="no-data-text">표시할 내용이 없습니다.</p>
    </div>
  )
}

export default NoData;

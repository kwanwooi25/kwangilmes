import React from 'react';
import Typography from '@material-ui/core/Typography';
import './NoData.css';

const NoData = () => {
  return (
    <div className="no-data">
      <Typography variant="display2">표시할 내용이 없습니다.</Typography>
    </div>
  )
}

export default NoData;

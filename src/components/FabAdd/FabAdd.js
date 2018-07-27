import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import './FabAdd.css';

const FabAdd = ({ title, onClick }) => {
  return (
    <div className="fab-add">
      <Tooltip title={title}>
        <Button
          variant="fab"
          color="primary"
          aria-label={title}
          onClick={onClick}
        >
          <Icon>add</Icon>
        </Button>
      </Tooltip>
    </div>
  )
}

export default FabAdd;

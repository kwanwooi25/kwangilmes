import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import './FullScreenDialog.css';

const Transition = props => <Slide direction="left" {...props} />;

const FullScreenDialog = ({
  open,
  onClose,
  title,
  closeIcon = 'close',
  Buttons,
  children
}) => {
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={() => {
        onClose(false);
      }}
      TransitionComponent={Transition}
    >
      <AppBar className="form-header" position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => {
              onClose(false);
            }}
            aria-label="Close"
          >
            <Icon>{closeIcon}</Icon>
          </IconButton>
          <Typography
            className="form-header__title"
            variant="title"
            color="inherit"
          >
            {title}
          </Typography>
          {Buttons}
        </Toolbar>
      </AppBar>
      {children}
    </Dialog>
  );
};

export default FullScreenDialog;

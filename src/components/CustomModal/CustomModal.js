import React from 'react';
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';
import './CustomModal.css';

const CustomModal = ({ className, title, Buttons, open, onClose, children }) => {
  return (
    <Modal
      className="modal__bg"
      aria-labelledby={className}
      open={open}
      onClose={onClose}
    >
      <div className={`modal ${className}`}>
        <Grid container>
          <Grid item xs={12} className="modal__title">
            <h1>{title}</h1>
          </Grid>
          <Grid item xs={12} className="modal__contents">
            {children}
          </Grid>
          <Grid item xs={12} className="modal__buttons">
            {Buttons}
          </Grid>
        </Grid>
      </div>
    </Modal>
  )
}

export default CustomModal;

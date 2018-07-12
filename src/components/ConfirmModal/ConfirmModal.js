import React from 'react';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import './ConfirmModal.css';

const ConfirmModal = ({ open, title, subtitle, description, onClose }) => {
  return (
    <Modal
      className="modal-bg"
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={open}
      onClose={() => {
        onClose(false);
      }}
    >
      <div className="confirm-modal">
        <h2 className="confirm-modal__title">{title}</h2>
        {subtitle && <h4 className="confirm-modal__subtitle">{subtitle}</h4>}
        {description && (
          <p className="confirm-modal__description">{description}</p>
        )}
        <div className="confirm-modal__button-group">
          <Button
            variant="contained"
            color="default"
            onClick={() => {
              onClose(false);
            }}
          >
            <Icon>clear</Icon>
            취소
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              onClose(true);
            }}
          >
            삭제
            <Icon>delete</Icon>
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;

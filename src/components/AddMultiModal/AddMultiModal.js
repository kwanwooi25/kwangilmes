import React, { Component } from 'react';
import readXlsxFile from 'read-excel-file';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import Tooltip from '@material-ui/core/Tooltip';
import FormHelperText from '@material-ui/core/FormHelperText';
import CustomModal from '../../components/CustomModal/CustomModal';
import './AddMultiModal.css';

const INITIAL_STATE = {
  filename: '',
  error: ''
};

class AddMultiModal extends Component {
  state = INITIAL_STATE;

  onFileChange = event => {
    if (event.target.files && event.target.files[0]) {
      this.setState({ filename: event.target.files[0].name, error: '' });
    } else {
      this.setState(INITIAL_STATE);
    }
  };

  resetFileInput = () => {
    document.getElementById('file-upload').value = null;
    this.setState({ filename: '' });
  };

  onClickOk = async () => {
    const file = document.getElementById('file-upload').files[0];
    if (file) {
      const rows = await readXlsxFile(file);
      this.props.onClose(true, rows);
    } else {
      this.setState({ filename: '', error: '파일을 선택하세요.' });
    }
  };

  render() {
    const { open, onClose, template } = this.props;

    return (
      <CustomModal
        title="대량 등록"
        className="add-multi-modal"
        open={open}
        onClose={onClose}
        Buttons={
          <div>
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
              color="primary"
              onClick={this.onClickOk.bind(this)}
            >
              확인
              <Icon>check</Icon>
            </Button>
          </div>
        }
      >
        <div className="add-multi-modal__file-input">
          <input
            id="file-upload"
            style={{ display: 'none' }}
            type="file"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={this.onFileChange.bind(this)}
          />
          <label htmlFor="file-upload">
            <Button variant="contained" color="primary" component="span">
              파일선택
            </Button>
          </label>
          <FormControl
            className="add-multi-modal__file-input__filename"
            error={this.state.error !== ''}
          >
            <Input id="filename" value={this.state.filename} disabled />
            <FormHelperText id="filename">{this.state.error}</FormHelperText>
          </FormControl>
          <Tooltip title="템플릿 다운로드">
            <IconButton href={template} download>
              <Icon>get_app</Icon>
            </IconButton>
          </Tooltip>
          <IconButton onClick={this.resetFileInput.bind(this)}>
            <Icon>clear</Icon>
          </IconButton>
        </div>
      </CustomModal>
    );
  }
}

export default AddMultiModal;

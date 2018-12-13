
import React, { Component } from 'react';
import {
  Input, Tooltip
} from 'antd';
import intl from 'react-intl-universal';

class EditableInput extends Component {
  state = {
    inputVisible: false,
    inputValue: '',
  };

  showInput = () => {
    const { value } = this.props;
    this.setState({ inputVisible: true, inputValue: value || '' }, () => this.input.focus());
  }

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  }

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    const { handleSave } = this.props;
    if (handleSave) {
      handleSave(inputValue)
    }
    this.setState({
      inputVisible: false,
      inputValue: '',
    });
  }


  render() {
    const { inputVisible, inputValue } = this.state;
    const { value, size, width } = this.props;
    return (
      <div>
        {inputVisible && (
          <Input
            ref={node => { this.input = node}}
            type="text"
            size={size || 'small'}
            style={{ width: width || 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tooltip placement="bottom" title={intl.get('click.on.the.modify')}>
            <span style={{ cursor: 'pointer'}} onClick={this.showInput}>{value || intl.get('click.on.the.modify')}</span>
          </Tooltip>
        )}
      </div>
    );
  }
}

export default EditableInput;
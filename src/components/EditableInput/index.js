import React, { Component } from 'react';
import { Input, Tooltip } from 'antd';
import intl from 'react-intl-universal';
import { string } from 'util_react_web';

const { getIntl } = string
class EditableInput extends Component {
  state = {
    inputVisible: false,
    inputValue: '',
  };

  showInput = () => {
    const { value } = this.props;
    this.setState({ inputVisible: true, inputValue: value || '' }, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    const { handleSave } = this.props;
    if (handleSave) {
      handleSave(inputValue);
    }
    this.setState({
      inputVisible: false,
      inputValue: '',
    });
  };

  render() {
    const { inputVisible, inputValue } = this.state;
    const { value, size, width } = this.props;
    const test = getIntl(intl, 'base.click.on.to.modify', 'Click on to modify')
    return (
      <div>
        {inputVisible && (
          <Input
            ref={node => {
              this.input = node;
            }}
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
          <Tooltip placement="bottom" title={test}>
            <span style={{ cursor: 'pointer' }} onClick={this.showInput}>
              {value || test}
            </span>
          </Tooltip>
        )}
      </div>
    );
  }
}

export default EditableInput;

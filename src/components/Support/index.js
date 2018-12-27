import intl from 'react-intl-universal';
import React, { Component } from 'react';
import { Select } from 'antd';
import { string } from 'util_react_web';

const { getIntl } = string;

const { Option } = Select;

class Support extends Component {
  state = { initDone: false };

  componentDidMount() {
    const { typeName, getSupports } = this.props;
    getSupports({ typeName }).then(res => {
      const { data } = res;
      const { list } = data;
      this.setState({ initDone: true, list });
    });
  }

  render() {
    const { initDone, list } = this.state;
    const { form, name, style, disabled, value } = this.props;
    const { getFieldDecorator } = form;
    return (
      initDone &&
      getFieldDecorator(name, {
        initialValue: value || (list.length > 0 ? list[0].value : ''),
      })(
        <Select labelInValue style={style} disabled={disabled}>
          {list.map(item => (
            <Option key={item.titleKey} value={item.value}>
              {getIntl(intl, item.titleKey)}
            </Option>
          ))}
        </Select>
      )
    );
  }
}

export default Support;

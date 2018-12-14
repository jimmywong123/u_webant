import intl from 'react-intl-universal';
import React, { Component } from 'react';
import { Select } from 'antd';

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
    const { form, name, style, disabled } = this.props;
    const { getFieldDecorator } = form;
    return (
      initDone &&
      getFieldDecorator(name, {
        initialValue: list.length > 0 ? list[0].value : '',
      })(
        <Select style={style} disabled={disabled}>
          {list.map(item => (
            <Option key={item.titleKey} value={item.value}>
              {intl.get(item.titleKey)}
            </Option>
          ))}
        </Select>
      )
    );
  }
}

export default Support;

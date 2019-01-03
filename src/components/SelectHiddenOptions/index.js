import React, {Component} from 'react';
import { Select } from 'antd';
import { string } from 'util_react_web';

const { getIntl } = string;

class SelectWithHiddenSelectedOptions extends Component {
  
  state = {
    selectedItems: [],
    initDone: false,
    list: [],
  };

  componentDidMount() {
    const { typeName, getSupports, option, field, record, intl } = this.props;
    if (getSupports) {
      getSupports({ typeName }).then(res => {
        const { data } = res;
        const { list } = data;
        const arr = record[field] || [];

        const valueArr = list.filter(o => arr.includes(o.value));

        const selectedItems = valueArr.map( item => ({
            key: item.value,
            label: getIntl(intl, item.titleKey)
          }))

        this.setState({ initDone: true, list, selectedItems });
      });
    } else {
      this.setState({ initDone: true, list: option });
    }
  }

  handleChange = selectedItems => {
    const { field, form } = this.props;
    form.setFieldsValue({[field]: selectedItems.map(item => item.key)})
    this.setState({ selectedItems });
  };

  render() {
    const { selectedItems, initDone, list } = this.state;
    const { placeholder, style, intl } = this.props;

    const selectedVlaueItems = selectedItems.map(item => item.key)
    const filteredOptions = list.filter(o => !selectedVlaueItems.includes(o.value));
    
    return (
      initDone &&
      <Select
        mode="multiple"
        labelInValue
        placeholder={placeholder}
        value={selectedItems}
        onChange={this.handleChange}
        style={style || { width: '100%' }}
      >
        {filteredOptions.map(item => (
          <Select.Option key={item} value={item.value}>
            {getIntl(intl, item.titleKey)}
          </Select.Option>
        ))}
      </Select>
    );
  }
}

export default SelectWithHiddenSelectedOptions
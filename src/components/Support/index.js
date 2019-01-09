import intl from 'react-intl-universal';
import React, { Component } from 'react';
import { Select, Icon } from 'antd';
import { string } from 'util_react_web';
import classNames from 'classnames';
import styles from './index.less';

const { getIntl } = string;

const { Option } = Select;

class Support extends Component {
  state = { initDone: false, list: [] };

  componentDidMount() {
    const { typeName, getSupports } = this.props;
    getSupports({ typeName }).then(res => {
      const { data } = res;
      const { list } = data;
      this.setState({ initDone: true, list });
    });
  }

  handleChange = value => {
    const { name, form } = this.props;
    if (form) {
      form.setFieldsValue({[name]: value})
    }
  };

  render() {
    const { initDone, list } = this.state;
    const { form, name, style, disabled, value, notFieldDecorator, icon, className, ...ohterProps } = this.props;
    const { getFieldDecorator } = form;
    let maxLength = 0
    const optionList = list.map(item => {
      const text = getIntl(intl, item.titleKey)
      if (text.length > maxLength) {
        maxLength = text.length
      }
      return (
        <Option key={item.titleKey} value={item.value}>
          {text}
        </Option>
      )
    })
    const selectStyle = style || { width: 'auto', minWidth: 100 }
    let cls = className
    let suffixIcon
    if (icon) {
      cls = classNames(className, styles.prefix )
      suffixIcon = (<Icon type={icon}/>)
    }
    
    return (
      initDone &&
      notFieldDecorator ? (
        <Select 
          className={cls}
          style={selectStyle} 
          disabled={disabled} 
          onChange={this.handleChange}
          labelInValue
          suffixIcon={suffixIcon}
          {...ohterProps}  
        >
          {optionList}
        </Select> 
      ) : (
        getFieldDecorator(name, {
          initialValue: value,
        })(
          <Select 
            className={cls}
            style={selectStyle} 
            disabled={disabled}
            suffixIcon={suffixIcon}
            {...ohterProps}  
          >
            {optionList}
          </Select>
        )
      )
      
    );
  }
}

export default Support;

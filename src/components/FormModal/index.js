import React, { Component } from 'react';
import { Modal } from 'antd';
import BaseForm from '../BaseForm';
import sytles from './index.less';

class FormModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  showModelHandler = (e) => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
  };

  hideModelHandler = () => {
    this.setState({
      visible: false,
    });
  };

  okHandler = () => {
    const { form, props } = this
    const { onOk } = props;
    form.validateFields((err, values) => {
      if (!err) {
        onOk(values);
        this.hideModelHandler();
      }
    });
  };

  handleForm = n => {
    if (n) {
      this.form = n.getForm();
    }
  }

  render() {
    const { children, record, keyArr, title, layout, footer } = this.props;
    const { visible } = this.state;
    return (
      <span className={sytles.main}>
        <span onClick={this.showModelHandler}>
          { children }
        </span>
        <Modal
          title={title}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
          footer={footer}
        > 
          <BaseForm record={record} layout={layout || 'vertical'} ref={this.handleForm} onSubmit={this.okHandler} keyArr={keyArr} />
        </Modal>
      </span>
    )
  }

}

export default FormModal;
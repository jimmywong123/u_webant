import React, { PureComponent } from 'react';
import { Tag, Divider, Input, Modal, Form } from 'antd';
import { connect } from 'dva';
import intl from 'react-intl-universal';
import classNames from 'classnames';

import Support from '@/components/Support';
import { checkPhone, getSupports } from '@/services/agent';

import MobileCaptcha from '@/components/MobileCaptcha';
import { string } from 'util_react_web';

const { getIntl } = string;

const FormItem = Form.Item;

@connect(({ phoneBind, phoneLogin }) => ({ phoneBind, phoneLogin }))
@Form.create()
class PhoneBind extends PureComponent {
  showModal = e => {
    if (e) e.stopPropagation();
    const { dispatch } = this.props;
    dispatch({
      type: 'phoneBind/change',
      payload: true,
    });
  };

  hideModelHandler = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'phoneBind/change',
      payload: false,
    });
  };

  okHandler = () => {
    const { dispatch, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const phone = `${values.prefix}_${values.mobile}`;
        dispatch({
          type: 'phoneBind/unbind',
          payload: { phone },
        });
      }
    });
  };

  emitEmpty = () => {
    const { state, mobileInput, props } = this;
    const { count } = state;
    const { form } = props;
    if (count === 0) {
      mobileInput.focus();
      form.setFieldsValue({ mobile: '' });
    }
  };

  getPhoneCaptcha = (sendMobile, fb) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'phoneLogin/getCaptcha',
      payload: sendMobile,
    }).then(fb());
  };

  checkPhoneCaptcha = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: 'phoneLogin/checkCaptcha',
      payload,
    });
  };

  handleClose(e, value) {
    e.preventDefault();
    this.showModal();
    const arr = value.split(' ');
    const prefix = arr[0].replace('+(', '').replace(')', '');
    const { form } = this.props;
    form.setFieldsValue({
      prefix,
      mobile: arr[1],
    });
  }

  render() {
    const {
      phoneBind: { list, visible },
      form,
      phoneLogin,
    } = this.props;
    const { getFieldDecorator } = form;
    const { captchaTips: phoneCaptchaTips } = phoneLogin;

    return (
      <div>
        {list.length > 0 ? <h2 className="pt3">{getIntl(intl, 'loginsys.have.been.bound.mobiles', 'You have been bound mobiles')}</h2> : null}
        {list.map(item => (
          <Tag
            style={{ marginBottom: '15px' }}
            key={item}
            closable={list.length > 1}
            onClose={e => this.handleClose(e, item)}
          >
            {item}
          </Tag>
        ))}
        <div className={classNames('py2', 'pr0-sm', 'pr5')}>
          <Divider orientation="right">{getIntl(intl, 'loginsys.bind.new.phone', 'Bind new mobile')}</Divider>
          <div style={{ maxWidth: '400px' }}>
            <MobileCaptcha
              checkPhone={checkPhone}
              getCaptcha={this.getPhoneCaptcha}
              checkCaptcha={this.checkPhoneCaptcha}
              captchaTips={phoneCaptchaTips}
              getSupports={getSupports}
              fb="phoneBind/bind"
            />
          </div>
        </div>
        <Modal
          title={getIntl(intl, 'loginsys.delete.phone.title', 'Type in the number you want to delete')}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
          centered
        >
          <Form style={{ textAlign: 'left' }}>
            <FormItem>
              {getFieldDecorator('mobile', {
                rules: [
                  {
                    required: true,
                    message: getIntl(intl, 'loginsys.please.type.in.mobile.number', 'Please type in mobile number!'),
                    type: 'string',
                    pattern: /^[0-9]+$/,
                  },
                ],
              })(
                <Input
                  placeholder={getIntl(intl, 'loginsys.mobile', 'Mobile')}
                  size="large"
                  addonBefore={
                    <Support
                      getSupports={getSupports}
                      style={{ width: 150 }}
                      name="prefix"
                      typeName="nationaal"
                      form={form}
                    />
                  }
                  ref={node => {
                    this.mobileInput = node;
                  }}
                />
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default PhoneBind;

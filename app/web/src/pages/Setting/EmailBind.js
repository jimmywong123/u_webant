
import React, { PureComponent } from 'react';
import { Tag, Divider, Input, Modal, Form } from 'antd';
import { connect } from 'dva';
import intl from 'react-intl-universal';
import classNames from 'classnames';
import { checkEmail } from '@/services/agent';

import EmailCaptcha from '@/components/EmailCaptcha';

const FormItem = Form.Item;

@connect(({ emailBind, emailLogin }) => ({ emailBind, emailLogin }))
@Form.create()
class EmailBind extends PureComponent {

  showModal = (e) => {
    if (e) e.stopPropagation();
    const { dispatch } = this.props;
    dispatch({
      type: 'emailBind/change',
      payload: true,
    })
  }

  hideModelHandler = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'emailBind/change',
      payload: false,
    })
  };

  okHandler = () => {
    const { dispatch, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'emailBind/unbind',
          payload: values,
        })
      }
    });
  };

  emitEmpty = () => {
    const { state, emailInput, props} = this
    const { count } = state
    const { form } =  props
    if (count === 0 ) {
      emailInput.focus();
      form.setFieldsValue({ email: '' })
    }
  }

  getEmailCaptcha = (email, fb) => {
    const { dispatch } = this.props
    dispatch({
      type: 'emailLogin/getCaptcha',
      payload: email
    }).then(fb())
  }

  checkEmailCaptcha = (payload) => {
    const { dispatch } = this.props
    dispatch({
      type: 'emailLogin/checkCaptcha',
      payload
    });
  }

  handleClose(e, email) {
    e.preventDefault();
    this.showModal();
    const { form } = this.props
    form.setFieldsValue({ email })
  }

  render() {
    const { emailBind: { list, visible  }, form, emailLogin } = this.props;
    const { getFieldDecorator } = form;
    const { captchaTips: emailCaptchaTips} = emailLogin;
   
    return ( 
      <div>
        { list.length > 0 ? (<h2 className="pt3">{intl.get('the.account.has.been1544407957040')}</h2>) : null }
        { list.map( (item, i) => (
          <Tag style={{ marginBottom: '15px' }} key={`${item + i}`} closable={list.length > 1} onClose={(e) => this.handleClose(e, item)}>
            {item}
          </Tag>
        ))}
        <div className={classNames("py2", "pr0-sm", "pr5")}>
          <Divider orientation="right">{intl.get('bind.new.email')}</Divider>
          <div style={{ maxWidth: '400px' }}>
            <EmailCaptcha 
              checkEmail={checkEmail}
              getCaptcha={this.getEmailCaptcha}
              checkCaptcha={this.checkEmailCaptcha}
              captchaTips={emailCaptchaTips}
              fb='emailBind/bind'
            />
          </div>
        </div>
        <Modal
          title={intl.get('type.in.the.number.y')}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
          centered
        >
          <Form style={{ textAlign: "left"}}>
            <FormItem>
              {getFieldDecorator(
                "email", 
                {
                  rules: [
                    {
                      required: true,
                      message: intl.get("please.enter.email."),
                      type: 'email',
                    },
                  ]
                }
              )(<Input 
                placeholder={intl.get("email")} 
                size='large'
                ref={node => {this.emailInput = node}}
              />)}
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default EmailBind;
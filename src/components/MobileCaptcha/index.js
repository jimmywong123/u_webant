import React, { PureComponent } from 'react';
import { Form, Input, Row, Col, Button, Icon } from 'antd';
import intl from 'react-intl-universal';
import Support from '../Support';
import { delay } from 'util_react_web';
import { string } from 'util_react_web';

const { getIntl } = string;

const FormItem = Form.Item;
const delay500 = new delay(500);

@Form.create()
class MobileCaptcha extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      mobileTips: '',
    };
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  emitEmpty = () => {
    const { state, mobileInput, props } = this;
    const { count } = state;
    const { form } = props;
    if (count === 0) {
      mobileInput.focus();
      form.setFieldsValue({ mobile: '' });
    }
  };

  onMoblieChange = e => {
    const { form, checkPhone } = this.props;
    if (checkPhone) {
      const phone = e.target.value;
      if (phone && phone.length > 6) {
        delay500.do(() => {
          const sendMobile = `${form.getFieldValue('prefix')}_${phone}`;
          checkPhone({ context: sendMobile }).then(res => {
            const {
              data: { list },
            } = res;
            if (list.length === 1) {
              const mobileTips = getIntl(intl, 'base.phone.registered', `${phone} registered, get the captcha to login`, { phone })
              this.setState({ mobileTips });
            } else {
              const mobileTips = getIntl(intl, 'base.phone.can.user', `${phone} can use, get the captcha to register`, { phone })
              this.setState({ mobileTips });
            }
          });
        });
      }
    }
  };

  onGetCaptcha = () => {
    const { form, getCaptcha } = this.props;
    form.validateFields(['mobile'], {}, (err, values) => {
      if (!err) {
        const sendMobile = `${form.getFieldValue('prefix')}_${values.mobile}`;
        if (getCaptcha) {
          getCaptcha(sendMobile, this.runGetCaptchaCountDown);
        }
      }
    });
  };

  runGetCaptchaCountDown = () => {
    const { countDown } = this.props;
    let count = countDown || 59;
    this.setState({ count });
    this.interval = setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  };

  onCaptchaChange = e => {
    const captcha = e.target.value;
    if (captcha.length === 6) {
      const { form, checkCaptcha } = this.props;
      const sendMobile = `${form.getFieldValue('prefix')}_${form.getFieldValue('mobile')}`;
      if (checkCaptcha) {
        checkCaptcha({
          sendMobile,
          captcha,
          ...this.props,
        });
      }
    }
  };

  render() {
    const { form, captchaTips, getSupports } = this.props;

    const { getFieldDecorator } = form;
    const { count, mobileTips } = this.state;

    const prefixSelector = (
      <Support
        getSupports={getSupports}
        style={{ maxWidth: 150 }}
        disabled={count > 0}
        name="prefix"
        typeName="nationaal"
        value={86}
        form={form}
      />
    );
    return (
      <Form style={{ textAlign: 'left' }}>
        <FormItem extra={mobileTips}>
          {getFieldDecorator('mobile', {
            rules: [
              {
                required: true,
                message: getIntl(intl, 'base.please.type.in.mobile.number', 'Please type in mobile number!'),
              },
            ],
          })(
            <Input
              placeholder={getIntl(intl, 'base.mobile', 'Mobile')}
              size="large"
              disabled={count > 0}
              addonBefore={prefixSelector}
              onChange={this.onMoblieChange}
              ref={node => {
                this.mobileInput = node;
              }}
            />
          )}
        </FormItem>
        <FormItem extra={getIntl(intl, captchaTips, 'Mobile')}>
          <Row gutter={8}>
            <Col span={13}>
              {getFieldDecorator('captcha', {
                rules: [{ required: true, message: getIntl(intl, 'base.please.type.in.the.captcha.you.got', 'Please type in the captcha you got!') }],
              })(
                <Input
                  size="large"
                  placeholder={getIntl(intl, 'base.captcha', 'Captcha')}
                  prefix={<Icon type="message" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  onChange={this.onCaptchaChange}
                />
              )}
            </Col>
            <Col span={11}>
              <Button
                disabled={count}
                style={{ display: 'block', width: '100%' }}
                size="large"
                onClick={this.onGetCaptcha}
              >
                {count ? `${count} s` : getIntl(intl, 'base.get.captcha', 'Get captcha')}
              </Button>
            </Col>
          </Row>
        </FormItem>
      </Form>
    );
  }
}

export default MobileCaptcha;

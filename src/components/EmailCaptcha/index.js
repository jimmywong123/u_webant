import React, { PureComponent } from 'react';
import { Form, Input, Row, Col, Button, Icon } from 'antd';
import intl from 'react-intl-universal';
import Delay from '../_utils/delay';

const FormItem = Form.Item;
const delay500 = new Delay(500);

@Form.create()
class EmailCaptcha extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      emailTips: '',
    };
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  emitEmpty = () => {
    const { state, emailInput, props } = this;
    const { count } = state;
    const { form } = props;
    if (count === 0) {
      emailInput.focus();
      form.setFieldsValue({ email: '' });
    }
  };

  onEmailChange = e => {
    const { checkEmail } = this.props;
    if (checkEmail) {
      const email = e.target.value;
      if (
        email &&
        email.length > 6 &&
        email.indexOf('@') > 0 &&
        email.indexOf('.') > 0 &&
        email.indexOf('.') < email.length - 1
      ) {
        delay500.do(() => {
          checkEmail({ context: email }).then(res => {
            const {
              data: { list },
            } = res;
            if (list.length === 1) {
              this.setState({ emailTips: intl.get('{email}.registered,.', { email }) });
            } else {
              this.setState({ emailTips: intl.get('{email}.can.use,.get', { email }) });
            }
          });
        });
      }
    }
  };

  onGetCaptcha = () => {
    const { form, getCaptcha } = this.props;
    form.validateFields(['email'], {}, (err, values) => {
      if (!err) {
        const { email } = values;
        if (getCaptcha) {
          getCaptcha(email, this.runGetCaptchaCountDown);
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
      const email = form.getFieldValue('email');
      if (checkCaptcha) {
        checkCaptcha({
          email,
          captcha,
          ...this.props,
        });
      }
    }
  };

  render() {
    const { form, captchaTips } = this.props;

    const { getFieldDecorator } = form;
    const { count, emailTips } = this.state;

    return (
      <Form style={{ textAlign: 'left' }}>
        <FormItem extra={emailTips}>
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: intl.get('it.is.not.valid.e-ma'),
              },
              {
                required: true,
                message: intl.get('please.input.your.e-'),
              },
            ],
          })(
            <Input
              placeholder={intl.get('email')}
              size="large"
              disabled={count > 0}
              prefix={<Icon type="inbox" style={{ color: 'rgba(0,0,0,.25)' }} />}
              onChange={this.onEmailChange}
              ref={node => {
                this.emailInput = node;
              }}
            />
          )}
        </FormItem>
        <FormItem extra={intl.get(captchaTips)}>
          <Row gutter={8}>
            <Col span={15}>
              {getFieldDecorator('captcha', {
                rules: [{ required: true, message: intl.get('please.input.the.cap') }],
              })(
                <Input
                  size="large"
                  placeholder={intl.get('captcha')}
                  prefix={<Icon type="message" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  onChange={this.onCaptchaChange}
                />
              )}
            </Col>
            <Col span={9}>
              <Button
                disabled={count}
                style={{ display: 'block', width: '100%' }}
                size="large"
                onClick={this.onGetCaptcha}
              >
                {count ? `${count} s` : intl.get('get.captcha')}
              </Button>
            </Col>
          </Row>
        </FormItem>
      </Form>
    );
  }
}

export default EmailCaptcha;

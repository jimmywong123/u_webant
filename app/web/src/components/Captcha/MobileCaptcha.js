import React, { PureComponent } from 'react';
import { Form, Input, Row, Col, Button, Icon } from 'antd';
import intl from 'react-intl-universal';
import Support from '../Support';
import styles from './index.less';
import Delay from '../_utils/delay'

const FormItem = Form.Item;
const delay500 = new Delay(500);

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
    const { state, mobileInput, props} = this
    const { count } = state
    const { form } =  props
    if (count === 0 ) {
      mobileInput.focus();
      form.setFieldsValue({ mobile: '' })
    }
  }

  onMoblieChange = (e) => {
    const { form, checkPhone } = this.props
    if (checkPhone) {
      const phone = e.target.value
      if (phone && phone.length > 6) {
        delay500.do( () => {
          const sendMobile = `${form.getFieldValue('prefix')}_${phone}`;
          checkPhone({ context: sendMobile }).then( res => {
            const { data: { list } } = res
            if (list.length === 1) {
              this.setState({mobileTips: intl.get("{phone}.registered,.", {phone})})
            } else {
              this.setState({mobileTips: intl.get("{phone}.can.use,.get", {phone})})
            }
          })
        });
      }
    }
  }

  onGetCaptcha = () => {
    const { form, getCaptcha } = this.props
    form.validateFields(['mobile'], {}, (err, values) => {
      if (!err) {
        const sendMobile = `${form.getFieldValue('prefix')}_${values.mobile}`;
        if (getCaptcha) {
          getCaptcha(sendMobile, this.runGetCaptchaCountDown)
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

  onCaptchaChange = (e) => {
    const captcha = e.target.value
    if (captcha.length === 6 ){
      const { form, checkCaptcha } = this.props
      const sendMobile = `${form.getFieldValue('prefix')}_${form.getFieldValue('mobile')}`;
      if (checkCaptcha) {
        checkCaptcha({
          sendMobile, captcha, ...this.props
        })
      }
    }
  }

  render() {
    const { form, captchaTips, getSupports } = this.props
    
    const { getFieldDecorator } = form
    const { count, mobileTips } = this.state;

    const prefixSelector = (
      <Support 
        getSupports={getSupports}
        style={{ width: 150 }}
        disabled={count > 0}
        name='prefix'
        typeName='nationaal'
        form={form}
      />
    )
    return ( 
      <Form style={{ textAlign: "left"}}>
        <FormItem
          extra={mobileTips}
        >
          {getFieldDecorator(
            "mobile", 
            {
              rules: [
                {
                  required: true,
                  message: intl.get("please.enter.mobile."),
                },
              ]
            }
          )(<Input 
            placeholder={intl.get("mobile")} 
            size='large'
            disabled={count > 0}
            addonBefore={prefixSelector}
            onChange={this.onMoblieChange}
            ref={node => {this.mobileInput = node}}
          />)}
        </FormItem>
        <FormItem
          extra={intl.get(captchaTips)}
        >
          <Row gutter={8}>
            <Col span={15}>
              {getFieldDecorator('captcha', {
                rules: [{ required: true, message: intl.get("please.input.the.cap")}],
              })(
                <Input 
                  size='large'
                  placeholder={intl.get("captcha")} 
                  prefix={<Icon type="message" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  onChange={this.onCaptchaChange}
                />
              )}
            </Col>
            <Col span={9}>
              <Button
                disabled={count}
                className={styles.getCaptcha}
                size="large"
                onClick={this.onGetCaptcha}  
              >
                {count ? `${count} s` : intl.get('get.captcha')}
              </Button>
            </Col>
          </Row>
        </FormItem>
      </Form>
    )
  }
}

export default MobileCaptcha;
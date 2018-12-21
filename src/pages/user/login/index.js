import React, { Component } from 'react';

import { Icon, Tabs, Row, Col } from 'antd';
import { connect } from 'dva';
import intl from 'react-intl-universal';
import styles from './index.less';
import MobileCaptcha from '@/components/MobileCaptcha';
import EmailCaptcha from '@/components/EmailCaptcha';
import WechatLogin from '../components/WechatLogin';
import { getPageQuery } from '@/utils';
import { checkPhone, getSupports, checkEmail } from '@/services/agent';
import { string } from 'util_react_web';

const { getIntl } = string;

const { TabPane } = Tabs;

@connect(({ user, phoneLogin, emailLogin }) => ({ user, phoneLogin, emailLogin }))
class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'wechat',
      initDone: false,
    };
  }

  componentDidMount() {
    const { user, dispatch } = this.props;
    const { type } = this.state;
    const { currentUser, UTOKEN } = user;

    const urlParams = new URL(window.location.href);
    const params = getPageQuery();
    const { code, state } = params;

    if (type === 'wechat') {
      if (code && state && state.indexOf('webapp|') === 0) {
        // 微信扫码登录
        dispatch({
          type: 'wechatLogin/webappLogin',
          payload: { code, redirect: state.replace('webapp|', '') },
        });
      } else if (code) {
        // 微信内的点击登录
        dispatch({
          type: 'wechatLogin/login',
          payload: { code, redirect: state },
        });
      }
    }

    let { redirect } = params;
    if (redirect && currentUser && UTOKEN) {
      // 不同域并且已登录，直接已登录跳转回去
      redirect = decodeURIComponent(redirect);

      try {
        const redirectUrlParams = new URL(redirect);
        // 判断是否同域
        if (redirectUrlParams.origin !== urlParams.origin) {
          if (redirect.indexOf('?') > 0) {
            if (redirect.indexOf('utoken=') < 0) {
              redirect = `${redirect}&utoken=${UTOKEN}`;
            }
          } else {
            redirect = `${redirect}?utoken=${UTOKEN}`;
          }
          window.location.href = redirect;
        }
      } catch (error) {
        console.error('LoginPage componentDidMount', error); // eslint-disable-line
      }
    }
    this.setState({ initDone: true });
  }

  handleOnChange = activeKey => {
    this.setState({ type: activeKey });
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

  getEmailCaptcha = (email, fb) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'emailLogin/getCaptcha',
      payload: email,
    }).then(fb());
  };

  checkEmailCaptcha = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: 'emailLogin/checkCaptcha',
      payload,
    });
  };

  render() {
    const { phoneLogin, emailLogin } = this.props;
    const { type, initDone } = this.state;

    const { captchaTips: phoneCaptchaTips } = phoneLogin;
    const { captchaTips: emailCaptchaTips } = emailLogin;

    const MobileTab = (
      <span>
        <Icon type="phone" />
        <span>{type === 'mobile' ? getIntl(intl, 'loginsys.login.by.mobile', 'Login by mobile') : ''}</span>
      </span>
    );
    const EmailTab = (
      <span>
        <Icon type="mail" />
        <span>{type === 'mail' ? getIntl(intl, 'loginsys.login.by.email', 'Login by email') : ''}</span>
      </span>
    );
    const WechatTab = (
      <span>
        <Icon type="wechat" />
        <span>{type === 'wechat' ? getIntl(intl, 'loginsys.login.by.wechat', 'Login by wechat') : ''}</span>
      </span>
    );
    return (
      initDone && (
        <Row type="flex" justify="space-around" align="middle">
          <Col span={24}>
            <div className={styles.main}>
              <div className={styles.login}>
                <Tabs type="card" defaultActiveKey="wechat" onChange={this.handleOnChange}>
                  <TabPane tab={MobileTab} key="mobile">
                    <MobileCaptcha
                      checkPhone={checkPhone}
                      getCaptcha={this.getPhoneCaptcha}
                      checkCaptcha={this.checkPhoneCaptcha}
                      captchaTips={phoneCaptchaTips}
                      getSupports={getSupports}
                    />
                  </TabPane>
                  <TabPane tab={EmailTab} key="mail">
                    <EmailCaptcha
                      checkEmail={checkEmail}
                      getCaptcha={this.getEmailCaptcha}
                      checkCaptcha={this.checkEmailCaptcha}
                      captchaTips={emailCaptchaTips}
                    />
                  </TabPane>
                  <TabPane tab={WechatTab} key="wechat">
                    <WechatLogin />
                  </TabPane>
                </Tabs>
              </div>
            </div>
          </Col>
        </Row>
      )
    );
  }
}

export default LoginPage;

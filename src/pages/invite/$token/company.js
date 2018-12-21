import React, { Component } from 'react';
import { getWechatJsConfig } from '@/services/api';
import { checkPhone, getSupports, checkEmail } from '@/services/agent';
import { Avatar, Divider, Tabs, Icon } from 'antd';
import { connect } from 'dva';
import { where } from '@/utils';
import { getSystemPath } from '@/services/base';
import intl from 'react-intl-universal';
import styles from '../index.less';
import ShareAppMessage from '@/components/ShareAppMessage';
import MobileCaptcha from '@/components/MobileCaptcha';
import EmailCaptcha from '@/components/EmailCaptcha';
import { string } from 'util_react_web';

const { getIntl } = string;

const { TabPane } = Tabs;

@connect(({ companyInvite, phoneLogin, emailLogin }) => ({ companyInvite, phoneLogin, emailLogin }))
class CompanyPage extends Component {
  constructor(ctx) {
    super(ctx);
    const { match } = ctx;
    const {
      params: { token },
    } = match;
    this.state = {
      initDone: false,
      companyHref: '',
      token,
    };
  }

  componentDidMount() {
    this.getHCPageUrl();
  }

  getHCPageUrl() {
    const {
      companyInvite: { company },
    } = this.props;

    getSystemPath('hcweb').then(res => {
      const { data } = res;
      const companyHref = `${data}/companys/${company.line}`;
      const updateState = {
        initDone: true,
        companyHref,
      };
      this.setState(updateState);
    });
  }

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
    const { companyInvite, phoneLogin, emailLogin } = this.props;
    const { user, company } = companyInvite;
    const { companyHref, initDone, token } = this.state;
    const { nickname } = user;
    const { name } = company;
    const whereNow = where();
    const { captchaTips: phoneCaptchaTips } = phoneLogin;
    const { captchaTips: emailCaptchaTips } = emailLogin;

    return (
      initDone && (
        <div style={{ textAlign: 'center' }}>
          <Avatar src={user.headimgurl} className={styles.profileAvatar} />
          <h1 className="my2">{user.nickname}</h1>
          <Divider />
          <h2 className="mb2">{getIntl(intl, 'loginsys.invites.you.to.manage.this.company', 'Invites you to manage this company in HiredChina.com')}</h2>
          <a target="_blank" href={companyHref} rel="noopener noreferrer">
            <Avatar src={company.logoimgurl} className={styles.companyAvatar} />
            <h1 className="my2">{company.name}</h1>
          </a>

          <div className="px4">
            <Divider>{getIntl(intl, 'loginsys.if.you.are.the.hr', 'If you are the HR')}</Divider>
          </div>

          <div className={styles.login}>
            <Tabs type="card" defaultActiveKey="mobile">
              <TabPane
                tab={
                  <span>
                    <Icon type="phone" />
                    {getIntl(intl, 'loginsys.login.by.mobile', 'Login by mobile')}
                  </span>
                }
                key="mobile"
              >
                <MobileCaptcha
                  checkPhone={checkPhone}
                  getCaptcha={this.getPhoneCaptcha}
                  checkCaptcha={this.checkPhoneCaptcha}
                  captchaTips={phoneCaptchaTips}
                  getSupports={getSupports}
                  token={token}
                  fb="inviteCompany"
                />
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <Icon type="mail" />
                    {getIntl(intl, 'loginsys.login.by.email', 'Login by E-mail')}
                  </span>
                }
                key="mail"
              >
                <EmailCaptcha
                  checkEmail={checkEmail}
                  getCaptcha={this.getEmailCaptcha}
                  checkCaptcha={this.checkEmailCaptcha}
                  captchaTips={emailCaptchaTips}
                  token={token}
                  fb="inviteCompany"
                />
              </TabPane>
            </Tabs>
          </div>
          {whereNow === 'wechat' ? (
            <ShareAppMessage
              getWechatJsConfig={getWechatJsConfig}
              title={getIntl(intl, 'loginsys.hiredchina.com.invite', 'HiredChina.com Invite')}
              desc={getIntl(intl, 'loginsys.company.invite.share.desc', `${nickname} invites you to manage ${name} info in HiredChina.com`, { nickname, name })}
              imgUrl="http://image.hiredchina.com/hc_logo_300x300.jpg"
            />
          ) : (
            <div />
          )}
        </div>
      )
    );
  }
}

export default CompanyPage;

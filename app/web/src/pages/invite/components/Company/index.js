import React, { Component } from 'react';
import { getWechatJsConfig } from '@/services/api';
import { checkPhone, getSupports, checkEmail } from '@/services/agent';
import { Avatar, Divider, Tabs, Icon } from 'antd';
import { connect } from 'dva';
import { where } from '@/utils'
import { getSystemPath } from '@/services/base';
import intl from 'react-intl-universal';
import styles from '../../index.less';
import ShareAppMessage from '@/components/Wechat/ShareAppMessage';
import MobileCaptcha from '@/components/Captcha/MobileCaptcha';
import EmailCaptcha from '@/components/Captcha/EmailCaptcha';

const { TabPane } = Tabs

@connect(({ companyInvite, phoneLogin, emailLogin }) => ({ companyInvite, phoneLogin, emailLogin }))
class CompanyPage extends Component {
  state = { 
    initDone: false,
    companyHref: ''
  }

  componentDidMount() {
    this.getHCPageUrl()
  }

  getHCPageUrl() {
    const { companyInvite: { company } } = this.props;

    getSystemPath('hcweb').then( res => {
      const { data } = res;
      const companyHref = `${data}/companys/${company.line}`;
      const updateState = {
        initDone: true,
        companyHref
      }
      this.setState(updateState);
    });
  }

  getPhoneCaptcha = (sendMobile, fb) => {
    const { dispatch } = this.props
    dispatch({
      type: 'phoneLogin/getCaptcha',
      payload: sendMobile
    }).then(fb())
  }

  checkPhoneCaptcha = (payload) => {
    const { dispatch } = this.props
    dispatch({
      type: 'phoneLogin/checkCaptcha',
      payload
    });
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

  render() {
    const { companyInvite, token, phoneLogin, emailLogin } = this.props;
    const { user, company } = companyInvite
    const { companyHref, initDone } = this.state;
    const { nickname } = user;
    const { name } = company;
    const whereNow = where();
    const { captchaTips: phoneCaptchaTips} = phoneLogin;
    const { captchaTips: emailCaptchaTips} = emailLogin;
    
    return (
      initDone &&
      <div style={{ textAlign: "center"}}>
        <Avatar
          src={user.headimgurl}
          className={styles.profileAvatar}
        />
        <h1 className="my2">{user.nickname}</h1>
        <Divider />
        <h2 className="mb2">{intl.get('invites.you.to.manag')}</h2>
        <a target="_blank" href={companyHref} rel="noopener noreferrer">
          <Avatar
            src={company.logoimgurl}
            className={styles.companyAvatar}
          />
          <h1 className="my2">{company.name}</h1>
        </a>
        
        <div className="px4">
          <Divider>{intl.get('if.you.are.the.hr')}</Divider>
        </div>

        <div className={styles.login}>
          <Tabs type="card" defaultActiveKey="mobile">
            <TabPane tab={<span><Icon type="phone" />{intl.get('login.by.mobile')}</span>} key="mobile">
              <MobileCaptcha
                checkPhone={checkPhone}
                getCaptcha={this.getPhoneCaptcha}
                checkCaptcha={this.checkPhoneCaptcha}
                captchaTips={phoneCaptchaTips}
                getSupports={getSupports}
                token={token}
                fb='inviteCompany'
              />
            </TabPane>
            <TabPane tab={<span><Icon type="mail" />{intl.get('login.by.email')}</span>} key="mail">
              <EmailCaptcha 
                checkEmail={checkEmail}
                getCaptcha={this.getEmailCaptcha}
                checkCaptcha={this.checkEmailCaptcha}
                captchaTips={emailCaptchaTips}
                token={token}
                fb='inviteCompany'
              />
            </TabPane>
            
          </Tabs>
        </div>
        {whereNow === 'wechat' ? (<ShareAppMessage
          getWechatJsConfig={getWechatJsConfig}
          jsApiList={["onMenuShareAppMessage"]}
          title={intl.get('hiredchina.com.invit')}
          desc={intl.get('{nickname}.invites.y', {nickname, name})}
          imgUrl='http://image.hiredchina.com/hc_logo_300x300.jpg'
        />):(<div />)}
      </div>

    )
  }
}

export default CompanyPage;
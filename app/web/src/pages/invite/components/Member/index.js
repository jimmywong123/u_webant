import React, { Component } from 'react';
import { Avatar, Divider, Tabs, Icon } from 'antd';
import { connect } from 'dva';
import intl from 'react-intl-universal';
import styles from '../../index.less';
import ShareAppMessage from '@/components/Wechat/ShareAppMessage';
import { where } from '@/utils'
import MobileCaptcha from '@/components/Captcha/MobileCaptcha';
import EmailCaptcha from '@/components/Captcha/EmailCaptcha';
import { getWechatJsConfig } from '@/services/api';
import { checkPhone, getSupports, checkEmail } from '@/services/agent';

const { TabPane } = Tabs

@connect(({ personInvite, phoneLogin, emailLogin }) => ({ personInvite, phoneLogin, emailLogin }))
class MemberPage extends Component {

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
    const { personInvite, token, phoneLogin, emailLogin } = this.props;
    const { user, person } = personInvite;
    const { nickname } = user;
    const { firstName, lastName } = person;
    const whereNow = where();
    const { captchaTips: phoneCaptchaTips} = phoneLogin;
    const { captchaTips: emailCaptchaTips} = emailLogin;

    return (
      <div style={{ textAlign: "center"}}>
        <Avatar
          src={user.headimgurl}
          className={styles.profileAvatar}
        />
        <h1 className="my2">{user.nickname}</h1>
        <Divider />
        <h2 className="mb2">{intl.get('invites.you.to.use.t')}</h2>
        <Avatar
          src={person.headimgurl}
          className={styles.profileAvatar}
        />
        <h1 className="my2">{person.firstName} {person.lastName}</h1>
        <div className="px4">
          <Divider>{intl.get('if.you.are')}</Divider>
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
                fb='inviteMember'
              />
            </TabPane>
            <TabPane tab={<span><Icon type="mail" />{intl.get('login.by.email')}</span>} key="mail">
              <EmailCaptcha 
                checkEmail={checkEmail}
                getCaptcha={this.getEmailCaptcha}
                checkCaptcha={this.checkEmailCaptcha}
                captchaTips={emailCaptchaTips}
                token={token}
                fb='inviteMember'
              />
            </TabPane>
          </Tabs>
        </div>
        {whereNow === 'wechat' ? (<ShareAppMessage
          getWechatJsConfig={getWechatJsConfig}
          jsApiList={["onMenuShareAppMessage"]}
          title={intl.get('hiredchina.com.invit')}
          desc={intl.get('{nickname}.invites.{', {nickname, firstName, lastName})}
          imgUrl='http://image.hiredchina.com/hc_logo_300x300.jpg'
        />):(<div />)}
        
        
      </div>

    )
  }
}

export default MemberPage;
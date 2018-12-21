import React, { Component } from 'react';
import { Avatar, Divider, Tabs, Icon } from 'antd';
import { connect } from 'dva';
import intl from 'react-intl-universal';
import styles from '../index.less';
import ShareAppMessage from '@/components/ShareAppMessage';
import { where } from '@/utils';
import MobileCaptcha from '@/components/MobileCaptcha';
import EmailCaptcha from '@/components/EmailCaptcha';
import { getWechatJsConfig } from '@/services/api';
import { checkPhone, getSupports, checkEmail } from '@/services/agent';
import { string } from 'util_react_web';

const { getIntl } = string;

const { TabPane } = Tabs;

@connect(({ personInvite, phoneLogin, emailLogin }) => ({ personInvite, phoneLogin, emailLogin }))
class MemberPage extends Component {
  constructor(ctx) {
    super(ctx);
    const { match } = ctx;
    const {
      params: { token },
    } = match;
    this.state = {
      token,
    };
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
    const { personInvite, phoneLogin, emailLogin } = this.props;
    const { token } = this.state;
    const { user, person } = personInvite;
    const { nickname } = user;
    const { firstName, lastName } = person;
    const whereNow = where();
    const { captchaTips: phoneCaptchaTips } = phoneLogin;
    const { captchaTips: emailCaptchaTips } = emailLogin;

    return (
      <div style={{ textAlign: 'center' }}>
        <Avatar src={user.headimgurl} className={styles.profileAvatar} />
        <h1 className="my2">{user.nickname}</h1>
        <Divider />
        <h2 className="mb2">{ getIntl(intl, 'loginsys.invites.you.to.use', 'Invites you to use the services of HiredChina.com')}</h2>
        <Avatar src={person.headimgurl} className={styles.profileAvatar} />
        <h1 className="my2">
          {person.firstName} {person.lastName}
        </h1>
        <div className="px4">
          <Divider>{getIntl(intl, 'loginsys.if.you.are', 'If you are')}</Divider>
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
                fb="inviteMember"
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
                fb="inviteMember"
              />
            </TabPane>
          </Tabs>
        </div>
        {whereNow === 'wechat' ? (
          <ShareAppMessage
            getWechatJsConfig={getWechatJsConfig}
            title={getIntl(intl, 'loginsys.hiredchina.com.invite', 'HiredChina.com Invite')}
            desc={getIntl(intl, 'loginsys.member.invite.share.desc', `${nickname} invites ${firstName} ${lastName} to use HiredChina.com`, { nickname, firstName, lastName })}
            imgUrl="http://image.hiredchina.com/hc_logo_300x300.jpg"
          />
        ) : (
          <div />
        )}
      </div>
    );
  }
}

export default MemberPage;


import React, { PureComponent } from 'react';
import { config, where, getPageQuery } from '@/utils'
import { Icon, Button } from 'antd';
import { connect } from 'dva';
import intl from 'react-intl-universal';

import style from './index.less';
import { url } from '@/services/wechat';
import Script from '@/components/Script';

@connect(({ wechatLogin }) => ({ wechatLogin }))
class WechatLogin extends PureComponent {
  state = { initDone: false, showBtn: false };

  scriptLoaderCount = 0;

  componentDidMount() {
    const urlParams = new URL(window.location.href);
    const params = getPageQuery();
    const { redirect, code } = params;
    const redirectUri = `${urlParams.origin}/user/login`
   
    const whereNow = where()
    const showBtn = whereNow === 'mobile' || whereNow === 'wechat';

    const willUpdateState = {
      initDone: true,
      showBtn
    }
    if (showBtn) {
      if (!code && redirect !== redirectUri) {
        url({
          url: redirectUri,
          type: 'snsapi_userinfo',
          state: redirect || ''
        }).then( res => {
          const { data } = res
          if (whereNow === 'wechat') {
            window.location.href = data
          } else {
            willUpdateState.authUrl = data
            this.setState(willUpdateState);
          }
        });
      }
    } else {
      this.setState(willUpdateState);
    }
  }

  handleScriptLoad = () => {
    // eslint-disable-next-line no-plusplus
    ++this.scriptLoaderCount;
    const urlParams = new URL(window.location.href);
    const params = getPageQuery();
    const { redirect } = params;
    const redirectUri = `${urlParams.origin}/user/login`
    // 两个js脚本
    if (this.scriptLoaderCount === 1) {
      // eslint-disable-next-line no-unused-vars
      const obj = new window.WxLogin({
        id: "wechatLogin", 
        appid: config.wechatAppid, 
        scope: "snsapi_login", 
        redirect_uri: redirectUri,
        state: encodeURIComponent(`webapp|${redirect || ''}`),
        style: "",
        href: ""
      })
    }
  }
    
  render() {
    const { initDone, showBtn, authUrl } = this.state
    return ( 
      initDone && 
      showBtn ? (
        <Button 
          href={authUrl} 
          block 
          className={style.wechatBtn}
          size='large'
        >
          <Icon type="wechat" />
          { intl.get('use.wechat.login')}
        </Button>
      ) : (
        <div>
          <div id='wechatLogin' className={style.wechatLogin} />
          <Script
            url="http://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js"
            onLoad={this.handleScriptLoad}
          />
        </div>
      )
    )
  }
}

export default WechatLogin;
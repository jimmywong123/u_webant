
import React, { PureComponent } from 'react';
import { config, where, getPageQuery } from '@/utils'
import { Icon, Button, Avatar } from 'antd';
import { connect } from 'dva';
import intl from 'react-intl-universal';

import styles from './index.less';
import { url } from '@/services/wechat';
import Script from '@/components/Script';

@connect(({ wechatBind }) => ({ wechatBind }))
class WechatBind extends PureComponent {
  state = { initDone: false, showBtn: false };

  scriptLoaderCount = 0;

  componentDidMount() {
    const { dispatch } = this.props;
    const urlParams = new URL(window.location.href);
    const params = getPageQuery();
    const { code, state } = params;
    const redirectUri = `${urlParams.origin}`
   
    const whereNow = where()
    const showBtn = whereNow === 'mobile' || whereNow === 'wechat';

    const willUpdateState = {
      initDone: true,
      showBtn
    }
    if (code) {
      let which = 'wechat';
      if (state && state.indexOf('webapp|') === 0) {
        which = 'webapp';
      }
      dispatch({
        type: 'wechatBind/bind',
        payload: { code, which }
      })
      this.setState(willUpdateState);
    } else if (showBtn) {
      url({
        url: redirectUri,
        type: 'snsapi_userinfo',
      }).then( res => {
        const { data } = res
        willUpdateState.authUrl = data
        this.setState(willUpdateState);
      });
    } else {
      this.setState(willUpdateState);
    }
  }

  handleScriptLoad = () => {
    // eslint-disable-next-line no-plusplus
    ++this.scriptLoaderCount;
    const urlParams = new URL(window.location.href);
    const redirectUri = `${urlParams.origin}`
    // 两个js脚本
    if (this.scriptLoaderCount === 1) {
      // eslint-disable-next-line no-unused-vars
      const obj = new window.WxLogin({
        id: "wechatLogin", 
        appid: config.wechatAppid, 
        scope: "snsapi_login", 
        redirect_uri: redirectUri,
        state: encodeURIComponent(`webapp|`),
        style: "",
        href: ""
      })
    }
  }

  handleUnbindClick = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'wechatBind/unbind'
    })
  }
    
  render() {
    const { initDone, showBtn, authUrl } = this.state
    const { wechatBind: { wechatuser }} = this.props
    if (wechatuser) {
      return (
        <div style={{ textAlign: "center"}}>
          <Avatar
            src={wechatuser.headimgurl}
            className={styles.avatar}
          />  
          <h1 className="my2">{wechatuser.nickname}</h1>
          <h3>
            <Icon type="check-circle" /> {intl.get('bind.wechat.success')}
          </h3>
          <Button type="danger" block onClick={this.handleUnbindClick}>{intl.get('remove.this.binding')}</Button>
        </div>
      )
    }
    return ( 
      initDone && 
      showBtn ? (
        <Button 
          href={authUrl} 
          block 
          className={styles.wechatBtn}
          size='large'
        >
          <Icon type="wechat" />
          { intl.get('use.wechat.login')}
        </Button>
      ) : (
        <div>
          <div id='wechatLogin' className={styles.wechatLogin} />
          <Script
            url="http://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js"
            onLoad={this.handleScriptLoad}
          />
        </div>
      )
    )
  }
}

export default WechatBind;
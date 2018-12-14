import React, { Component } from 'react';
import Script from '../Script'

class ShareAppMessage extends Component {
  
  scriptLoaderCount = 0;

  handleScriptLoad = () => {
    // eslint-disable-next-line no-plusplus
    ++this.scriptLoaderCount;
    if (this.scriptLoaderCount === 1) {
      const jsApiList = ["onMenuShareAppMessage"];
      const { title, desc, imgUrl, success, cancel, getWechatJsConfig } = this.props;
      getWechatJsConfig({
        jsApiList,
        url: window.location.href
      }).then( jsConfigRes => {
        const { data: jsConfig } = jsConfigRes
        const { wx } = window
        wx.config(jsConfig);      
        wx.error((res) => {
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
          console.log('error', res)
        });
        wx.ready((a) => {
          console.log('ready', a)
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
          wx.checkJsApi({
              jsApiList, // 需要检测的JS接口列表，所有JS接口列表见附录2,
              success(res) {
                  // 以键值对的形式返回，可用的api值true，不可用为false
                  // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                if (res) {
                  const { checkResult } = res
                  if (checkResult) {
                    if (checkResult.onMenuShareAppMessage) {
                      wx.onMenuShareAppMessage({
                        title, // 分享标题
                        desc, // 分享描述
                        link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl, // 分享图标
                        success () { 
                          // 用户确认分享后执行的回调函数
                          if (success) {
                            success()
                          }
                        },
                        cancel () { 
                          // 用户取消分享后执行的回调函数
                          if (cancel) {
                            cancel()
                          }
                        }
                      })
                    }
                  }
                }
              }
          });
        
        });
      })
    }
  }

  render() {
    return (
      <Script
        url="http://res.wx.qq.com/open/js/jweixin-1.2.0.js"
        onLoad={this.handleScriptLoad}
      />
    )
  }
}

export default ShareAppMessage;
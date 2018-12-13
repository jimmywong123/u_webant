import { parse } from 'qs';
import config from './config'
import request from './request'
import LS from './storage'
import Delay from './delay'

const getPageQuery = () => parse(window.location.href.split('?')[1])

const where = () => {
  const ua = window.navigator.userAgent.toLowerCase();

  if(ua.match(/MicroMessenger/i)){
    return 'wechat'
  } if ((ua.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
    return 'mobile'
  }
  return 'pc'
}

module.exports = {
  config,
  request,
  getPageQuery,
  LS,
  Delay,
  where
}
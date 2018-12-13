// const APIV1 = 'http://127.0.0.1:7004'
const APIV1 = '/api/v1'
const APIV2 = '/api/v2'

module.exports = {
  APIV1,
  APIV2,
  api: {
    base: `${APIV1}/base`,
    login: `${APIV1}/login`,
    user: `${APIV1}/users`,
    wechat: `${APIV1}/wechat`,
  },
  haveHeaderSearch: false,
  haveNotice: false,
  wechatAppid: 'xxxxx',
  
}
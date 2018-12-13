
import Mock from 'mockjs';

Mock.mock(RegExp('/api/v1/setting/phone/.*'), 'post', () => ({"code":0,"data":{"errSms":"the.number.is.incorr"},"msg":"请求成功"}))

export default {
  'POST /api/v1/invite/member': {"data":{
    user: {
      headimgurl: 'http://image.hiredchina.com/Fm_MRxEJSyL0dZZzl0VRmbWAAyMq',
      nickname: 'Thomas Lau'
    },
    person: {
      headimgurl: 'http://image.hiredchina.com/FnuiynqbmEIXjKK_Jnl7s6wCx2Xb',
      firstName: 'First',
      lastName: 'Last',
    }
  }},
  'POST /api/v1/invite/company': {"data":{
    user: {
      headimgurl: 'http://image.hiredchina.com/Fm_MRxEJSyL0dZZzl0VRmbWAAyMq',
      nickname: 'Thomas Lau'
    },
    company: {
      line: '__1543308672676',
      logoimgurl: 'http://image.hiredchina.com/FqnCWqsS3ZvQFFUrDk_aQpS5tzP7?imageView2/2/w/150',
      name: 'QIANKANG Clinic',
    }
  }},

  'GET /api/v1/setting/wechat': {"data":{
    nickname: 'Thomas Lau',
    headimgurl: 'http://image.hiredchina.com/FqnCWqsS3ZvQFFUrDk_aQpS5tzP7?imageView2/2/w/150',
  }},

  'GET /api/v1/setting/email': {
    "data": ['ttt***@qq.com', 'tss***@126.com']
  },
  'GET /api/v1/setting/phone': {
    "data": ['+(86) 134****7829', '+(95) 12****562']
  },
  'GET /api/v1/upload/token': {"code":0,"data":{"token":"9DHqu08vPggvQkuwG49k8kneA9dGSN_SSQwgwOYD:PnfHoeGf53RKkWavvAYeh7Q79nE=:eyJzY29wZSI6ImhpcmVkY2hpbmEiLCJkZWFkbGluZSI6MTU0NDY5MzQzM30=","origin":"http://image.hiredchina.com"},"msg":"请求成功"},
  'POST /api/v1/setting/phone/:phone': {"code":0,"data":{"errSms":"the.number.is.incorr"},"msg":"请求成功"},
  'DELETE /api/v1/setting/wechat': {"code":0,"data":{"errSms":"data.not.found"},"msg":"请求成功"},
}

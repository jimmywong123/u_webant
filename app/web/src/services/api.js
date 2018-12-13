import { request, config } from '@/utils'

export async function getMobileCaptcha(phone) {
  const path = `/phone/${phone}/captcha`
  return request(`${config.APIV1}${path}`, { method: 'POST'})
}

export async function checkMobileCaptcha(phone, captcha) {
  const path = `/phone/${phone}/${captcha}`
  return request(`${config.APIV1}${path}`)
}

export async function getEmailCaptcha(email) {
  const path = `/email/${encodeURIComponent(email)}/captcha`
  return request(`${config.APIV1}/${path}`)
}

export async function checkEmailCaptcha(email, captcha) {
  const path = `/email/${encodeURIComponent(email)}/${captcha}`
  return request(`${config.APIV1}${path}`)
}

export async function getDateFromMemberToken(token) {
  const path = '/invite/member'
  return request(`${config.APIV1}${path}`, {
    method: 'POST',
    body: {
      token
    }
  })
}

export async function getDateFromCompanyToken(token) {
  const path = '/invite/company'
  return request(`${config.APIV1}${path}`, {
    method: 'POST',
    body: {
      token
    }
  })
}

export async function getWechatJsConfig(body) {
  const path = '/wechat/js'
  return request(`${config.APIV1}${path}`, {
    method: 'POST',
    body,
  })
}


export async function xxxPhoneList() {
  const path = '/setting/phone'
  return request(`${config.APIV1}${path}`)
}

export async function bindPhone({ phone, captcha }) {
  const path = '/setting/phone'
  return request(`${config.APIV1}${path}`, {
    method: 'POST',
    body: { phone, captcha }
  })
}

export async function unbindPhone(phone) {
  const path = `/setting/phone/${phone}`
  return request(`${config.APIV1}${path}`, {
    method: 'DELETE'
  })
}

export async function xxxEmailList() {
  const path = '/setting/email'
  return request(`${config.APIV1}${path}`)
}

export async function bindEmail({ email, captcha }) {
  const path = '/setting/email'
  return request(`${config.APIV1}${path}`, {
    method: 'POST',
    body: { email, captcha }
  })
}

export async function unbindEmail(email) {
  const path = `/setting/email/${encodeURIComponent(email)}`
  return request(`${config.APIV1}${path}`, {
    method: 'DELETE'
  })
}


export async function getWechatuser() {
  const path = '/setting/wechat'
  return request(`${config.APIV1}${path}`)
}

export async function bindWechat(code) {
  const path = '/setting/wechat'
  return request(`${config.APIV1}${path}`, {
    method: 'POST',
    body: { code }
  })
}

export async function bindWebapp(code) {
  const path = '/setting/webapp'
  return request(`${config.APIV1}${path}`, {
    method: 'POST',
    body: { code }
  })
}

export async function unbindWechat() {
  const path = '/setting/wechat'
  return request(`${config.APIV1}${path}`, {
    method: 'DELETE'
  })
}

export async function uploadAttachment(body) {
  const path = '/upload/attachment'
  return request(`${config.APIV1}${path}`, {
    method: 'POST',
    body
  })
}

export async function uploadToken() {
  const path = '/upload/token'
  return request(`${config.APIV1}${path}`)
}


export async function updateHeadimg(headimgurl) {
  const path = '/setting/headimgurl'
  return request(`${config.APIV1}${path}`, {
    method: 'PUT',
    body: { headimgurl }
  })
}
export async function updateNickname(nickname) {
  const path = '/setting/nickname'
  return request(`${config.APIV1}${path}`, {
    method: 'PUT',
    body: { nickname }
  })
}



// TODO
export async function queryNotices() {
  return request('/api/notices');
}

import { request, config } from '@/utils'


export async function phoneLogin(playload) {
  console.log('login payload', playload)
  const { sendMobile, captcha } = playload
  const path = `${config.api.login}/phone`
  return request(path, {
    method: 'POST',
    body: {sendMobile, captcha}
  })
}

export async function emailLogin(playload) {
  const path = `${config.api.login}/email`
  const { email, captcha } = playload
  return request(path, {
    method: 'POST',
    body: {email, captcha}
  })
}


export async function wechatLogin(playload) {
  const path = `${config.api.login}/wechat`
  return request(path, {
    method: 'POST',
    body: playload
  })
}


export async function webappLogin(playload) {
  const path = `${config.api.login}/webapp`
  return request(path, {
    method: 'POST',
    body: playload
  })
}


export async function inviteMemberPhoneLogin(playload) {
  const path = `${config.api.login}/invite/member/phone`
  const { token, sendMobile, captcha } = playload
  return request(path, {
    method: 'POST',
    body: {
      token, sendMobile, captcha
    }
  })
}

export async function inviteMemberEmailLogin(playload) {
  const path = `${config.api.login}/invite/member/email`
  const { token, email, captcha } = playload
  return request(path, {
    method: 'POST',
    body: {
      token, email, captcha
    }
  })
}


export async function inviteCompanyPhoneLogin(playload) {
  const path = `${config.api.login}/invite/company/phone`
  const { token, sendMobile, captcha } = playload
  console.log('inviteCompanyPhoneLogin', playload)
  return request(path, {
    method: 'POST',
    body: {
      token, sendMobile, captcha
    }
  })
}

export async function inviteCompanyEmailLogin(playload) {
  const path = `${config.api.login}/invite/company/email`
  const { token, email, captcha } = playload
  console.log('inviteCompanyEmailLogin', playload)
  return request(path, {
    method: 'POST',
    body: {
      token, email, captcha
    }
  })
}


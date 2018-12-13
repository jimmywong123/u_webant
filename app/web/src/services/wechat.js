import { request, config } from '@/utils'

export async function url(playload) {
  const path = `${config.api.wechat}/url`
  return request(path, {
    method: 'POST',
    body: playload
  })
}

export async function jsConfig() {
  const path = `${config.api.wechat}/js`
  return request(path)
}

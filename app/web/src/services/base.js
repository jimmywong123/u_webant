import { request, config } from '@/utils'

export async function getI18n(lan) {
  let path = '/i18n'
  if (lan) {
    path = `/i18n/${lan}`
  } 
  return request(`${config.api.base}/${encodeURIComponent(path)}`)
}

export async function getSystem() {
  const path = '/system'
  return request(`${config.api.base}/${encodeURIComponent(path)}`)
}

export async function getMenu() {
  const path = '/menu'
  return request(`${config.api.base}/${encodeURIComponent(path)}`)
}

// export async function queryCurrent() {
//   const path = '/current'
//   return request(`${config.api.base}/${encodeURIComponent(path)}`)
// }


export async function queryCurrent() {
  return request(`${config.api.base}/current`)
}

export async function logout() {
  return request(`${config.api.base}/logout`)
}

export async function getSystemPath(system) {
  const path = `/path/${system}`
  return request(`${config.api.base}/${encodeURIComponent(path)}`)

  // return { data: 'http://localhost:3101'}
}

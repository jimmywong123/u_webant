import { logout, getSystemPath } from '@/services/base';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';
import { routerRedux } from 'dva/router';
import { LS, getPageQuery } from '@/utils';
import { login } from 'u_webant_base';

const model = login({
  logout, getSystemPath, setAuthority, reloadAuthorized, LS
})
model.effects = {
  ...model.effects,
  *login({ payload }, { put }) {
    yield put({
      type: 'changeLoginStatus',
      payload,
    });
    LS.setItem('U_token', payload.token)
    reloadAuthorized();

    let { redirect } = payload
    if (!redirect){
      const params = getPageQuery();
      const { redirect: url } = params
      redirect = url;
    } 
    
    if (redirect) {
      redirect = decodeURIComponent(redirect);
      try {
        const urlParams = new URL(window.location.href);
        const redirectUrlParams = new URL(redirect);
        // 判断是否同域
        if (redirectUrlParams.origin === urlParams.origin) {
          redirect = redirect.substr(urlParams.origin.length);
          if (redirect.startsWith('/#')) {
            redirect = redirect.substr(2);
          }
        } else {
          if (redirect.indexOf('?') > 0) {
            if (redirect.indexOf('utoken=') < 0) {
              redirect = `${redirect}&utoken=${payload.token}`
            }
          } else {
            redirect = `${redirect}?utoken=${payload.token}`
          }
          window.location.href = redirect;
          return;
        }
      } catch (error) {
        console.error('login model effects login', error)
      }
      
    }
    yield put({
      type: 'user/fetchCurrent',
    });
    yield put(routerRedux.replace(redirect || '/'));
  }
}

export default model;

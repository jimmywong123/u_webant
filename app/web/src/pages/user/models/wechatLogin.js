
import { wechatLogin, webappLogin } from '@/services/login';
import { url } from '@/services/wechat';

export default {
  namespace: 'wechatLogin',

  state: {
    authUrl: ''
  },

  reducers: {
    fetchUrl(state, { payload: { authUrl }}) {
      return { ...state, authUrl };
    },
  },

  effects: {
    *getAuthUrl({ payload }, { call, put }) {
      const { data: authUrl } = yield call(url, payload);
      yield put({ type: 'fetchUrl', payload: { authUrl } });
    },

    *login({ payload: { code, redirect } }, { call, put }){
      const { data } = yield call(wechatLogin, { code } );
      if (data.token) {
        if (redirect) {
          data.redirect = redirect
        }
        yield put({
          type: 'login/login',
          payload: data
        });
      } 
    },

    *webappLogin({ payload: { code, redirect } }, { call, put }){
      const { data } = yield call(webappLogin, { code });
      if (data.token) {
        if (redirect) {
          data.redirect = redirect
        }
        yield put({
          type: 'login/login',
          payload: data
        });
      } 
    },
  },

}
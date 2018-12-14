import { emailLogin, inviteMemberEmailLogin, inviteCompanyEmailLogin } from '@/services/login';
import { getEmailCaptcha, checkEmailCaptcha } from '@/services/api';

export default {
  namespace: 'emailLogin',

  state: {
    captchaTips: 'we.must.make.sure.th',
  },

  reducers: {
    fetchCaptchaTips(
      state,
      {
        payload: { captchaTips },
      }
    ) {
      return { ...state, captchaTips };
    },
  },

  effects: {
    *getCaptcha({ payload }, { call, put }) {
      yield call(getEmailCaptcha, payload);
      yield put({ type: 'fetchCaptchaTips', payload: { captchaTips: 'the.captcha.has.been' } });
    },

    *checkCaptcha({ payload }, { call, put }) {
      const { email, captcha, fb } = payload;
      const newPayload = { ...payload };
      delete newPayload.fb;

      const response = yield call(checkEmailCaptcha, email, captcha);
      const { data } = response;
      if (data) {
        yield put({ type: fb || 'login', payload: newPayload });
      } else {
        yield put({ type: 'fetchCaptchaTips', payload: { captchaTips: 'invalid.captcha' } });
      }
    },

    *inviteMember({ payload }, { call, put }) {
      const response = yield call(inviteMemberEmailLogin, payload);
      const { data } = response;
      if (data.token) {
        yield put({
          type: 'login/login',
          payload: data,
        });
      } else {
        yield put({ type: 'fetchCaptchaTips', payload: { captchaTips: 'invalid.captcha' } });
      }
    },

    *inviteCompany({ payload }, { call, put }) {
      const response = yield call(inviteCompanyEmailLogin, payload);
      const { data } = response;
      if (data.token) {
        yield put({
          type: 'login/login',
          payload: data,
        });
      } else {
        yield put({ type: 'fetchCaptchaTips', payload: { captchaTips: 'invalid.captcha' } });
      }
    },

    *login({ payload }, { call, put }) {
      const response = yield call(emailLogin, payload);
      const { data } = response;
      if (data.token) {
        yield put({
          type: 'login/login',
          payload: data,
        });
      } else {
        yield put({ type: 'fetchCaptchaTips', payload: { captchaTips: 'invalid.captcha' } });
      }
    },
  },
};

import { phoneLogin, inviteMemberPhoneLogin, inviteCompanyPhoneLogin } from '@/services/login';
import { getMobileCaptcha, checkMobileCaptcha } from '@/services/api';

export default {
  namespace: 'phoneLogin',

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
      yield call(getMobileCaptcha, payload);
      yield put({ type: 'fetchCaptchaTips', payload: { captchaTips: 'the.captcha.has.been' } });
    },

    *checkCaptcha({ payload }, { call, put }) {
      const { sendMobile, captcha, fb } = payload;
      const newPayload = { ...payload };
      delete newPayload.fb;

      const response = yield call(checkMobileCaptcha, sendMobile, captcha);
      const { data } = response;
      if (data) {
        yield put({ type: fb || 'login', payload: newPayload });
      } else {
        yield put({ type: 'fetchCaptchaTips', payload: { captchaTips: 'invalid.captcha' } });
      }
    },

    *inviteMember({ payload }, { call, put }) {
      const response = yield call(inviteMemberPhoneLogin, payload);
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
      const response = yield call(inviteCompanyPhoneLogin, payload);
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
      const response = yield call(phoneLogin, payload);
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

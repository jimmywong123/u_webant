import { bindWebapp, bindWechat, unbindWechat, getWechatuser } from '@/services/api';
import { message } from 'antd';
import intl from 'react-intl-universal';
import { string } from 'util_react_web';

const { getIntl } = string;

export default {
  namespace: 'wechatBind',

  state: {
    wechatuser: null,
  },

  reducers: {
    fetchWechatuser(
      state,
      {
        payload: { wechatuser },
      }
    ) {
      return { ...state, wechatuser };
    },
    fetchVisible(
      state,
      {
        payload: { visible },
      }
    ) {
      return { ...state, visible };
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const { data: wechatuser } = yield call(getWechatuser, payload);
      yield put({ type: 'fetchWechatuser', payload: { wechatuser } });
    },

    *bind(
      {
        payload: { code, which },
      },
      { call, put }
    ) {
      const fb = which === 'wechat' ? bindWechat : bindWebapp;
      const {
        data: { errSms = '', succeed },
      } = yield call(fb, code);
      if (succeed) {
        message.success(getIntl(intl, 'base.succeed', 'Succeed'));
      } else if (errSms) {
        message.error(getIntl(intl, errSms));
      }
      yield put({ type: 'fetch' });
    },

    *unbind({ payload }, { call, put }) {
      const {
        data: { succeed, errSms },
      } = JSON.parse(yield call(unbindWechat, payload));
      if (succeed) {
        message.success(getIntl(intl, 'base.succeed', 'Succeed'));
      } else if (errSms) {
        message.error(getIntl(intl, errSms));
      }
      yield put({ type: 'fetch' });
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname }) => {
        if (pathname === '/setting') {
          dispatch({ type: 'fetch' });
        }
      });
    },
  },
};

import { xxxEmailList, bindEmail, unbindEmail } from '@/services/api';
import { message } from 'antd';
import intl from 'react-intl-universal';
import { string } from 'util_react_web';

const { getIntl } = string;

export default {
  namespace: 'emailBind',

  state: {
    list: [],
    visible: false,
  },

  reducers: {
    fetchList(
      state,
      {
        payload: { list, visible = false },
      }
    ) {
      return { ...state, list, visible };
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
    *change({ payload }, { put }) {
      yield put({ type: 'fetchVisible', payload: { visible: payload } });
    },

    *fetch(
      {
        payload: { visible },
      },
      { call, put }
    ) {
      const { data: list } = yield call(xxxEmailList, {});
      yield put({ type: 'fetchList', payload: { list, visible } });
    },

    *bind(
      {
        payload: { email, captcha },
      },
      { call, put }
    ) {
      const {
        data: { errSms = '', succeed },
      } = yield call(bindEmail, { email, captcha });
      if (succeed) {
        message.success(getIntl(intl, 'base.succeed', 'Succeed'));
      } else if (errSms) {
        message.error(getIntl(intl, errSms));
      }
      yield put({ type: 'fetch', payload: {} });
    },

    *unbind(
      {
        payload: { email },
      },
      { call, put }
    ) {
      const {
        data: { succeed, errSms },
      } = JSON.parse(yield call(unbindEmail, email));
      if (succeed) {
        message.success(getIntl(intl, 'base.succeed', 'Succeed'));
      } else if (errSms) {
        message.error(getIntl(intl, errSms));
      }
      yield put({ type: 'fetch', payload: { visible: !succeed } });
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname }) => {
        if (pathname === '/setting') {
          dispatch({ type: 'fetch', payload: {} });
        }
      });
    },
  },
};

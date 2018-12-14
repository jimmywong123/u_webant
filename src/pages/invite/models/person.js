import { getDateFromMemberToken } from '@/services/api';

export default {
  namespace: 'personInvite',

  state: {
    user: {},
    person: {},
  },

  reducers: {
    fetchData(
      state,
      {
        payload: { user, person },
      }
    ) {
      return { ...state, user, person };
    },
  },

  effects: {
    *fetch(
      {
        payload: { token },
      },
      { call, put }
    ) {
      const {
        data: { user, person },
      } = yield call(getDateFromMemberToken, token);
      yield put({ type: 'fetchData', payload: { user, person } });
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        const test = /^\/invite\/[\S]*\/member$/;
        const token = pathname.replace(/^\/invite\//, '').replace(/\/member$/, '');
        if (test.test(pathname)) {
          dispatch({ type: 'fetch', payload: { token } });
        }
      });
    },
  },
};

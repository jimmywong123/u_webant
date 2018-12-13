

import { getDateFromCompanyToken} from '@/services/api';

export default {
  namespace: 'companyInvite',

  state: {
    user: {},
    company: {},
  },

  reducers: {
    fetchData(state, { payload: { user, company }}) {
      return { ...state, user, company };
    },
  },

  effects: {
    *fetch({ payload: { token } }, { call, put }) {
      const { data: { user, company } } = yield call(getDateFromCompanyToken, token);
      yield put({ type: 'fetchData', payload: { user, company } });
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        const test = /^\/invite\/[\S]*\/company$/
        const token = pathname.replace(/^\/invite\//, '').replace(/\/company$/, '')
        if (test.test(pathname)) {
          dispatch({ type: 'fetch', payload: { token }})
        }
      });
    }
  }

}
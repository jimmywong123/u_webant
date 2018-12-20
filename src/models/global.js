import { queryNotices } from '@/services/api';
import { getSystem } from '@/services/base';
// import { global } from 'u_webant_base';

const global = ({queryNotices, getSystem}) => {
  return {
    namespace: 'global',
  
    state: {
      collapsed: false,
      notices: [],
      system: {}
    },
  
    effects: {
      *fetchSystem(_, { call, put }) {
        const { data } = yield call(getSystem);
        yield put({
          type: 'saveSystem',
          payload: data,
        });
      },
      *fetchNotices(_, { call, put }) {
        const data = yield call(queryNotices);
        yield put({
          type: 'saveNotices',
          payload: data,
        });
        yield put({
          type: 'user/changeNotifyCount',
          payload: data.length,
        });
      },
      *clearNotices({ payload }, { put, select }) {
        yield put({
          type: 'saveClearedNotices',
          payload,
        });
        const count = yield select(state => state.global.notices.length);
        yield put({
          type: 'user/changeNotifyCount',
          payload: count,
        });
      },
    },
  
    reducers: {
      saveSystem(state, { payload }) {
        return {
          ...state,
          system: payload,
        };
      },
      changeLayoutCollapsed(state, { payload }) {
        return {
          ...state,
          collapsed: payload,
        };
      },
      saveNotices(state, { payload }) {
        return {
          ...state,
          notices: payload,
        };
      },
      saveClearedNotices(state, { payload }) {
        return {
          ...state,
          notices: state.notices.filter(item => item.type !== payload),
        };
      },
    },
  
    subscriptions: {
      setup({ history }) {
        // Subscribe history(url) change, trigger `load` action if pathname is `/`
        return history.listen(({ pathname, search }) => {
          if (typeof window.ga !== 'undefined') {
            window.ga('send', 'pageview', pathname + search);
          }
        });
      },
    },
  };
}

const model = global({
  queryNotices,
  getSystem
})



export default model;

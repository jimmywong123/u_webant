import { queryCurrent } from '@/services/base';
import { reloadAuthorized } from '@/utils/Authorized';
import { updateHeadimg, updateNickname } from '@/services/api';
import { LS } from '@/utils';
import { message} from 'antd';
import intl from 'react-intl-universal';

export default {
  namespace: 'user',

  state: {
    currentUser: {},
    UTOKEN: '',
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const { data, token } = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: { 
          currentUser: data, 
          UTOKEN: token
        },
      });
      let currentAuthority = 'guest';
      let status = false
      if (data && data.roles) {
        currentAuthority = 'user'
        if (data.roles) {
          currentAuthority = data.roles
        }
        status = data.isLock ? 'exception' : 'normal'
      }
      yield put({
        type: 'login/changeLoginStatus',
        payload: {
          status,
          currentAuthority
        },
      });
      reloadAuthorized();
    },
    *updateHeadimg( { payload }, { call, put }) {
      const { data: {errSms, token} } = yield call(updateHeadimg, payload);
      if (token) {
        LS.setItem('U_token', token)
        yield put({type: 'fetchCurrent'});
      } else if (errSms) {
        message.error(intl.get(errSms));
      }
    },
    *updateNickname( { payload }, { call, put }) {
      const { data: {errSms, token} } = yield call(updateNickname, payload);
      if (token) {
        LS.setItem('U_token', token)
        yield put({type: 'fetchCurrent'});
      } else if (errSms) {
        message.error(intl.get(errSms));
      }
    }
    
  },

  reducers: {
    saveCurrentUser(state, { payload: {currentUser, UTOKEN} }) {
      return {
        ...state,
        currentUser: currentUser || {},
        UTOKEN
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};

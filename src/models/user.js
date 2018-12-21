import { queryCurrent } from '@/services/base';
import { reloadAuthorized } from '@/utils/Authorized';
import { updateHeadimg, updateNickname } from '@/services/api';
import { LS } from '@/utils';
import { message } from 'antd';
import intl from 'react-intl-universal';
import { user } from 'u_webant_base';
import { string } from 'util_react_web';

const { getIntl } = string;

const model = user({
  queryCurrent, reloadAuthorized, LS
})
model.effects = {
  ...model.effects,
  *updateHeadimg({ payload }, { call, put }) {
    const {
      data: { errSms, token },
    } = yield call(updateHeadimg, payload);
    if (token) {
      LS.setItem('U_token', token);
      yield put({ type: 'fetchCurrent' });
    } else if (errSms) {
      message.error(getIntl(intl, errSms));
    }
  },
  *updateNickname({ payload }, { call, put }) {
    const {
      data: { errSms, token },
    } = yield call(updateNickname, payload);
    if (token) {
      LS.setItem('U_token', token);
      yield put({ type: 'fetchCurrent' });
    } else if (errSms) {
      message.error(getIntl(intl, errSms));
    }
  },
}

export default model;

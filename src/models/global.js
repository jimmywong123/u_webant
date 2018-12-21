import { queryNotices } from '@/services/api';
import { getSystem, getFooter } from '@/services/base';
import { global } from 'u_webant_base';

const model = global({
  queryNotices,
  getSystem,
  getFooter
})

export default model;

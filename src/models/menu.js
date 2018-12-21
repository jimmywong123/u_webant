import memoizeOne from 'memoize-one';
import Authorized from '@/utils/Authorized';
import intl from 'react-intl-universal';
import { getMenu, getSystemPath } from '@/services/base';


import { menu } from 'u_webant_base';

const model = menu({
  getMenu, getSystemPath, Authorized, intl, memoizeOne
})

export default model;

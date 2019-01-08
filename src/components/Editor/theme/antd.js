/*
 * @author chaolin.jcl 宜鑫
 * @date 2018/10/24
 * @description
 */
import { Quill } from 'react-quill';
import './index.less';

const SnowTheme = Quill.import('themes/snow');

export default class AntdTheme extends SnowTheme {
  extendToolbar(toolbar) {
    super.extendToolbar(toolbar);
  }
}

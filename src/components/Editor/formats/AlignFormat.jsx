/*
 * @author chaolin.jcl 宜鑫
 * @date 2018/10/17
 * @description
 */
import { Quill } from 'react-quill';
const Align = Quill.import('formats/align');

export default class AlignFormat extends Align {
  static blotName = 'align';
  constructor(value) {
    console.log('0000value0', value);
  }
}

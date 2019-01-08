/*
 * @author chaolin.jcl 宜鑫
 * @date 2018/10/16
 * @description
 */
import { Quill } from 'react-quill';
const BlotsEmbed = Quill.import('blots/embed');

export default class AudioFormat extends BlotsEmbed {
  static blotName = 'audio';
  static tagName = 'audio';
  static className = 'at-audio';
  static create(src) {
    const node = super.create();
    const file = src.substr(src.lastIndexOf('/') + 1);
    node.setAttribute('src', src);
    node.setAttribute('controls', 'controls');
    node.setAttribute('data-file', file);
    return node;
  }
  static value(node) {
    return node.getAttribute('src');
  }
}

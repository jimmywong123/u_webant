/*
 * @author chaolin.jcl 宜鑫
 * @date 2018/07/25
 * @description
 */
import { Quill } from 'react-quill';
import nanoid from 'nanoid';
const Header = Quill.import('formats/header');

export default class HeaderFormat extends Header {
  constructor(domNode) {
    super(domNode);
    const id = nanoid().slice(0, 5);
    const link = document.createElement('a');
    link.setAttribute('class', 'anchorLink');
    link.setAttribute('href', `#${id}`);
    domNode.setAttribute('id', id);
    domNode.appendChild(link);
  }
}

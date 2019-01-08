/*
 * @author chaolin.jcl 宜鑫
 * @date 2018/10/17
 * @description
 */
/*
 * @author chaolin.jcl 宜鑫
 * @date 2018/10/16
 * @description
 */
import { Quill } from 'react-quill';

const BlockEmbed = Quill.import('blots/block/embed');
const Inline = Quill.import('blots/inline');
// const TextBlot = Quill.import('blots/text');

class CodeBlock extends BlockEmbed {
  static blotName = 'code-block';
  static className = 'ql-code-block';
  static tagName = 'pre';
  // static allowedChildren = [TextBlot, Break, Cursor];
  static create(value) {
    const { content } = value;
    const domNode = super.create(value);
    domNode.setAttribute('class', 'ql-code-block');
    const code = document.createElement('code');
    code.setAttribute('class', 'ql-syntax');
    code.textContent = content;
    domNode.appendChild(code);
    return domNode;
  }
  static value(node) {
    return {
      content: node.firstChild.textContent,
    };
  }
}

class Code extends Inline {
  static blotName = 'code';
  static tagName = 'CODE';

}
export {
  Code,
  CodeBlock,
};

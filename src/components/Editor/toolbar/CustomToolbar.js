import React, { PureComponent } from 'react';
import { Quill } from 'react-quill';
import screenfull from 'screenfull';
import { Tooltip, Divider, Select } from 'antd';
import cls from 'classnames';
import { IconFont, iconTool } from '../utils/iconTool';
import styles from './CustomToolbar.less';

const { Option } = Select;

const COLOR = ['#000000', '#F5222D', '#FFBF00', '#52C41A', '#1890FF', '#0D1A26', '#314659', '#697B8C', '#FFFFFF'];

export default class Toolbar extends PureComponent {
  constructor(props) {
    super(props);
    const icons = Quill.import('ui/icons');
    Object.assign(icons, {
      bold: iconTool('icon-bold'),
      italic: iconTool('icon-italic'),
      strike: iconTool('icon-strikethrough'),
      underline: iconTool('icon-underline'),
      color: iconTool('icon-font-colors'),
      background: iconTool('icon-font-colors'),
      align: {
        '': iconTool('icon-align-left'),
        'center': iconTool('icon-align-center'),
        'right': iconTool('icon-align-right'),
      },
      indent: {
        '-1': iconTool('icon-outdent'),
        '+1': iconTool('icon-indent'),
      },
      image: iconTool('icon-image'),
      audio: iconTool('icon-yinpin'),
      link: iconTool('icon-attachment'),
      list: {
        ordered: iconTool('icon-orderedlist'),
        bullet: iconTool('icon-unorderedlist'),
      },
      fullScreen: iconTool('icon-arrawsalt'),
    });
  }
  fullScreen = () => {
    const el = document.getElementById('editor-wrapper');
    const editor = document.getElementById('at-editor');

    editor.classList.toggle('screenfull');
    if (screenfull.enabled) {
      console.log('requesting fullscreen');
      screenfull.toggle(el);
    } else {
      console.log('Screenfull not enabled');
    }
  }

  TipWrap = (params) => {
    const {
      format,
      title,
      name,
      value,
      hasValue = false,
      ...restPropts
    } = params;
    const currentFormat = this.props.currentFormat[format];
    const itemCls = cls({
      [name]: true,
      'at-item': true,
      'ql-active': hasValue ? currentFormat === value : !!currentFormat,
    });
    return (
      <Tooltip placement="bottom" title={title}>
        {hasValue ?
          <button className={itemCls} value={value} {...restPropts} /> :
          <button className={itemCls} {...restPropts} />
        }
      </Tooltip>
    );
  };
  onChangeHeaderSize = (value) => {
    const { range, quill } = this.props;
    if (range === null || !quill) return;
    const curEditor = quill.getEditor();
    if (curEditor) {
      curEditor.formatLine(range.index, range.length, 'header', value, 'user');
    }
  }
  undo = () => {
    console.log('---this.props--', this.props);
    const { quill } = this.props;
    if (!quill) return;
    quill.getEditor().history.undo();
  }
  redo = () => {
    const { quill } = this.props;
    if (!quill) return;
    quill.getEditor().history.redo();
  }
  render() {
    const { TipWrap } = this;
    const { quill, currentFormat, children } = this.props;
    const headerCls = cls({
      'at-header': true,
      header: true,
    });
    console.log('---currentFormat-', currentFormat);
    const { header = '' } = currentFormat;
    return (
      <div id="at-toolbar" className={styles.atToolbar}>
        <div className="wrap">
          <Tooltip placement="bottom" title="撤消">
            <button className="ql-history" value="undo" onClick={this.undo}><IconFont type="icon-undo" /></button>
          </Tooltip>

          <Tooltip placement="bottom" title="重做">
            <button className="ql-history" value="redo" onClick={this.redo}><IconFont type="icon-redo" /></button>
          </Tooltip>

        </div>
        <Divider type="vertical" className="divider" />
        <div className="wrap header-wrap">
          <Select defaultValue="" className={headerCls} defaultValue="" value={`${header}`} onChange={this.onChangeHeaderSize}>
            <Option value="1">标题1</Option>
            <Option value="2">标题2</Option>
            <Option value="">正文</Option>
          </Select>
        </div>
        <Divider type="vertical" className="divider" />
        <div className="wrap">
          <TipWrap title="加重" name="ql-bold" format="bold" />
          <TipWrap title="斜体" name="ql-italic" format="italic" />
          <TipWrap title="删除线" name="ql-strike" format="strike" />
          <TipWrap title="下划线" name="ql-underline" format="underline" />
          <Tooltip placement="bottom" className="at-item" title="字体颜色">
            <select className="ql-color">
              {COLOR.map((c, i) =>
                <option key={i} value={c} />
              )}
              <option />
            </select>
          </Tooltip>
          <Tooltip placement="bottom" className="at-item" title="背景颜色">
            <select className="ql-background">
              {COLOR.map((c, i) =>
                <option key={i} value={c} />
              )}
              <option />
            </select>
          </Tooltip>
        </div>
        <Divider type="vertical" className="divider" />
        <div className="wrap">
          <TipWrap title="左对齐" hasValue name="ql-align" value="" format="align" />
          <TipWrap title="居中对齐" hasValue name="ql-align" value="center" format="align" />
          <TipWrap title="右对齐" hasValue name="ql-align" value="right" format="align" />
        </div>
        <Divider type="vertical" className="divider" />
        <div className="wrap">
          <TipWrap title="有序列表" hasValue name="ql-list" value="ordered" format="list" />
          <TipWrap title="无序列表" hasValue name="ql-list" value="bullet" format="list" />
        </div>
        <Divider type="vertical" className="divider" />
        <div className="wrap">
          <TipWrap title="减少缩进" hasValue name="ql-indent" value="-1" format="indent" />
          <TipWrap title="增加缩进" hasValue name="ql-indent" value="+1" format="indent" />
        </div>
        <Divider type="vertical" className="divider" />
        <div className="wrap">
          <TipWrap title="链接" name="ql-link" format="link" />
          <TipWrap title="图像" name="ql-image" format="image" />
          <TipWrap title="音频" name="ql-audio" format="audio" />
          <TipWrap title="引入" name="ql-blockquote" format="blockquote" />
          <TipWrap title="代码块" name="ql-code-block" format="code-block" />
          
          {/* <TipWrap title="公式" name="ql-formula" /> */}
        </div>
        <Divider type="vertical" className="divider" />
        { children }
        <div className="wrap">
          <TipWrap title="全屏" name="ql-fullScreen" format="fullScreen" onClick={this.fullScreen} />
        </div>
      </div>
    );
  }
}

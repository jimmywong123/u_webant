import React, { PureComponent } from 'react';
import extend from 'extend';
import ReactQuill, { Quill } from 'react-quill';
import PropTypes from 'prop-types';
import intl from 'react-intl-universal';
import { Tooltip, Divider, Select } from 'antd';
import { string } from 'util_react_web';

import ImageResize from './plugins/ImageResize';

import AntdTheme from './theme/antd';

import CustomToolbar, { TipWrap } from './toolbar/CustomToolbar';

import styles from './index.less';

const { getIntl } = string;

export default class Editor extends PureComponent {
  quillRef = React.createRef();
  // static getDerivedStateFromProps(nextProps) {
  //   if ('value' in nextProps) {
  //     return {
  //       content: nextProps.value || '',
  //     };
  //   }
  //   return null;
  // }
  static propTypes = {
    modules: PropTypes.object,
  }

  constructor(props) {
    super(props);
    const that = this;

    const value = props.value || ''
    this.state = {
      range: {},
      currentFormat: {},
      value,
      textAreaText: value,
      perviewText: value,
      witch: '',
    }
    const { modules } = this.props;
    this.modules = extend(true, {}, {
      imageResize: {
        modules: ['Resize', 'DisplaySize', 'Toolbar'],
        displaySize: true,
      },
      toolbar: {
        container: '#at-toolbar',
      }
    }, modules);

    Quill.register({
      // modules
      'modules/imageResize': ImageResize,
      // themes
      'themes/antd': AntdTheme,
    }, true);
  }

  componentDidMount() {
    // 暴露编辑器 ref
    const { editorRef } = this.props;
    if (editorRef && typeof editorRef === 'function') {
      editorRef(this.quillRef);
    }
  }
  
  // handleOnChange = content => {
  //   if (!('value' in this.props)) {
  //     this.setState({ content, perviewText: content });
  //   }
  //   this.triggerChange({ content, perviewText: content });
  // }

  handleOnChange = (value, delta, source, editor) => {
    console.log('handleOnChange', delta, source, editor)
    const { witch } = this.state;
    if (witch === 'editor') {
      this.setState({ 
        value,
        textAreaText: value,
        perviewText: value,
        witch: 'editor'
      })
    }
  }

  handleFocus = (range, source, editor) => {
    this.setState({ witch: 'editor' })
  }

  handleOnSelectionChange = (range, source, editor) => {
    if (range === null) return;
    console.log('handleOnSelectionChange', range, source, editor)
    const currentFormat = this.quillRef.current.getEditor().getFormat(range.index, range.length);
    console.log('handleOnSelectionChange currentFormat', currentFormat)
    // this.setState({
    //   range,
    //   currentFormat,
    // })
    if (range.length > 0) {
      // message.info('-666-');
    }
  }

  // triggerChange = (changedValue) => {
  //   // Should provide an event to pass value to Form.
  //   const onChange = this.props.onChange;
  //   if (onChange) {
  //     onChange(Object.assign({}, this.state, changedValue));
  //   }
  // }

  render() {
    const { className, ...restProps } = this.props;
    const { value, currentFormat, range, perviewText } = this.state;
    console.log('render value', value)
    console.log('render perviewText', perviewText)
    return (
      <div
        className={styles.editorWrapper}
        id="editor-wrapper"
      > 
        <CustomToolbar
          quill={this.quillRef.current}
          currentFormat={currentFormat}
          range={range}
        >
          <div className="wrap">
            <TipWrap title="全屏" name="ql-fullScreen" format="fullScreen" onClick={this.fullScreen} />
          </div>
          <Divider type="vertical" className="divider" />
        </CustomToolbar>
        <ReactQuill
          className="techTypo"
          modules={this.modules}
          value={value}
          onChange={this.handleOnChange}
          onChangeSelection={this.handleOnSelectionChange}
          theme="antd"
          id="at-editor"
          ref={this.quillRef}
          onFocus={this.handleFocus}
        />
        <h3>{getIntl( intl, 'base.editor.website.perview', 'Website perview')}</h3>
        <div dangerouslySetInnerHTML={{ __html: perviewText}}></div>
      </div>
    )

  }
}
import React from 'react';
import extend from 'extend';
import ReactQuill, { Quill } from 'react-quill';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ImageResize from './plugins/ImageResize';
import AudioResize from './plugins/AudioResize';
import ImageDrop from './plugins/imageDrop';

import HeaderFormat from './formats/HeaderFormat';
import AudioFormat from './formats/AudioFormat';

import AntdTheme from './theme/antd';

import CustomToolbar from './toolbar/CustomToolbar';

import 'react-quill/dist/quill.snow.css'; 
import styles from './index.less';

export default class UserEditor extends React.PureComponent {
  quillRef = React.createRef();
  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return {
        content: nextProps.value || '',
      };
    }
    return null;
  }
  static propTypes = {
    modules: PropTypes.object,
  }
  constructor(props) {
    super(props);
    const that = this;
    this.state = {
      content: props.value || '',
      range: {},
      currentFormat: {},
    }
    const { modules } = this.props;
    this.modules = extend(true, {},
      {
        imageResize: {
          modules: ['Resize', 'DisplaySize', 'Toolbar'],
          displaySize: true,
        },
        audioResize: {
          modules: ['Toolbar'],
        },
        // imageDrop: {
        //   uploadImage: that.handleUploadRes,
        // },
        toolbar: {
          container: '#at-toolbar',
          handlers: {
            // 图片上传 handler
            // image: that.imageHandler,
            // 音频上传
            audio: that.audioHandler,
          },
        },
        clipboard: {
        }
      },
      modules,
    );
    Quill.register({
      // modules
      'modules/imageDrop': ImageDrop,
      'modules/imageResize': ImageResize,
      'modules/audioResize': AudioResize,
      // formats
      // Hx
      'formats/header': HeaderFormat,
      'formats/audio': AudioFormat,
      // 'formats/align': AlignFormat,
      // 'formats/code-block': CodeBlock,
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
  // 处理拖拽粘贴图片
  // handleUploadRes = file => {
  //   const formdata = new FormData();
  //   if (!this.limitImage(file)) return false;
  //   formdata.append('file', file);
  //   console.log('-formdata-field-', file);
  //   const quill = this.quillRef.current;
  //   const range = quill.getEditor().getSelection() || { index: 0 };
    // nprogress.start();
    // uploadFile(formdata).then(res => {
    //   // 获取光标
    //   quill.getEditor().insertEmbed(range.index, 'image', res.url, 'user');
    //   // 加一个占位
    //   quill.getEditor().insertText(range.index + 1, ' ', 'silent');
    // }).finally(() => {
    //   nprogress.done();
    // });
  // }
  handleOnChange = content => {
    if (!('value' in this.props)) {
      this.setState({ content });
    }
    this.triggerChange({ content });
  }
  handleOnSelectionChange = (range, source, editor) => {
    if (range === null) return;
    const currentFormat = this.quillRef.current.getEditor().getFormat(range.index, range.length);
    this.setState({
      range,
      currentFormat,
    })
    if (range.length > 0) {
      // message.info('-666-');
    }
  }
  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  }
  render() {
    // 编辑器模块
    const { className, ...restProps } = this.props;
    const { value } = this.state;
    return (
      <div
        className={styles.editorWrapper}
        id="editor-wrapper"
      >
        <CustomToolbar
          quill={this.quillRef.current}
          currentFormat={this.state.currentFormat}
          range={this.state.range}
        />
        <ReactQuill
          className="techTypo"
          modules={this.modules}
          value={value}
          onChange={this.handleOnChange}
          onChangeSelection={this.handleOnSelectionChange}
          theme="antd"
          {...restProps}
          id="at-editor"
          ref={this.quillRef}
        />
      </div>
    );
  }
}

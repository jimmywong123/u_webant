import React, {Component, Fragment} from 'react';
import ReactQuill, { Quill } from 'react-quill';
import { FileDrop } from './FileDropAndPaste';
import 'react-quill/dist/quill.snow.css'; 
import intl from 'react-intl-universal';
import { string } from 'util_react_web';
import { Input, message, Icon } from 'antd';
import lrz from 'lrz';
import request from '../_util/request';

const { getIntl } = string;
const { TextArea } = Input;

Quill.register('modules/fileDrop', FileDrop);

const convertBase64UrlToBlob = urlData => {
  //去掉url的头，并转换为byte
  const bytes = window.atob(urlData.split(',')[1]);
  //处理异常,将ascii码小于0的转换为大于0
  const ab = new ArrayBuffer(bytes.length);
  const ia = new Uint8Array(ab);
  ia.forEach((i, index) => {
    ia[index] = bytes.charCodeAt(index);
  });
  return new Blob([ia], { type: urlData.split(',')[0].split(':')[1].split(';')[0] });
};

const getSizeStr = size => {
  if (size > 1024 * 1024) {
    return `${parseInt(size / (1024 * 1024),10) }MB`
  } else if (size > 1024) {
    return `${parseInt(size / 1024, 10)}KB`
  }
  return `${size}B`
}

class SimpEditor extends Component {
  reqs = {};

  constructor(props) {
    super(props)
    this.quill = null;      // Quill instance
    this.editor = null; // ReactQuill component
    const { modules = {
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          ['blockquote', 'code-block'],
    
          ['link', 'image', 'video'],
    
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
          [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
          [{ 'direction': 'rtl' }],                         // text direction
    
          [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    
          [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
          [{ 'font': [] }],
          [{ 'align': [] }],
          ['clean']      
        ],
        handlers: {
          image: this.imageHandler,
          
        }
      },
      fileDrop: {
        handler: this.fileDropHandler
      },
    }, formats = [
      'header',
      'bold', 'italic', 'underline', 'strike', 'blockquote', 
      'background', 'color', 'font', 'code', 'size', 'script',
      'list', 'bullet', 'indent', 'align', 'direction', 'code-block',
      'link', 'image', 'video', 
      // 'formula' (requires KaTex)
    ] } = props;

    this.state = {
      text: '',
      textAreaText: '',
      perviewText: '',
      witch: '',
      modules,
      formats
    }
  }

  componentDidMount() {
    this.attachQuillRefs()
  }
  
  componentDidUpdate() {
    this.attachQuillRefs()
  }
  
  attachQuillRefs = () => {
    if (typeof this.editor.getEditor !== 'function') return;
    this.quill = this.editor.getEditor();

    const span = document.createElement('span');
    var newContent = document.createTextNode("test"); 
    span.appendChild(newContent); 
  }

  insert = (dataUrl, file) => {
    const index = (this.quill.getSelection() || {}).index || this.quill.getLength()
    const { name, size, type } = file;
    console.log('insert', type.indexOf('image') > -1, type.indexOf('image'))
    if (type.indexOf('image') > -1) {
      this.quill.insertEmbed(index, 'image', dataUrl, 'user')
    } else {
      this.quill.insertText(index, `${name}( ${getSizeStr(size)} )`, 'link', dataUrl, 'user')
    }
  }

  fileDropHandler = (dataUrl, file ) => {
    const { type } = file;
    if (type.indexOf('image') > -1) {
      this.imgUpdateHandler(dataUrl, file)
    } else {
      this.updateHandler(convertBase64UrlToBlob(dataUrl), file)
    }
  }

  updateHandler = (bolbFile, file) => {
    const { lastModified, name, size, type } = file;
    const willUpdateFile = new File([bolbFile], name, { type });
    const uid = `${lastModified}${name}${size}`;
    const { data, origin, action, name: filename, onSuccess } = this.props

    this.reqs[uid] = request({
      action: action || 'http://upload-z2.qiniup.com',
      filename: filename || 'file',
      file: willUpdateFile,
      data,
      onProgress: e => {
        // this.upload.onProgress(e, lrzImg);
      },
      onSuccess: ret => {
        delete this.reqs[uid];
        this.insert(`${origin}/${ret.key}`, file)
        if (onSuccess) {
          onSuccess({
            uuid: uid,
            title: name,
            ret,
          });
        }
      },
      onError: err => {
        delete this.reqs[uid];
        message.error(err);
      },
    });
  }

  imageHandler = () => {
    console.log('imageHandler')
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    
    input.onchange = () => {
      const file = input.files[0];
      console.log(file); // works well
      this.imgUpdateHandler(file, file)
    };
  }

  imgUpdateHandler = (dataUrl, file) => {
    lrz(dataUrl, { quality: 0.6 }).then(results => {
      console.log('imgUpdateHandler results', results)
      this.updateHandler(results.file, file)
    });
  };
  
  handleChange = (value, delta, source, editor) => {
    console.log('handleChange', delta, source, editor)
    const { witch } = this.state;
    if (witch === 'editor') {
      this.setState({ 
        text: value,
        textAreaText: value,
        perviewText: value,
        witch: 'editor'
      })
    }
  }

  handleFocus = (range, source, editor) => {
    this.setState({ witch: 'editor' })
  }

  handleTextAreaFocus = e => {
    console.log('handleTextAreaFocus', e)
    this.setState({ witch: 'textArea' })
  }

  handleTextAreaChange = e => {
    const { witch } = this.state;
    if (witch === 'textArea') { 
      const { value } = e.target
      this.setState({ 
        text: value,
        textAreaText: value,
        perviewText: value,
        witch: 'textArea'
      })
    }
  }

  render () {
    const { text, textAreaText, perviewText, modules, formats } = this.state
    return (
      <Fragment>
        <ReactQuill 
          ref={ n => { this.editor = n }}
          value={text}
          onChange={this.handleChange} 
          modules={modules}
          formats={formats}
          onFocus={this.handleFocus}
          
        />
        <hr />
        <h3>{getIntl( intl, 'base.editor.html.perview', 'HTML perview')}</h3>
        <TextArea 
          onChange={this.handleTextAreaChange} 
          rows={4} 
          value={textAreaText}  
          onFocus={this.handleTextAreaFocus}
        />
        <hr />
        <h3>{getIntl( intl, 'base.editor.website.perview', 'Website perview')}</h3>
        <div dangerouslySetInnerHTML={{ __html: perviewText}}></div>
      </Fragment>
     
    );
  }
}

export default SimpEditor;
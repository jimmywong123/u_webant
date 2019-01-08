/*
 * @author chaolin.jcl 宜鑫
 * @date 2018/08/08
 * @description
 */
export default class ImageDrop {
  constructor(quill, options = {}) {
    // save the quill reference
    this.quill = quill;
    this.options = options;
    // listen for drop and paste events
    this.quill.root.addEventListener('drop', this.handleDrop, false);
    this.quill.root.addEventListener('paste', this.handlePaste, false);
  }
  handleImage = dataUrl => {
    console.log('dataUrl', dataUrl);
    if (this.options.hasOwnProperty('uploadImage') && typeof this.options.uploadImage === 'function') {
      const {
        uploadImage,
      } = this.options;
      console.log('uploadImage', uploadImage);
      uploadImage(dataUrl);
    } else {
      // default insert data url
      this.insert(dataUrl);
    }
  }
  handleDrop = evt => {
    if (evt.dataTransfer && evt.dataTransfer.files && evt.dataTransfer.files.length) {
      if (document.caretRangeFromPoint) {
        const selection = document.getSelection();
        const range = document.caretRangeFromPoint(evt.clientX, evt.clientY);
        if (selection && range) {
          selection.setBaseAndExtent(range.startContainer, range.startOffset, range.startContainer, range.startOffset);
        }
      }
      this.filterImage(evt.dataTransfer.files, 'drop');
      // this.readFiles(evt.dataTransfer.files, this.handleImage);
    }
  }

  handlePaste = evt => {
    const clipboardData = evt.clipboardData || evt.originalEvent.clipboardData;
    if (clipboardData && clipboardData.items && clipboardData.items.length) {
      console.log('---evt---', evt.clipboardData);

      const selection = this.quill.getSelection();
      if (selection) {
        // we must be in a browser that supports pasting (like Firefox) so it has
        // already been placed into the editor
      } else {
        // otherwise we wait until after the paste when this.quill.getSelection() will
        // return a valid index
        this.filterImage(clipboardData.items, 'paste');
      }
    }
  }

  /**
	 * Insert the image into the document at the current cursor position
	 * @param {String} dataUrl  The base64-encoded image URI
	 */
  insert(dataUrl) {
    const index = (this.quill.getSelection() || {}).index || this.quill.getLength();
    this.quill.insertEmbed(index, 'image', dataUrl, 'user');
  }
  insertText(text) {
    const index = (this.quill.getSelection() || {}).index || this.quill.getLength();
    this.quill.insertText(index, text);
  }

  filterImage(files, type) {
    // check each file for an image
    [].forEach.call(files, item => {
      if (!item.type.match(/^image\/(gif|jpe?g|a?png|svg|webp|bmp|vnd\.microsoft\.icon)/i)) {
        // file is not an image Note that some file formats such as psd start with
        // image/* but are not readable
        return;
      }
      console.log('--uploading--', item, type);
      if (type === 'drop') {
        this.handleImage(item);
      } else {
        const blob = item.getAsFile();
        if (blob instanceof Blob) {
          // return a valid index
          setTimeout(() => this.handleImage(blob), 0);
        }
      }
    });
  }
}

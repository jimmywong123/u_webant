

export class FileDrop {
  
	constructor(quill, options = {}) {
    this.quill = quill
    console.log('constructor', options)
		this.options = options
		this.handleDrop = this.handleDrop.bind(this)
		this.handlePaste = this.handlePaste.bind(this)
		this.quill.root.addEventListener('drop', this.handleDrop, false)
		this.quill.root.addEventListener('paste', this.handlePaste, false)
	}

	/* handle image drop event
	*/
	handleDrop (e) {
    console.log('handleDrop', e)
    e.preventDefault()
    console.log('handleDrop e.dataTransfer', e.dataTransfer)
    console.log('handleDrop e.dataTransfer.files', e.dataTransfer.files)
    console.log('handleDrop e.dataTransfer.files.length', e.dataTransfer.files.length)
		if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
      console.log('handleDrop document.caretRangeFromPoint', document.caretRangeFromPoint)
			if (document.caretRangeFromPoint) {
				const selection = document.getSelection()
				const range = document.caretRangeFromPoint(e.clientX, e.clientY)
				if (selection && range) {
					selection.setBaseAndExtent(range.startContainer, range.startOffset, range.startContainer, range.startOffset)
				}
			}
			this.readFiles(e.dataTransfer.files, (dataUrl, type, file) => {
        console.log('handleDrop readFiles', dataUrl, type)
				if (typeof this.options.handler === 'function') {
					this.options.handler(dataUrl, file)
				} else {
					this.insert.call(this, dataUrl, file)
				}
			})
		}
	}

  setTimeoutPaste = (dataUrl, file) => {
    setTimeout(() => {
      if (typeof this.options.handler === 'function') {
        this.options.handler(dataUrl, file)
      } else {
        this.insert(dataUrl, file)
      }
    }, 0)
  }

	/* handle image paste event
	*/
	handlePaste (e) {
    console.log('handlePaste', e)
    console.log('handlePaste e.clipboardData', e.clipboardData)
    console.log('handlePaste e.clipboardData.items', e.clipboardData.items)
    console.log('handlePaste e.clipboardData.items.length', e.clipboardData.items.length)
		if (e.clipboardData && e.clipboardData.items && e.clipboardData.items.length) {
			this.readFiles(e.clipboardData.items, (dataUrl, type, file) => {
        console.log('handlePaste readFiles', dataUrl, type, file)
        const userAgent = navigator.userAgent;
        if (userAgent.indexOf('Firefox') > -1) {
          const selection = this.quill.getSelection()
          if (selection) {
          } else {
            this.setTimeoutPaste(dataUrl, file)
          }
        } else {
          this.setTimeoutPaste(dataUrl, file)
        }
			})
		}
  }

	/* read the files
	*/
	readFiles (files, callback) {
		[].forEach.call(files, file => {
      console.log('readFiles file', file)
			const { type, size } = file
			console.log('readFiles type', type)
			// vnd.openxmlformats-officedocument.presentationml.presentation
			// vnd.openxmlformats-officedocument.wordprocessingml.document
			// vnd.openxmlformats-officedocument.spreadsheetml.sheet
			// vnd.ms-excel
			// pdf
			// msword
			// text/plain
			// text/html
			// vnd.ms-powerpoint
			if (!
				(
					file.type.match(/^image\/(gif|jpe?g|a?png|svg|webp|bmp)/i) ||
					file.type.match(/^application\/(msword|pdf|vnd)/i) ||
					file.type.match(/^text\/(plain|html)/i)
				)
			) return
			const { maxSize = 10 * 1024 * 1024 } = this.options; //默认最大10mb
			if (size > maxSize) return

			const reader = new FileReader()
			reader.onload = (e) => {
				callback(e.target.result, type, file)
			}
			const blob = file.getAsFile ? file.getAsFile() : file
			if (blob instanceof Blob) reader.readAsDataURL(blob)
		})
	}

	/* insert into the editor
	*/
	insert (dataUrl, file) {
    const index = (this.quill.getSelection() || {}).index || this.quill.getLength()
		const { name, size, type } = file;
		if (type.indexOf('image') > -1) {
    	this.quill.insertEmbed(index, 'image', dataUrl, 'user')
		} else {
			this.quill.insertText(index, `${name} | ${size}kb`, 'link', dataUrl, 'user')
		}
	}

}
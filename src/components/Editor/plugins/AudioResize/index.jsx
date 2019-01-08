
/**
 * Custom module for quilljs to allow user to resize <audio> elements
 * (Works on Chrome, Edge, Safari and replaces Firefox's native resize behavior)
 * @see https://quilljs.com/blog/building-a-custom-module/
 */
import { Quill } from 'react-quill';
import defaultsDeep from 'lodash/defaultsDeep';
import './index.less';
import Toolbar from './Toolbar';

export default class AudioResize {
  knownModules = {
    Toolbar,
  }
  constructor(quill, options = {}) {
    // save the quill reference and options
    this.quill = quill;
    // Apply the options to our defaults, and stash them for later defaultsDeep
    // doesn't do arrays as you'd expect, so we'll need to apply the classes array
    // from options separately
    let moduleClasses = false;
    if (options.modules) {
      moduleClasses = options.modules.slice();
    }

    // Apply options to default options
    this.options = defaultsDeep({}, options, {
      modules: [
        'Toolbar',
      ],
    });

    // (see above about moduleClasses)
    if (moduleClasses !== false) {
      this.options.modules = moduleClasses;
    }

    // respond to clicks inside the editor
    this.quill.root.addEventListener('click', this.handleClick, false);

    this.quill.root.parentNode.style.position = this.quill.root.parentNode.style.position || 'relative';

    // setup modules
    this.moduleClasses = this.options.modules;

    this.modules = [];
  }

  initializeModules = () => {
    this.removeModules();
    this.modules = this.moduleClasses.map(ModuleClass => {
      return new (this.knownModules[ModuleClass] || ModuleClass)(this);
    });

    this.modules.forEach(module => {
      module.onCreate();
    });

    this.onUpdate();
  };

  onUpdate = () => {
    this.repositionElements();
    this.modules.forEach(module => {
      module.onUpdate();
    });
  };

  removeModules = () => {
    this.modules.forEach(module => {
      module.onDestroy();
    });

    this.modules = [];
  };

  handleClick = evt => {
    if (evt.target && evt.target.tagName && evt.target.tagName.toUpperCase() === 'AUDIO') {
      if (this.audio === evt.target) {
        // we are already focused on this audio
        return;
      }
      if (this.audio) {
        // we were just focused on another audio
        this.hide();
      }
      // clicked on an audio inside the editor
      this.show(evt.target);
    } else if (this.audio) {
      // clicked on a non audio
      this.hide();
    }
  };

  show = audio => {
    // keep track of this audio element
    this.audio = audio;

    this.showOverlay();

    this.initializeModules();
  };

  showOverlay = () => {
    if (this.overlay) {
      this.hideOverlay();
    }

    this.quill.setSelection(null);

    // prevent spurious text selection
    this.setUserSelect('none');

    // listen for the audio being deleted or moved
    document.addEventListener('keyup', this.checkAudio, true);
    this.quill.root.addEventListener('input', this.checkAudio, true);

    // Create and add the overlay
    this.overlay = document.createElement('div');
    this.overlay.classList.add('at-audioResize-overlay');
    // Object.assign(this.overlay.class, this.options.overlayStyles);

    this.quill.root.parentNode.appendChild(this.overlay);

    this.repositionElements();
  };

  hideOverlay = () => {
    if (!this.overlay) {
      return;
    }

    // Remove the overlay
    this.quill.root.parentNode.removeChild(this.overlay);
    this.overlay = undefined;

    // stop listening for audio deletion or movement
    document.removeEventListener('keyup', this.checkAudio);
    this.quill.root.removeEventListener('input', this.checkAudio);

    // reset user-select
    this.setUserSelect('');
  };

  repositionElements = () => {
    if (!this.overlay || !this.audio) {
      return;
    }

    // position the overlay over the audio
    const parent = this.quill.root.parentNode;
    const audioRect = this.audio.getBoundingClientRect();
    const containerRect = parent.getBoundingClientRect();
    Object.assign(this.overlay.style, {
      left: `${audioRect.left - containerRect.left - 1 + parent.scrollLeft}px`,
      top: `${audioRect.top - containerRect.top + parent.scrollTop}px`,
      width: `${audioRect.width}px`,
      height: `${audioRect.height}px`,
    });
  };

  hide = () => {
    this.hideOverlay();
    this.removeModules();
    this.audio = undefined;
  };

  setUserSelect = value => {
    ['userSelect', 'mozUserSelect', 'webkitUserSelect', 'msUserSelect'].forEach(prop => {
      // set on contenteditable element and <html>
      this.quill.root.style[prop] = value;
      document.documentElement.style[prop] = value;
    });
  };

  checkAudio = evt => {
    if (this.audio) {
      if (evt.keyCode === 46 || evt.keyCode === 8) {
        Quill.find(this.audio).deleteAt(0);
      }
      this.hide();
    }
  };
}

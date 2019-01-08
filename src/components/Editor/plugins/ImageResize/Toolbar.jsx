/*
 * @author chaolin.jcl 宜鑫
 * @date 2018/10/16
 * @description
 */
import { Quill } from 'react-quill';
import BaseModule from './BaseModule';
import { iconTool } from '../../utils/iconTool';

export default class Toolbar extends BaseModule {
  constructor(resizer) {
    super(resizer);
    const Parchment = Quill.imports.parchment;
    this.VerticleAlign = new Parchment.Attributor.Style('verticle-align', 'verticle-align');
    this.TextAlign = new Parchment.Attributor.Class('align', 'text-align');
    this.FloatStyle = new Parchment.Attributor.Style('float', 'float');
    this.MarginStyle = new Parchment.Attributor.Style('margin', 'margin');
    this.DisplayStyle = new Parchment.Attributor.Style('display', 'display');
  }
    onCreate = () => {
      // Setup Toolbar
      this.toolbar = document.createElement('div');
      this.toolbar.classList.add('at-imageResize-toolbar');
      // Object.assign(this.toolbar.style, this.options.toolbarStyles);
      this.overlay.appendChild(this.toolbar);

      // Setup Buttons
      this._defineAlignments();
      this._addToolbarButtons();
    };

  // The toolbar and its children will be destroyed when the overlay is removed
    onDestroy = () => {};

  // Nothing to update on drag because we are are positioned relative to the overlay
    onUpdate = () => {};

    _defineAlignments = () => {
      this.alignments = [
        {
          icon: iconTool('icon-align-left'),
          apply: () => {
            this.DisplayStyle.add(this.img, 'inline-block');
            this.VerticleAlign.add(this.img, 'middle');
            this.TextAlign.add(this.imgWrapper, 'left');
            this.MarginStyle.add(this.img, '0 1em 1em 0');
          },
          isApplied: () => this.TextAlign.value(this.imgWrapper) === 'left',
        },
        {
          icon: iconTool('icon-align-center'),
          apply: () => {
            this.DisplayStyle.add(this.img, 'inline-block');
            this.TextAlign.add(this.imgWrapper, 'center');
            this.VerticleAlign.add(this.img, 'middle');
          },
          isApplied: () => this.TextAlign.value(this.imgWrapper) === 'center',
        },
        {
          icon: iconTool('icon-align-right'),
          apply: () => {
            this.DisplayStyle.add(this.img, 'inline-block');
            this.VerticleAlign.add(this.img, 'middle');
            this.TextAlign.add(this.imgWrapper, 'right');
            this.MarginStyle.add(this.img, '0 0 1em 1em');
          },
          isApplied: () => this.TextAlign.value(this.imgWrapper) === 'right',
        },
      ];
    };

    _addToolbarButtons = () => {
      const buttons = [];
      this.alignments.forEach((alignment, idx) => {
        const button = document.createElement('span');
        buttons.push(button);
        button.innerHTML = alignment.icon;
        button.addEventListener('click', () => {
          // deselect all buttons
          buttons.forEach(button => {
            button.style.filter = '';
          });
          if (alignment.isApplied()) {
            // If applied, unapply
            this.FloatStyle.remove(this.img);
            this.MarginStyle.remove(this.img);
            this.DisplayStyle.remove(this.img);
          } else {
            // otherwise, select button and apply
            this._selectButton(button);
            alignment.apply();
          }
          // image may change position; redraw drag handles
          this.requestUpdate();
        });
        button.classList.add('at-imageResize-toolbar-btn');
        if (idx > 0) {
          button.style.borderLeftWidth = '0';
        }
        if (alignment.isApplied()) {
          // select button if previously applied
          this._selectButton(button);
        }
        this.toolbar.appendChild(button);
      });
    };

    _selectButton = button => {
      button.style.filter = 'invert(20%)';
    };

}

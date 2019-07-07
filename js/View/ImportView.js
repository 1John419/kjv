'use strict';

import { bus } from '../EventBus.js';

import {
  templateElement,
  templateDivDialog,
  templatePage,
  templatePageScroll,
  templateToolbarLower,
  templateToolbarUpper
} from '../template.js';

const dialogToolset = [
  { type: 'label', text: 'Paste Bookmark Package Here:' },
  { type: 'textarea', label: 'Bookmark Package' },
  { type: 'btn', id: 'cancel', label: 'Cancel' },
  { type: 'btn', id: 'import', label: 'Import' }
];

const lowerToolSet = [
  { type: 'btn', icon: 'back', label: 'Back' }
];

const upperToolSet = [
  { type: 'banner', modifier: 'import', text: 'Import' }
];

class ImportView {

  constructor() {
    this.initialize();
  }

  addListeners() {
    this.dialogBtns.addEventListener('click', (event) => {
      this.dialogBtnsClick(event);
    });
    this.toolbarLower.addEventListener('click', (event) => {
      this.toolbarLowerClick(event);
    });
  }

  buildPage() {
    this.page = templatePage('import');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templatePageScroll('import');
    this.dialog = templateDivDialog('import', dialogToolset);
    this.scroll.appendChild(this.dialog);
    this.message = templateElement('div', 'message', 'import', null, null);
    this.scroll.appendChild(this.message);
    this.page.appendChild(this.scroll);

    this.toolbarLower = templateToolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    let container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  cancelClick() {
    bus.publish('action.import.back', null);
  }

  dialogBtnsClick(event) {
    event.preventDefault();
    let target = event.target;
    switch (target) {
      case this.btnCancel:
        this.cancelClick();
        break;
      case this.btnImport:
        this.importClick();
    }
  }

  getElements() {
    this.textarea = this.scroll.querySelector('.dialog-textarea');
    this.dialogBtns = this.dialog.querySelector('.dialog-btns');
    this.btnCancel = this.dialogBtns.querySelector('.btn-dialog--cancel');
    this.btnImport = this.dialogBtns.querySelector('.btn-dialog--import');

    this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
  }

  importClick() {
    this.message.textContent = '';
    let pkgStr = this.textarea.value;
    if (!pkgStr) {
      return;
    }
    bus.publish('action.import.import', pkgStr);
  }

  importHide() {
    this.page.classList.add('page--hide');
  }

  importMessage(messageStr) {
    this.message.textContent = messageStr;
    if (messageStr === 'Import successful.') {
      this.textarea.value = '';
    }
  }

  importShow() {
    this.textarea.value = '';
    this.message.textContent = '';
    this.page.classList.remove('page--hide');
  }

  initialize() {
    this.buildPage();
    this.getElements();
    this.addListeners();
    this.subscribe();
  }

  subscribe() {
    bus.subscribe('import.hide', () => {
      this.importHide();
    });
    bus.subscribe('import.message', (messageStr) => {
      this.importMessage(messageStr);
    });
    bus.subscribe('import.show', () => {
      this.importShow();
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target === this.btnBack) {
      bus.publish('action.import.back', null);
    }
  }

}

export { ImportView };

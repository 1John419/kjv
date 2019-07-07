'use strict';

import { bus } from '../EventBus.js';

import {
  templateDivDialog,
  templatePage,
  templatePageScroll,
  templateToolbarLower,
  templateToolbarUpper
} from '../template.js';

const dialogToolset = [
  { type: 'label', text: 'Name' },
  { type: 'input', label: 'Name' },
  { type: 'btn', id: 'cancel', label: 'Cancel' },
  { type: 'btn', id: 'save', label: 'Save' }
];

const lowerToolSet = [
  { type: 'btn', icon: 'back', label: 'Back' }
];

const upperToolSet = [
  { type: 'banner', modifier: 'folder-add', text: 'Folder Add' }
];

class FolderAddView {

  constructor() {
    this.initialize();
  }

  addListeners() {
    this.dialogBtns.addEventListener('click', (event) => {
      this.dialogBtnsClick(event);
    });
    this.inputName.addEventListener('keydown', (event) => {
      this.inputNameKeyDown(event);
    });
    this.toolbarLower.addEventListener('click', (event) => {
      this.toolbarLowerClick(event);
    });
  }

  buildPage() {
    this.page = templatePage('folder-add');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templatePageScroll('folder-add');
    this.dialog = templateDivDialog('folder-add', dialogToolset);
    this.scroll.appendChild(this.dialog);
    this.page.appendChild(this.scroll);

    this.toolbarLower = templateToolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    let container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  cancelClick() {
    this.inputName.value = '';
    bus.publish('action.folder-add.back', null);
  }

  dialogBtnsClick(event) {
    event.preventDefault();
    let target = event.target;
    switch (target) {
      case this.btnCancel:
        this.cancelClick();
        break;
      case this.btnSave:
        this.saveClick();
    }
  }

  folderAddHide() {
    this.page.classList.add('page--hide');
  }

  folderAddShow() {
    this.page.classList.remove('page--hide');
    this.inputName.focus();
  }

  getElements() {
    this.inputName = this.dialog.querySelector('.dialog-input');
    this.dialogBtns = this.dialog.querySelector('.dialog-btns');
    this.btnCancel = this.dialogBtns.querySelector('.btn-dialog--cancel');
    this.btnSave = this.dialogBtns.querySelector('.btn-dialog--save');

    this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
  }

  initialize() {
    this.buildPage();
    this.getElements();
    this.addListeners();
    this.subscribe();
  }

  inputNameKeyDown(event) {
    if (event.key === 'Enter') {
      this.saveClick();
    }
  }

  saveClick() {
    let name = this.inputName.value;
    if (!name) {
      return;
    }
    this.inputName.value = '';
    bus.publish('action.folder-add.save', name);
  }

  subscribe() {
    bus.subscribe('folder-add.hide', () => {
      this.folderAddHide();
    });
    bus.subscribe('folder-add.show', () => {
      this.folderAddShow();
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target === this.btnBack) {
      bus.publish('action.folder-add.back', null);
    }
  }

}

export { FolderAddView };

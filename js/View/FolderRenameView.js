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
  { type: 'banner', modifier: 'folder-rename', text: 'Folder Rename' }
];

class FolderRenameView {

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
    this.page = templatePage('folder-rename');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templatePageScroll('folder-rename');
    this.dialog = templateDivDialog('folder-rename', dialogToolset);
    this.scroll.appendChild(this.dialog);
    this.page.appendChild(this.scroll);

    this.toolbarLower = templateToolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    let container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  cancelClick() {
    this.inputName.value = '';
    bus.publish('action.folder-rename.back', null);
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

  folderRenameHide() {
    this.page.classList.add('page--hide');
  }

  folderRenameShow(folderName) {
    this.page.classList.remove('page--hide');
    this.folderName = folderName;
    this.namePkg = {
      old: folderName
    };
    this.inputName.value = folderName;
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
    this.namePkg.new = name;
    bus.publish('action.folder-rename.save', this.namePkg);
  }

  subscribe() {
    bus.subscribe('folder-rename.hide', () => {
      this.folderRenameHide();
    });
    bus.subscribe('folder-rename.show', (folderName) => {
      this.folderRenameShow(folderName);
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target === this.btnBack) {
      bus.publish('action.folder-rename.back', null);
    }
  }

}

export { FolderRenameView };

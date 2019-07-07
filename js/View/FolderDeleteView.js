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
  { type: 'label', text: null },
  { type: 'btn', id: 'cancel', label: 'Cancel' },
  { type: 'btn', id: 'delete', label: 'Delete' }
];

const lowerToolSet = [
  { type: 'btn', icon: 'back', label: 'Back' }
];

const upperToolSet = [
  { type: 'banner', modifier: 'folder-delete', text: 'Folder Delete' }
];

class FolderDeleteView {

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
    this.page = templatePage('folder-delete');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templatePageScroll('folder-delete');
    this.dialog = templateDivDialog('folder-delete', dialogToolset);
    this.scroll.appendChild(this.dialog);
    this.page.appendChild(this.scroll);

    this.toolbarLower = templateToolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    let container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  cancelClick() {
    bus.publish('action.folder-delete.back', null);
  }

  deleteClick() {
    bus.publish('action.folder-delete.confirm', this.folderName);
  }

  dialogBtnsClick(event) {
    event.preventDefault();
    let target = event.target;
    switch (target) {
      case this.btnCancel:
        this.cancelClick();
        break;
      case this.btnDelete:
        this.deleteClick();
    }
  }

  folderDeleteHide() {
    this.page.classList.add('page--hide');
  }

  folderDeleteShow(folderName) {
    this.folderName = folderName;
    this.updateLabel();
    this.page.classList.remove('page--hide');
  }

  getElements() {
    this.banner = this.toolbarUpper.querySelector('.banner--folder-delete');

    this.label = this.dialog.querySelector('.dialog-label');
    this.dialogBtns = this.dialog.querySelector('.dialog-btns');
    this.btnCancel = this.dialogBtns.querySelector('.btn-dialog--cancel');
    this.btnDelete = this.dialogBtns.querySelector('.btn-dialog--delete');

    this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
  }

  initialize() {
    this.buildPage();
    this.getElements();
    this.addListeners();
    this.subscribe();
  }

  subscribe() {
    bus.subscribe('folder-delete.hide', () => {
      this.folderDeleteHide();
    });
    bus.subscribe('folder-delete.show', (folderName) => {
      this.folderDeleteShow(folderName);
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target === this.btnBack) {
      bus.publish('action.folder-delete.back', null);
    }
  }

  updateLabel() {
    this.label.innerHTML = `Delete Folder '${this.folderName}'?`;
  }

}

export { FolderDeleteView };

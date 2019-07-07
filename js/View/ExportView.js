'use strict';

import { bus } from '../EventBus.js';

import { tome } from '../Tome/tome.js';

import {
  templateDivDialog,
  templatePage,
  templatePageScroll,
  templateToolbarLower,
  templateToolbarUpper
} from '../template.js';

const message = 'Select All and Copy the text below. ' +
  'Then Paste in a text editor and save the file.';

const dialogToolset = [
  { type: 'label', text: message },
  { type: 'textarea', label: 'Bookmark Package' },
];

const lowerToolSet = [
  { type: 'btn', icon: 'back', label: 'Back' }
];

const upperToolSet = [
  { type: 'banner', modifier: 'export', text: 'Export' }
];

class ExportView {

  constructor() {
    this.initialize();
  }

  addListeners() {
    this.toolbarLower.addEventListener('click', (event) => {
      this.toolbarLowerClick(event);
    });
  }

  buildBookmarkPkg() {
    let bookmarkPkg = {};
    bookmarkPkg.tome = tome.name;
    bookmarkPkg.folders = this.folders;
    return JSON.stringify(bookmarkPkg);
  }

  buildPage() {
    this.page = templatePage('export');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templatePageScroll('export');
    this.dialog = templateDivDialog('export', dialogToolset);
    this.scroll.appendChild(this.dialog);
    this.page.appendChild(this.scroll);

    this.toolbarLower = templateToolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    let container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  exportHide() {
    this.page.classList.add('page--hide');
  }

  exportShow() {
    this.page.classList.remove('page--hide');
    this.textarea.value = this.buildBookmarkPkg();
  }

  foldersUpdate(folders) {
    this.folders = folders;
  }

  getElements() {
    this.textarea = this.scroll.querySelector('.dialog-textarea');
    this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
  }

  initialize() {
    this.buildPage();
    this.getElements();
    this.addListeners();
    this.subscribe();
  }

  subscribe() {
    bus.subscribe('export.hide', () => {
      this.exportHide();
    });
    bus.subscribe('export.show', () => {
      this.exportShow();
    });
    bus.subscribe('folders.update', (folders) => {
      this.foldersUpdate(folders);
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target === this.btnBack) {
      bus.publish('action.export.back', null);
    }
  }

}

export { ExportView };

'use strict';

import { queue } from '../CommandQueue.js';
import { template } from '../template.js';

const dialogToolset = [
  { type: 'label', text: 'Folder Name' },
  { type: 'input', ariaLabel: 'Name' },
  { type: 'btn', cssModifier: 'save', ariaLabel: null, label: 'Save' },
];

const lowerToolSet = [
  { type: 'btn', icon: 'bookmark-folder', ariaLabel: null },
];

const upperToolSet = [
  { type: 'banner', cssModifier: 'bookmark-folder-rename', text: 'Folder Rename'},
];

class BookmarkFolderRenameView {

  constructor() {
    this.initialize();
  }

  addListeners() {
    this.dialogBtns.addEventListener('click', (event) => {
      this.dialogClick(event);
    });
    this.inputName.addEventListener('keydown', (event) => {
      this.inputKeyDown(event);
    });
    this.toolbarLower.addEventListener('click', (event) => {
      this.toolbarLowerClick(event);
    });
  }

  buildPage() {
    this.page = template.page('bookmark-folder-rename');

    this.toolbarUpper = template.toolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = template.scroll('bookmark-folder-rename');
    this.dialog = template.divDialog('bookmark-folder-rename', dialogToolset);
    this.scroll.appendChild(this.dialog);

    this.message = template.element('div', 'message', 'bookmark-folder-rename', null, null);
    this.scroll.appendChild(this.message);

    this.page.appendChild(this.scroll);

    this.toolbarLower = template.toolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    const container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  dialogClick(event) {
    event.preventDefault();
    const btn = event.target.closest('div.btn-dialog');
    if (btn) {
      if (btn === this.btnSave) {
        this.saveClick();
      }
    }
  }

  error(message) {
    this.message.textContent = message;
    this.message.classList.remove('hide');
  }

  folderToRename(folderName) {
    this.folderName = folderName;
  }

  getElements() {
    this.inputName = this.dialog.querySelector('.dialog-input');
    this.dialogBtns = this.dialog.querySelector('.dialog-btns');
    this.btnSave = this.dialogBtns.querySelector('.btn-dialog--save');

    this.btnBookmarkFolder = this.toolbarLower.querySelector('.btn-icon--bookmark-folder');
  }

  hide() {
    this.page.classList.add('page--hide');
  }

  initialize() {
    this.buildPage();
    this.getElements();
    this.getElements();
    this.addListeners();
    this.subscribe();
  }

  inputKeyDown(event) {
    if (event.key === 'Enter') {
      this.inputName.blur();
      this.saveClick();
    }
  }

  saveClick() {
    const name = this.inputName.value;
    if (name) {
      this.namePkg.new = name;
      queue.publish('bookmark-folder-rename.save', this.namePkg);
    }
  }

  show() {
    this.page.classList.remove('page--hide');
    this.message.classList.add('hide');
    this.namePkg = {
      old: this.folderName,
    };
    this.inputName.value = this.folderName;
    this.inputName.focus();
  }

  subscribe() {
    queue.subscribe('bookmark-folder-rename.hide', () => {
      this.hide();
    });
    queue.subscribe('bookmark-folder-rename.show', (folderName) => {
      this.show(folderName);
    });

    queue.subscribe('bookmark.folder.rename.error', (message) => {
      this.error(message);
    });

    queue.subscribe('folder.to.rename', (folderName) => {
      this.folderToRename(folderName);
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    const btn = event.target.closest('div.btn-icon');
    if (btn) {
      if (btn === this.btnBookmarkFolder) {
        queue.publish('bookmark-folder', null);
      }
    }
  }

}

export { BookmarkFolderRenameView };

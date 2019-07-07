'use strict';

import { bus } from '../EventBus.js';

import { removeAllChildren } from '../util.js';

import {
  templateActionMenu,
  templateElement,
  templateBtnIcon,
  templatePage,
  templatePageScroll,
  templateToolbarLower,
  templateToolbarUpper
} from '../template.js';

const actionSet = [
  { icon: 'up', label: 'Up' },
  { icon: 'down', label: 'Down' },
  { icon: 'rename', label: 'Rename' },
  { icon: 'delete', label: 'Delete' },
  { icon: 'cancel', label: 'Cancel' }
];

const lowerToolSet = [
  { type: 'btn', icon: 'back', label: 'Back' },
  { type: 'btn', icon: 'import', label: 'Import' },
  { type: 'btn', icon: 'export', label: 'Export' }
];

const upperToolSet = [
  { type: 'banner', modifier: 'folder', text: 'Folder' }
];

class FolderView {

  constructor() {
    this.initialize();
  }

  actionMenuClick(event) {
    event.preventDefault();
    let btn = event.target.closest('button');
    if (btn === this.btnCancel) {
      this.actionMenu.classList.add('action-menu--hide');
      return;
    }
    let entry = this.activeEntry.querySelector('.btn-entry');
    let folderName = entry.textContent;
    switch (btn) {
      case this.btnDelete:
        this.delete(folderName);
        break;
      case this.btnDown:
        this.down(folderName);
        break;
      case this.btnRename:
        this.rename(folderName);
        break;
      case this.btnUp:
        this.up(folderName);
    }
    this.actionMenu.classList.add('action-menu--hide');
  }

  addListeners() {
    this.actionMenu.addEventListener('click', (event) => {
      this.actionMenuClick(event);
    });
    this.list.addEventListener('click', (event) => {
      this.listClick(event);
    });
    this.toolbarLower.addEventListener('click', (event) => {
      this.toolbarLowerClick(event);
    });
  }

  btnMenuClick(target) {
    this.showActionMenu(target);
  }

  buildEntry(folderName) {
    let entry = document.createElement('div');
    entry.classList.add('entry', 'entry--folder');
    let btnEntry = document.createElement('button');
    btnEntry.classList.add('btn-entry', 'btn-entry--folder');
    btnEntry.textContent = folderName;
    let btnMenu = templateBtnIcon('menu', 'Menu');
    entry.appendChild(btnEntry);
    entry.appendChild(btnMenu);
    return entry;
  }

  buildPage() {
    this.page = templatePage('folder');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templatePageScroll('folder');

    this.list = templateElement('div', 'list', 'folder', null, null);
    this.scroll.appendChild(this.list);

    this.actionMenu = templateActionMenu('folder', actionSet);
    this.scroll.appendChild(this.actionMenu);
    this.page.appendChild(this.scroll);

    this.toolbarLower = templateToolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    let container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  delete(folderName) {
    bus.publish('action.folder.delete', folderName);
  }

  down(folderName) {
    bus.publish('action.folder.down', folderName);
  }

  folderHide() {
    this.actionMenu.classList.add('action-menu--hide');
    this.page.classList.add('page--hide');
  }

  folderListUpdate(folderList) {
    this.folderList = folderList;
    this.updateList();
  }

  folderScrollToTop() {
    if (this.page.classList.contains('page--hide')) {
      this.scrollReset = true;
      return;
    }
    this.scroll.scrollTop = 0;
  }

  folderShow() {
    this.page.classList.remove('page--hide');
    if (this.scrollReset) {
      this.scroll.scrollTop = 0;
      this.scrollReset = false;
    }
  }

  getElements() {
    this.btnUp = this.actionMenu.querySelector('.btn-icon--up');
    this.btnDown = this.actionMenu.querySelector('.btn-icon--down');
    this.btnRename = this.actionMenu.querySelector('.btn-icon--rename');
    this.btnDelete = this.actionMenu.querySelector('.btn-icon--delete');
    this.btnCancel = this.actionMenu.querySelector('.btn-icon--cancel');

    this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
    this.btnImport = this.toolbarLower.querySelector('.btn-icon--import');
    this.btnExport = this.toolbarLower.querySelector('.btn-icon--export');
  }

  initialize() {
    this.buildPage();
    this.getElements();
    this.addListeners();
    this.subscribe();
  }

  listClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target.classList.contains('btn-entry')) {
      let folderName = target.textContent;
      bus.publish('action.folder.select', folderName);
      return;
    }
    if (target.classList.contains('btn-icon--menu')) {
      let entry = target.previousSibling;
      this.btnMenuClick(entry);
      return;
    }
  }

  rename(folderName) {
    bus.publish('action.folder.rename', folderName);
  }

  showActionMenu(target) {
    this.activeEntry = target.closest('div');
    let top = target.offsetTop;
    this.actionMenu.style.top = `${top}px`;
    this.actionMenu.classList.remove('action-menu--hide');
  }

  subscribe() {
    bus.subscribe('folder.hide', () => {
      this.folderHide();
    });
    bus.subscribe('folder.list.update', (folderList) => {
      this.folderListUpdate(folderList);
    });
    bus.subscribe('folder.scroll-to-top', () => {
      this.folderScrollToTop();
    });
    bus.subscribe('folder.show', () => {
      this.folderShow();
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    switch (target) {
      case this.btnBack:
        bus.publish('action.folder.back', null);
        break;
      case this.btnExport:
        bus.publish('action.folder.export', null);
        break;
      case this.btnImport:
        bus.publish('action.folder.import', null);
    }
  }

  up(folderName) {
    bus.publish('action.folder.up', folderName);
  }

  updateList() {
    removeAllChildren(this.list);
    let fragment = document.createDocumentFragment();
    for (let folderName of this.folderList) {
      let entry = this.buildEntry(folderName);
      fragment.appendChild(entry);
    }
    this.list.appendChild(fragment);
  }

}

export { FolderView };

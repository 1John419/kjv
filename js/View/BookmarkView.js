'use strict';

import { bus } from '../EventBus.js';

import { tome } from '../Tome/tome.js';

import {
  templateActionMenu,
  templateBtnIcon,
  templateElement,
  templatePage,
  templatePageScroll,
  templateToolbarLower,
  templateToolbarUpper
} from '../template.js';

import {
  getRefName,
  removeAllChildren
} from '../util.js';

const actionSet = [
  { icon: 'up', label: 'Up' },
  { icon: 'down', label: 'Down' },
  { icon: 'move-copy', label: 'Move/Copy' },
  { icon: 'delete', label: 'Delete' },
  { icon: 'cancel', label: 'Cancel' }
];

const lowerToolSet = [
  { type: 'btn', icon: 'back', label: 'Back' },
  { type: 'btn', icon: 'sort-ascend', label: 'Sort Ascending' },
  { type: 'btn', icon: 'sort-descend', label: 'Sort Descending' },
  { type: 'btn', icon: 'sort-invert', label: 'Sort Invert' }
];

const upperToolSet = [
  { type: 'btn', icon: 'folder-add', label: 'Folder Add' },
  { type: 'banner', modifier: 'bookmark', text: null },
  { type: 'btn', icon: 'folder', label: 'Folder' }
];

class BookmarkView {

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
    let btnEntry = this.activeEntry.querySelector('.btn-entry');
    let verseIdx = parseInt(btnEntry.dataset.verseIdx);
    switch (btn) {
      case this.btnUp:
        this.up(verseIdx);
        break;
      case this.btnDown:
        this.down(verseIdx);
        break;
      case this.btnMoveCopy:
        this.moveCopy(verseIdx);
        break;
      case this.btnDelete:
        this.delete(verseIdx);
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
    this.toolbarUpper.addEventListener('click', (event) => {
      this.toolbarUpperClick(event);
    });
  }

  bookmarkHide() {
    this.page.classList.add('page--hide');
    this.actionMenu.classList.add('action-menu--hide');
  }

  bookmarkScrollToTop() {
    if (this.page.classList.contains('page--hide')) {
      this.scrollReset = true;
      return;
    }
    this.scroll.scrollTop = 0;
  }

  bookmarkShow() {
    this.page.classList.remove('page--hide');
    if (this.scrollReset) {
      this.scroll.scrollTop = 0;
      this.scrollReset = false;
    }
  }

  buildEntry(verseIdx) {
    let entry = document.createElement('div');
    entry.classList.add('entry', 'entry--bookmark');
    let btnRef = document.createElement('button');
    btnRef.classList.add('btn-entry', 'btn-entry--bookmark');
    btnRef.textContent = getRefName(verseIdx);
    btnRef.dataset.verseIdx = verseIdx;
    entry.appendChild(btnRef);
    let btnMenu = templateBtnIcon('menu', 'Menu');
    entry.appendChild(btnMenu);
    return entry;
  }

  buildPage() {
    this.page = templatePage('bookmark');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templatePageScroll('bookmark');

    this.empty = templateElement('div', 'empty', 'bookmark', null, 'No bookmarks saved.');
    this.scroll.appendChild(this.empty);

    this.list = templateElement('div', 'list', 'bookmark', null, null);
    this.scroll.appendChild(this.list);

    this.actionMenu = templateActionMenu('bookmark', actionSet);
    this.scroll.appendChild(this.actionMenu);

    this.page.appendChild(this.scroll);

    this.toolbarLower = templateToolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    let container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  delete(verseIdx) {
    bus.publish('action.bookmark.delete', verseIdx);
  }

  down(verseIdx) {
    bus.publish('action.bookmark.down', verseIdx);
  }

  getElements() {
    this.btnFolderAdd = this.toolbarUpper.querySelector('.btn-icon--folder-add');
    this.banner = this.toolbarUpper.querySelector('.banner--bookmark');
    this.btnFolder = this.toolbarUpper.querySelector('.btn-icon--folder');

    this.btnUp = this.actionMenu.querySelector('.btn-icon--up');
    this.btnDown = this.actionMenu.querySelector('.btn-icon--down');
    this.btnMoveCopy = this.actionMenu.querySelector('.btn-icon--move-copy');
    this.btnDelete = this.actionMenu.querySelector('.btn-icon--delete');
    this.btnCancel = this.actionMenu.querySelector('.btn-icon--cancel');

    this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
    this.btnSortAscend = this.toolbarLower.querySelector('.btn-icon--sort-ascend');
    this.btnSortDescend = this.toolbarLower.querySelector('.btn-icon--sort-descend');
    this.btnSortInvert = this.toolbarLower.querySelector('.btn-icon--sort-invert');
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
      let verseIdx = parseInt(target.dataset.verseIdx);
      this.select(verseIdx);
      return;
    }
    if (target.classList.contains('btn-icon--menu')) {
      let ref = target.previousSibling;
      this.menuClick(ref);
      return;
    }
    return;
  }

  menuClick(target) {
    this.showActionMenu(target);
  }

  moveCopy(verseIdx) {
    bus.publish('action.bookmark.move.copy', verseIdx);
  }

  panesUpdate(panes) {
    if (panes === 1) {
      this.btnBack.classList.remove('btn-icon--hide');
    } else {
      this.btnBack.classList.add('btn-icon--hide');
    }
  }

  select(verseIdx) {
    bus.publish('action.bookmark.select', verseIdx);
  }

  showActionMenu(target) {
    this.activeEntry = target.closest('div');
    let top = target.offsetTop;
    this.actionMenu.style.top = `${top}px`;
    this.actionMenu.classList.remove('action-menu--hide');
  }

  subscribe() {
    bus.subscribe('bookmark.hide', () => {
      this.bookmarkHide();
    });
    bus.subscribe('bookmark.scroll-to-top', () => {
      this.bookmarkScrollToTop();
    });
    bus.subscribe('bookmark.show', () => {
      this.bookmarkShow();
    });
    bus.subscribe('folder.update', (folder) => {
      this.updateFolder(folder);
    });
    bus.subscribe('panes.update', (panes) => {
      this.panesUpdate(panes);
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    switch (target) {
      case this.btnBack:
        bus.publish('action.bookmark.back', null);
        break;
      case this.btnSortAscend:
        bus.publish('action.bookmark.sort-ascend', null);
        break;
      case this.btnSortDescend:
        bus.publish('action.bookmark.sort-descend', null);
        break;
      case this.btnSortInvert:
        bus.publish('action.bookmark.sort-invert', null);
    }
  }

  toolbarUpperClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    switch (target) {
      case this.btnFolderAdd:
        bus.publish('action.bookmark.folder-add', null);
        break;
      case this.btnFolder:
        bus.publish('action.bookmark.folder', null);
    }
  }

  up(verseIdx) {
    bus.publish('action.bookmark.up', verseIdx);
  }

  updateBanner() {
    this.banner.innerHTML = `${this.folder.name}`;
  }

  updateFolder(folder) {
    this.folder = folder;
    this.updateBanner();
    this.updateList();
  }

  updateList() {
    removeAllChildren(this.list);
    if (this.folder.bookmarks.length === 0) {
      this.empty.classList.remove('empty--hide');
      return;
    } else {
      this.empty.classList.add('empty--hide');
    }
    let fragment = document.createDocumentFragment();
    for (let verseIdx of this.folder.bookmarks) {
      let ref = this.buildEntry(verseIdx);
      fragment.appendChild(ref);
    }
    this.list.appendChild(fragment);
  }

}

export { BookmarkView };

'use strict';

import { bus } from '../EventBus.js';

import {
  getRefName,
  removeAllChildren
} from '../util.js';

import {
  templateActionMenu,
  templateBtnIcon,
  templateElement,
  templatePage,
  templatePageScroll,
  templateToolbarLower,
  templateToolbarUpper
} from '../template.js';

const actionSet = [
  { icon: 'move', label: 'Move' },
  { icon: 'copy', label: 'Copy' },
  { icon: 'cancel', label: 'Cancel' }
];

const lowerToolSet = [
  { type: 'btn', icon: 'back', label: 'Back' }
];

const upperToolSet = [
  { type: 'banner', modifier: 'move-copy', text: null }
];

class MoveCopyView {

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
      case this.btnCopy:
        this.copy(folderName);
        break;
      case this.btnMove:
        this.move(folderName);
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
    entry.classList.add('entry', 'entry--move-copy');
    let btnEntry = document.createElement('button');
    btnEntry.classList.add('btn-entry', 'btn-entry--move-copy');
    btnEntry.textContent = folderName;
    let btnMenu = templateBtnIcon('menu', 'Menu');
    entry.appendChild(btnEntry);
    entry.appendChild(btnMenu);
    return entry;
  }

  buildPage() {
    this.page = templatePage('move-copy');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templatePageScroll('move-copy');

    this.empty = templateElement('div', 'empty', 'move-copy', null, 'No Target Folder.');
    this.scroll.appendChild(this.empty);

    this.list = templateElement('div', 'list', 'move-copy', null, null);
    this.scroll.appendChild(this.list);

    this.actionMenu = templateActionMenu('move-copy', actionSet);
    this.scroll.appendChild(this.actionMenu);
    this.page.appendChild(this.scroll);

    this.toolbarLower = templateToolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    let container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  copy(folderName) {
    let copyPkg = {
      to: folderName,
      verseIdx: this.verseIdx
    };
    bus.publish('action.move-copy.copy', copyPkg);
  }

  folderUpdate(bookmarksFolder) {
    this.bookmarksFolder = bookmarksFolder;
  }

  getElements() {
    this.banner = this.toolbarUpper.querySelector('.banner--move-copy');

    this.btnMove = this.actionMenu.querySelector('.btn-icon--move');
    this.btnCopy = this.actionMenu.querySelector('.btn-icon--copy');
    this.btnCancel = this.actionMenu.querySelector('.btn-icon--cancel');

    this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
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
    if (target.classList.contains('btn-icon--menu')) {
      let entry = target.previousSibling;
      this.btnMenuClick(entry);
      return;
    }
  }

  move(folderName) {
    let movePkg = {
      to: folderName,
      verseIdx: this.verseIdx
    };
    bus.publish('action.move-copy.move', movePkg);
  }

  moveCopyHide() {
    this.actionMenu.classList.add('action-menu--hide');
    this.page.classList.add('page--hide');
  }

  moveCopyListUpdate(moveCopyList) {
    this.moveCopyList = moveCopyList;
    this.updateList();
  }

  moveCopyScrollToTop() {
    if (this.page.classList.contains('page--hide')) {
      this.scrollReset = true;
      return;
    }
    this.scroll.scrollTop = 0;
  }

  moveCopyShow(verseIdx) {
    this.verseIdx = verseIdx;
    this.updateBanner();
    this.page.classList.remove('page--hide');
    if (this.scrollReset) {
      this.scroll.scrollTop = 0;
      this.scrollReset = false;
    }
  }

  showActionMenu(target) {
    this.activeEntry = target.closest('div');
    let top = target.offsetTop;
    this.actionMenu.style.top = `${top}px`;
    this.actionMenu.classList.remove('action-menu--hide');
  }

  subscribe() {
    bus.subscribe('folder.update', (bookmarksFolder) => {
      this.folderUpdate(bookmarksFolder);
    });
    bus.subscribe('move-copy.hide', () => {
      this.moveCopyHide();
    });
    bus.subscribe('move-copy.list.update', (moveCopyList) => {
      this.moveCopyListUpdate(moveCopyList);
    });
    bus.subscribe('move-copy.scroll-to-top', () => {
      this.moveCopyScrollToTop();
    });
    bus.subscribe('move-copy.show', (verseIdx) => {
      this.moveCopyShow(verseIdx);
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target === this.btnBack) {
      bus.publish('move-copy.list.back', null);
    }
  }

  updateBanner() {
    let ref = getRefName(this.verseIdx);
    this.banner.innerHTML = `${ref} <br> Move/Copy to Folder:`;
  }

  updateList() {
    removeAllChildren(this.list);
    if (this.moveCopyList.length === 0) {
      this.empty.classList.remove('empty--hide');
      return;
    }
    this.empty.classList.add('empty--hide');
    let fragment = document.createDocumentFragment();
    for (let folderName of this.moveCopyList) {
      let entry = this.buildEntry(folderName);
      fragment.appendChild(entry);
    }
    this.list.appendChild(fragment);
  }

}

export { MoveCopyView };

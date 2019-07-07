'use strict';

import { bus } from '../EventBus.js';

import { tome } from '../Tome/tome.js';

import {
  idxFirstVerse,
  idxLastVerse,
  idxVerseNum
} from '../tomeIdx.js';

import {
  centerScrollElement,
  range,
  removeAllChildren
} from '../util.js';

import {
  templateElement,
  templateToolbarLower,
  templatePage,
  templatePageScroll,
  templateToolbarUpper
} from '../template.js';

const lowerToolSet = [
  { type: 'btn', icon: 'book', label: 'Book' },
  { type: 'btn', icon: 'chapter', label: 'Chapter' },
  { type: 'btn', icon: 'bookmark', label: 'Bookmark' },
  { type: 'btn', icon: 'search', label: 'Search' },
  { type: 'btn', icon: 'setting', label: 'Setting' },
  { type: 'btn', icon: 'help', label: 'Help' },
  { type: 'btn', icon: 'column-1', label: 'Single Column' },
  { type: 'btn', icon: 'column-2', label: 'Double Column' },
  { type: 'btn', icon: 'column-3', label: 'Triple Column' }
];

const upperToolSet = [
  { type: 'btn', icon: 'prev', label: 'Previous Chapter' },
  { type: 'banner', modifier: 'read', text: null },
  { type: 'btn', icon: 'next', label: 'Next Chapter' }
];

class ReadView {

  constructor() {
    this.initialize();
  }

  addListeners() {
    this.list.addEventListener('click', (event) => {
      this.listClick(event);
    });
    this.toolbarLower.addEventListener('click', (event) => {
      this.toolbarLowerClick(event);
    });
    this.toolbarUpper.addEventListener('click', (event) => {
      this.toolbarUpperClick(event);
    });
    window.addEventListener('resize', (event) => {
      this.windowResize(event);
    });
  }

  bookHide() {
    this.btnBook.classList.remove('btn-icon--active');
  }

  bookmarkHide() {
    if (this.sidebar === 'bookmark') {
      return;
    }
    this.btnBookmark.classList.remove('btn-icon--active');
  }

  bookmarkShow() {
    this.btnBookmark.classList.add('btn-icon--active');
  }

  bookShow() {
    this.btnBook.classList.add('btn-icon--active');
  }

  buildAcrosticSpan(verseIdx) {
    let acrostics = tome.acrostics;
    let acrostic = acrostics[verseIdx];
    if (!acrostic) {
      return undefined;
    }
    let acrosticSpan = templateElement(
      'span', 'verse__acrostic', null, null, acrostic + ' ');
    return acrosticSpan;
  }

  buildPage() {
    this.page = templatePage('read');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templatePageScroll('read');
    this.list = templateElement('div', 'list', 'read', null, null);
    this.scroll.appendChild(this.list);
    this.page.appendChild(this.scroll);

    this.toolbarLower = templateToolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    let container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  buildVerse(verseIdx) {
    let verse = templateElement('div', 'verse', null, null, null);
    verse.dataset.verseIdx = verseIdx;
    let verseNum = this.buildVerseNum(verseIdx);
    verse.appendChild(verseNum);
    let acrostic = this.buildAcrosticSpan(verseIdx);
    if (acrostic) {
      verse.appendChild(acrostic);
    }
    let verseText = this.buildVerseText(verseIdx);
    verse.appendChild(verseText);
    return verse;
  }

  buildVerseNum(verseIdx) {
    let verseNum = templateElement('span', 'verse__num', null, null,
      tome.refs[verseIdx][idxVerseNum] + ' ');
    return verseNum;
  }

  buildVerseText(verseIdx) {
    let verseText = templateElement('span', 'verse__text', null, null,
      tome.verses[verseIdx]);
    return verseText;
  }

  changeTheme() {
    if (this.lastTheme) {
      this.body.classList.remove(this.lastTheme.themeClass);
    }
    this.body.classList.add(this.theme.themeClass);
  }

  chapterHide() {
    this.btnChapter.classList.remove('btn-icon--active');
  }

  chapterPkgUpdate(chapterPkg) {
    this.chapterPkg = chapterPkg;
    this.updateBanner();
    this.updateVerses();
  }

  chapterShow() {
    this.btnChapter.classList.add('btn-icon--active');
  }

  columnUpdate(column) {
    this.column = column;
    this.updateColumn();
    this.updateColumnBtn();
  }

  folderUpdate(folder) {
    this.folder = folder;
    this.refreshVerseBookmarks();
  }

  fontSizeUpdate(fontSize) {
    this.fontSize = fontSize;
    this.updateFontSize();
    this.lastFontSize = this.fontSize;
  }

  fontUpdate(font) {
    this.font = font;
    this.updateFont();
    this.lastFont = this.font;
  }

  getElements() {
    this.body = document.querySelector('body');

    this.btnPrev = this.toolbarUpper.querySelector('.btn-icon--prev');
    this.banner = this.toolbarUpper.querySelector('.banner--read');
    this.btnNext = this.toolbarUpper.querySelector('.btn-icon--next');

    this.btnBook = this.toolbarLower.querySelector('.btn-icon--book');
    this.btnChapter = this.toolbarLower.querySelector('.btn-icon--chapter');
    this.btnBookmark = this.toolbarLower.querySelector('.btn-icon--bookmark');
    this.btnSearch = this.toolbarLower.querySelector('.btn-icon--search');
    this.btnSetting = this.toolbarLower.querySelector('.btn-icon--setting');
    this.btnHelp = this.toolbarLower.querySelector('.btn-icon--help');
    this.btnColumnOne = this.toolbarLower.querySelector('.btn-icon--column-1');
    this.btnColumnTwo = this.toolbarLower.querySelector('.btn-icon--column-2');
    this.btnColumnThree = this.toolbarLower.querySelector('.btn-icon--column-3');

    this.columnBtns = [
      this.btnColumnOne, this.btnColumnTwo, this.btnColumnThree
    ];
  }

  helpHide() {
    if (this.sidebar === 'help') {
      return;
    }
    this.btnHelp.classList.remove('btn-icon--active');
  }

  helpShow() {
    this.btnHelp.classList.add('btn-icon--active');
  }

  initialize() {
    this.buildPage();
    this.getElements();
    this.addListeners();
    this.subscribe();
    this.lastFont = null;
    this.lastFontSize = null;
  }

  listClick(event) {
    event.preventDefault();
    if (document.getSelection().toString()) {
      return;
    }
    let verse = event.target.closest('div.verse');
    if (!verse) {
      return;
    }
    this.verseClick(verse);
  }

  panesUpdate(panes) {
    switch (panes) {
      case 1:
      case 2:
        this.btnColumnOne.classList.add('btn-icon--hide');
        this.btnColumnTwo.classList.add('btn-icon--hide');
        this.btnColumnThree.classList.add('btn-icon--hide');
        break;
      case 3:
        this.btnColumnOne.classList.remove('btn-icon--hide');
        this.btnColumnTwo.classList.remove('btn-icon--hide');
        this.btnColumnThree.classList.add('btn-icon--hide');
        break;
      default:
        this.btnColumnOne.classList.remove('btn-icon--hide');
        this.btnColumnTwo.classList.remove('btn-icon--hide');
        this.btnColumnThree.classList.remove('btn-icon--hide');
    }
  }

  refreshBookmarks(element) {
    let verseIdx = parseInt(element.dataset.verseIdx);
    if (this.folder.bookmarks.indexOf(verseIdx) === -1) {
      element.classList.remove('verse--bookmark');
    } else {
      element.classList.add('verse--bookmark');
    }
  }

  refreshVerseBookmarks() {
    let verses = [...this.list.querySelectorAll('.verse')];
    for (let element of verses) {
      this.refreshBookmarks(element);
    }
  }

  readHide() {
    this.page.classList.add('page--hide');
  }

  readScrollToTop() {
    this.scroll.scrollTop = 0;
  }

  readScrollToVerse(verseIdx) {
    let element = this.list.querySelector(
      `[data-verse-idx="${verseIdx}"]`
    );
    if (element) {
      centerScrollElement(this.scroll, element);
    }
  }

  readShow() {
    this.page.classList.remove('page--hide');
  }

  searchHide() {
    if (this.sidebar === 'search') {
      return;
    }
    this.btnSearch.classList.remove('btn-icon--active');
  }

  searchShow() {
    this.btnSearch.classList.add('btn-icon--active');
  }

  settingHide() {
    this.btnSetting.classList.remove('btn-icon--active');
  }

  settingShow() {
    this.btnSetting.classList.add('btn-icon--active');
  }

  sidebarUpdate(sidebar) {
    this.sidebar = sidebar;
  }

  subscribe() {
    bus.subscribe('book.hide', () => {
      this.bookHide();
    });
    bus.subscribe('book.show', () => {
      this.bookShow();
    });
    bus.subscribe('bookmark.hide', () => {
      this.bookmarkHide();
    });
    bus.subscribe('bookmark.show', () => {
      this.bookmarkShow();
    });
    bus.subscribe('chapter.hide', () => {
      this.chapterHide();
    });
    bus.subscribe('chapter.show', () => {
      this.chapterShow();
    });
    bus.subscribe('chapterPkg.update', (chapterPkg) => {
      this.chapterPkgUpdate(chapterPkg);
    });
    bus.subscribe('column.update', (column) => {
      this.columnUpdate(column);
    });
    bus.subscribe('folder.update', (folder) => {
      this.folderUpdate(folder);
    });
    bus.subscribe('font.update', (font) => {
      this.fontUpdate(font);
    });
    bus.subscribe('font-size.update', (fontSize) => {
      this.fontSizeUpdate(fontSize);
    });
    bus.subscribe('help.hide', () => {
      this.helpHide();
    });
    bus.subscribe('help.show', () => {
      this.helpShow();
    });
    bus.subscribe('panes.update', (panes) => {
      this.panesUpdate(panes);
    });
    bus.subscribe('read.hide', () => {
      this.readHide();
    });
    bus.subscribe('read.scroll-to-top', () => {
      this.readScrollToTop();
    });
    bus.subscribe('read.scroll-to-verse', (verseIdx) => {
      this.readScrollToVerse(verseIdx);
    });
    bus.subscribe('read.show', () => {
      this.readShow();
    });
    bus.subscribe('search.hide', () => {
      this.searchHide();
    });
    bus.subscribe('search.show', () => {
      this.searchShow();
    });
    bus.subscribe('setting.hide', () => {
      this.settingHide();
    });
    bus.subscribe('setting.show', () => {
      this.settingShow();
    });
    bus.subscribe('sidebar.update', (sidebar) => {
      this.sidebarUpdate(sidebar);
    });
    bus.subscribe('theme.update', (theme) => {
      this.themeUpdate(theme);
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target === null ||
      target.classList.contains('btn-icon--active')
    ) {
      return;
    }
    switch (target) {
      case this.btnBook:
        bus.publish('action.sidebar.select', 'book');
        break;
      case this.btnBookmark:
        bus.publish('action.sidebar.select', 'bookmark');
        break;
      case this.btnChapter:
        bus.publish('action.sidebar.select', 'chapter');
        break;
      case this.btnColumnOne:
        bus.publish('action.column.select', 1);
        break;
      case this.btnColumnTwo:
        bus.publish('action.column.select', 2);
        break;
      case this.btnColumnThree:
        bus.publish('action.column.select', 3);
        break;
      case this.btnHelp:
        bus.publish('action.sidebar.select', 'help');
        break;
      case this.btnSearch:
        bus.publish('action.sidebar.select', 'search');
        break;
      case this.btnSetting:
        bus.publish('action.sidebar.select', 'setting');
    }
  }

  toolbarUpperClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    switch (target) {
      case this.btnPrev:
        bus.publish('action.read.prev-chapter', 1);
        break;
      case this.btnNext:
        bus.publish('action.read.next-chapter', 2);
    }
  }

  themeUpdate(theme) {
    this.theme = theme;
    this.changeTheme();
    this.lastTheme = this.theme;
  }

  updateBanner() {
    this.banner.textContent = this.chapterPkg.chapterName;
  }

  updateColumn() {
    this.list.classList.remove('column-2', 'column-3');
    if (this.column === 2) {
      this.list.classList.add('column-2');
      return;
    }
    if (this.column === 3) {
      this.list.classList.add('column-3');
      return;
    }
  }

  updateColumnBtn() {
    if (this.activeColumnBtn) {
      this.activeColumnBtn.classList.remove('btn-icon--active');
    }
    this.activeColumnBtn = this.columnBtns[this.column - 1];
    this.activeColumnBtn.classList.add('btn-icon--active');
  }

  updateFont() {
    if (this.lastFont) {
      this.list.classList.remove(this.lastFont.fontClass);
    }
    this.list.classList.add(this.font.fontClass);
  }

  updateFontSize() {
    if (this.lastFontSize) {
      this.list.classList.remove(this.lastFontSize);
    }
    this.list.classList.add(this.fontSize);
  }

  updateVerses() {
    removeAllChildren(this.list);
    let fragment = document.createDocumentFragment();
    let chapter = tome.chapters[this.chapterPkg.chapterIdx];
    let indices = range(chapter[idxFirstVerse], chapter[idxLastVerse] + 1);
    for (let idx of indices) {
      let verse = this.buildVerse(idx);
      fragment.appendChild(verse);
    }
    this.list.appendChild(fragment);
    this.refreshVerseBookmarks();
  }

  verseClick(verse) {
    let verseIdx = parseInt(verse.dataset.verseIdx);
    if (verse.classList.contains('verse--bookmark')) {
      bus.publish('action.read.bookmark-delete', verseIdx);
    } else {
      bus.publish('action.read.bookmark-add', verseIdx);
    }
  }

  windowResize() {
    bus.publish('window.resize', null);
  }

}

export { ReadView };

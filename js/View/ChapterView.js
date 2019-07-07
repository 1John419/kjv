'use strict';

import { bus } from '../EventBus.js';

import { tome } from '../Tome/tome.js';

import {
  idxBook,
  idxChapter,
  idxChapterNum,
  idxFirstChapter,
  idxLastChapter,
  idxLongName
} from '../tomeIdx.js';

import {
  getChapterName,
  range,
  removeAllChildren
} from '../util.js';

import {
  templateElement,
  templatePage,
  templatePageScroll,
  templateToolbarLower,
  templateToolbarUpper
} from '../template.js';

const lowerToolSet = [
  { type: 'btn', icon: 'back', label: 'Back' }
];

const upperToolSet = [
  { type: 'banner', modifier: 'chapter', text: null }
];

class ChapterView {

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
  }

  buildBtnContent(chapter) {
    let btn = document.createElement('button');
    btn.classList.add('btn-chapter');
    btn.dataset.bookIdx = chapter[idxBook];
    btn.dataset.chapterIdx = chapter[idxChapter];
    btn.dataset.chapterName = getChapterName(chapter[idxChapter]);
    let chapterStr = (chapter[idxChapterNum]).toString();
    btn.textContent = chapterStr;
    btn.setAttribute('aria-label', `Chapter ${chapterStr}`);
    return btn;
  }

  bookChange(bookIdx) {
    if (this.bookIdx === bookIdx) {
      return;
    }
    this.bookIdx = bookIdx;
    this.updateBanner();
    this.updateChapterList();
  }

  buildChapterPkg(btn) {
    let bookIdx = btn.dataset.bookIdx;
    let chapterIdx = parseInt(btn.dataset.chapterIdx);
    let chapterName = btn.dataset.chapterName;
    let chapterPkg = {
      bookIdx: bookIdx,
      chapterIdx: chapterIdx,
      chapterName: chapterName
    };
    return chapterPkg;
  }

  buildPage() {
    this.page = templatePage('chapter');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templatePageScroll('chapter');
    this.list = templateElement('div', 'list', 'chapter', null, null);
    this.scroll.appendChild(this.list);
    this.page.appendChild(this.scroll);

    this.toolbarLower = templateToolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    let container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  chapterHide() {
    this.page.classList.add('page--hide');
  }

  chapterPkgUpdate(chapterPkg) {
    let oldPkg = this.chapterPkg || chapterPkg;
    this.chapterPkg = chapterPkg;
    if (oldPkg.bookIdx !== this.chapterPkg.bookIdx) {
      this.updateBanner();
      this.updateChapterList();
    }
    this.updateActiveBtn();
  }

  chapterScrollToTop() {
    if (this.page.classList.contains('page--hide')) {
      this.scrollReset = true;
      return;
    }
    this.scroll.scrollTop = 0;
  }

  chapterShow() {
    this.page.classList.remove('page--hide');
    if (this.scrollReset) {
      this.scroll.scrollTop = 0;
      this.scrollReset = false;
    }
  }

  contentBtnClick(btn) {
    let chapterPkg = this.buildChapterPkg(btn);
    bus.publish('action.chapter.select', chapterPkg);
  }

  getElements() {
    this.banner = this.toolbarUpper.querySelector('.banner--chapter');
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
    if (target.classList.contains('btn-chapter')) {
      this.contentBtnClick(target);
      return;
    }
  }

  panesUpdate(panes) {
    if (panes === 1) {
      this.btnBack.classList.remove('btn-icon--hide');
    } else {
      this.btnBack.classList.add('btn-icon--hide');
    }
  }

  subscribe() {
    bus.subscribe('book.change', (bookIdx) => {
      this.bookChange(bookIdx);
    });
    bus.subscribe('chapter.hide', () => {
      this.chapterHide();
    });
    bus.subscribe('chapter.scroll-to-top', () => {
      this.chapterScrollToTop();
    });
    bus.subscribe('chapter.show', () => {
      this.chapterShow();
    });
    bus.subscribe('chapterPkg.update', (chapterPkg) => {
      this.chapterPkgUpdate(chapterPkg);
    });
    bus.subscribe('panes.update', (panes) => {
      this.panesUpdate(panes);
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target === this.btnBack) {
      bus.publish('action.chapter.back', null);
    }
  }

  updateActiveBtn() {
    let activeBtn = this.list.querySelector('.btn-chapter--active');
    if (activeBtn) {
      activeBtn.classList.remove('btn-chapter--active');
    }
    let selector =
      `.btn-chapter[data-chapter-idx="${this.chapterPkg.chapterIdx}"]`;
    activeBtn = this.list.querySelector(selector);
    activeBtn.classList.add('btn-chapter--active');
  }

  updateBanner() {
    let bookName = tome.books[this.bookIdx][idxLongName];
    this.banner.innerHTML = `Chapter<br>${bookName}`;
  }

  updateChapterList() {
    removeAllChildren(this.list);
    let list = document.createElement('div');
    list.classList.add('content', 'content--chapter');
    let book = tome.books[this.bookIdx];
    let indices = range(book[idxFirstChapter], book[idxLastChapter] + 1);
    for (let idx of indices) {
      let btn = this.buildBtnContent(tome.chapters[idx]);
      list.appendChild(btn);
    }
    this.list.appendChild(list);
  }

}

export { ChapterView };

'use strict';

import { bus } from '../EventBus.js';

import { tome } from '../Tome/tome.js';

import {
  idxBook,
  idxLongName,
  idxShortName
} from '../tomeIdx.js';

import {
  templateElement,
  templatePage,
  templatePageScroll,
  templateToolbarLower,
  templateToolbarUpper
} from '../template.js';

const greekFirstIdx = 39;
const indices = [...Array(66).keys()];

const lowerToolSet = [
  { type: 'btn', icon: 'back', label: 'Back' }
];

const upperToolSet = [
  { type: 'banner', modifier: 'book', text: 'Book' }
];

class BookView {

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

  bookChange(bookIdx) {
    let activeBtn = this.list.querySelector('.btn-book--active');
    if (activeBtn) {
      activeBtn.classList.remove('btn-book--active');
    }
    let selector = `.btn-book[data-book-idx="${bookIdx}"]`;
    activeBtn = this.list.querySelector(selector);
    activeBtn.classList.add('btn-book--active');
  }

  bookHide() {
    this.page.classList.add('page--hide');
  }

  bookShow() {
    this.page.classList.remove('page--hide');
  }

  buildBookDivider() {
    let divider = document.createElement('hr');
    divider.classList.add('book-divider');
    return divider;
  }

  buildBooklist() {
    let booksHebrew = this.buildHebrewList();
    let booksGreek = this.buildGreekList();
    let divider = this.buildBookDivider();
    this.list.appendChild(booksHebrew);
    this.list.appendChild(divider);
    this.list.appendChild(booksGreek);
  }

  buildBtnBook(book) {
    let btn = document.createElement('button');
    btn.classList.add('btn-book');
    btn.dataset.bookIdx = book[idxBook];
    btn.textContent = book[idxShortName];
    btn.setAttribute('aria-label', book[idxLongName]);
    return btn;
  }

  buildGreekList() {
    let booksGreek = document.createElement('div');
    booksGreek.classList.add('content', 'content--greek-book');
    let greekIndices = indices.slice(greekFirstIdx);
    for (let idx of greekIndices) {
      let btn = this.buildBtnBook(tome.books[idx]);
      booksGreek.appendChild(btn);
    }
    return booksGreek;
  }

  buildHebrewList() {
    let booksHebrew = document.createElement('div');
    booksHebrew.classList.add('content', 'content--hebrew-book');
    let hebrewIndices = indices.slice(0, greekFirstIdx);
    for (let idx of hebrewIndices) {
      let btn = this.buildBtnBook(tome.books[idx]);
      booksHebrew.appendChild(btn);
    }
    return booksHebrew;
  }

  buildPage() {
    this.page = templatePage('book');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templatePageScroll('book');
    this.list = templateElement('div', 'list', 'book', null, null);
    this.scroll.appendChild(this.list);
    this.page.appendChild(this.scroll);

    this.toolbarLower = templateToolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    let container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  contentBtnClick(btn) {
    let bookIdx = btn.dataset.bookIdx;
    bus.publish('action.book.select', bookIdx);
  }

  getElements() {
    this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
  }

  initialize() {
    this.buildPage();
    this.getElements();
    this.addListeners();
    this.subscribe();

    this.buildBooklist();
  }

  listClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target.classList.contains('btn-book')) {
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
    bus.subscribe('book.hide', () => {
      this.bookHide();
    });
    bus.subscribe('book.show', () => {
      this.bookShow();
    });
    bus.subscribe('panes.update', (panes) => {
      this.panesUpdate(panes);
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target === this.btnBack) {
      bus.publish('action.book.back', null);
    }
  }

}

export { BookView };

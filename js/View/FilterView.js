'use strict';

import { bus } from '../EventBus.js';

import { tome } from '../Tome/tome.js';

import { idxBook } from '../tomeIdx.js';

import {
  removeAllChildren
} from '../util.js';

import {
  templateBtnIcon,
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
  { type: 'banner', modifier: 'filter', text: null }
];

class FilterView {

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

  bookClick(divFilter) {
    if (divFilter.classList.contains('filter--folded')) {
      this.unfoldBook(divFilter);
    } else {
      this.foldBook(divFilter);
    }
    this.toggleFilter(divFilter);
  }

  buildBookFilter(rigBook) {
    let divFilter = document.createElement('div');
    divFilter.classList.add('filter', 'filter--book', 'filter--folded');
    divFilter.dataset.bookIdx = rigBook.bookIdx;
    let btnFilter = document.createElement('button');
    btnFilter.classList.add('btn-filter', 'btn-filter--book');
    btnFilter.textContent = `${rigBook.name}: ${rigBook.occurrences} /
      ${rigBook.verses}`;
    divFilter.appendChild(btnFilter);
    let btnSelectFilter = templateBtnIcon('select-filter', 'Select Filter');
    btnSelectFilter.dataset.bookIdx = rigBook.bookIdx;
    btnSelectFilter.dataset.chapterIdx = rigBook.chapterIdx;
    let btnActiveFilter = templateBtnIcon('active-filter', 'Active Filter');
    btnActiveFilter.classList.add('btn-icon--hide');
    divFilter.appendChild(btnSelectFilter);
    divFilter.appendChild(btnActiveFilter);
    return divFilter;
  }

  buildChapterFilter(rigBook, rigChapter) {
    let divFilter = document.createElement('div');
    divFilter.classList.add('filter', 'filter--chapter', 'filter--hide');
    divFilter.dataset.bookIdx = rigBook.bookIdx;
    let btnFilter = document.createElement('button');
    btnFilter.classList.add('btn-filter', 'btn-filter--chapter');
    btnFilter.textContent =
      `${rigChapter.name}: ${rigChapter.occurrences} / ${rigChapter.verses}`;
    divFilter.appendChild(btnFilter);
    let btnSelectFilter = templateBtnIcon('select-filter', 'Select Filter');
    btnSelectFilter.dataset.bookIdx = rigChapter.bookIdx;
    btnSelectFilter.dataset.chapterIdx = rigChapter.chapterIdx;
    let btnActiveFilter = templateBtnIcon('active-filter', 'Active Filter');
    btnActiveFilter.classList.add('btn-icon--hide');
    divFilter.appendChild(btnSelectFilter);
    divFilter.appendChild(btnActiveFilter);
    return divFilter;
  }

  buildFilters() {
    let fragment = document.createDocumentFragment();
    let tome = this.rig.bins;
    let tomeFilter = this.buildTomeFilter(tome);
    fragment.appendChild(tomeFilter);
    for (let book of tome.books) {
      let bookFilter = this.buildBookFilter(book);
      fragment.appendChild(bookFilter);
      for (let chapter of book.chapters) {
        let chapterFilter = this.buildChapterFilter(book, chapter);
        fragment.appendChild(chapterFilter);
      }
    }
    return fragment;
  }

  buildPage() {
    this.page = templatePage('filter');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templatePageScroll('filter');
    this.list = templateElement('div', 'list', 'filter', null, null);
    this.scroll.appendChild(this.list);
    this.page.appendChild(this.scroll);

    this.toolbarLower = templateToolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    let container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  buildTomeFilter(tomeBin) {
    let divFilter = document.createElement('div');
    divFilter.classList.add('filter', 'filter--tome', 'filter--unfolded');
    let btnFilter = document.createElement('button');
    btnFilter.classList.add('btn-filter', 'btn-filter--tome');
    btnFilter.textContent = `${tomeBin.name}: ${tomeBin.occurrences} / ${tomeBin.verses}`;
    divFilter.appendChild(btnFilter);
    let btnSelectFilter = templateBtnIcon('select-filter', 'Select Filter');
    btnSelectFilter.dataset.bookIdx = tomeBin.bookIdx;
    btnSelectFilter.dataset.chapterIdx = tomeBin.chapterIdx;
    let btnActiveFilter = templateBtnIcon('active-filter', 'Active Filter');
    btnActiveFilter.classList.add('btn-icon--hide');
    divFilter.appendChild(btnSelectFilter);
    divFilter.appendChild(btnActiveFilter);
    return divFilter;
  }

  filterHide() {
    this.page.classList.add('page--hide');
  }

  filterScrollToTop() {
    if (this.page.classList.contains('page--hide')) {
      this.scrollReset = true;
      return;
    }
    this.scroll.scrollTop = 0;
  }

  filterShow() {
    this.page.classList.remove('page--hide');
    if (this.scrollReset) {
      this.scroll.scrollTop = 0;
      this.scrollReset = false;
    }
  }

  filterUpdate(filter) {
    this.filter = filter;
    this.getActiveBin();
    if (this.filter) {
      if (this.activeDivFilter) {
        let activeBtnSelectFilter = this.activeDivFilter.querySelector(
          '.btn-icon--select-filter');
        activeBtnSelectFilter.classList.remove('btn-icon--hide');
        let activeBtnActiveFilter = this.activeDivFilter.querySelector(
          '.btn-icon--active-filter');
        activeBtnActiveFilter.classList.add('btn-icon--hide');
      }
      let btnSelectFilter = this.list.querySelector(
        `button[data-book-idx="${this.filter.bookIdx}"]` +
        `[data-chapter-idx="${this.filter.chapterIdx}"]`
      );
      if (btnSelectFilter) {
        this.activeDivFilter = btnSelectFilter.closest('div');
        btnSelectFilter = this.activeDivFilter.querySelector(
          '.btn-icon--select-filter');
        btnSelectFilter.classList.add('btn-icon--hide');
        let btnActiveFilter = this.activeDivFilter.querySelector(
          '.btn-icon--active-filter');
        btnActiveFilter.classList.remove('btn-icon--hide');
      }
    }
  }

  foldAllBooks() {
    let unfoldedBooks = this.list.querySelectorAll(
      '.filter--book.filter--unfolded');
    for (let book of unfoldedBooks) {
      book.classList.remove('filter--unfolded');
      book.classList.add('filter--folded');
    }
  }

  foldBook(divFilter) {
    let bookIdx = divFilter.dataset.bookIdx;
    let chapters = this.list.querySelectorAll(
      `.filter--chapter[data-book-idx="${bookIdx}"]`
    );
    for (let chapter of chapters) {
      chapter.classList.add('filter--hide');
    }
  }

  foldTome() {
    this.hideAllChapters();
    this.foldAllBooks();
    this.hideAllBooks();
  }

  getActiveBin() {
    if (!this.filter) {
      this.activeBin = null;
      bus.publish('active.bin.update', this.activeBin);
      return;
    }
    if (this.filter.bookIdx === null) {
      if (this.filter.chapterIdx === null) {
        this.activeBin = this.rig.bins;
      } else {
        let bookLookup =
          tome.chapters[this.filter.chapterIdx][idxBook];
        let bookBin = this.rig.bins.books.find((bin) => {
          return bin.bookIdx === bookLookup;
        });
        let chapterBin = bookBin.chapters.find((bin) => {
          return bin.chapterIdx === this.filter.chapterIdx;
        });
        this.activeBin = chapterBin;
      }
    } else {
      let bookBin = this.rig.bins.books.find((bin) => {
        return bin.bookIdx === this.filter.bookIdx;
      });
      this.activeBin = bookBin;
    }
    bus.publish('active.bin.update', this.activeBin);
  }

  getElements() {
    this.banner = this.toolbarUpper.querySelector('.banner--filter');

    this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
  }

  getFilter(btnSelectFilter) {
    let bookIdx = btnSelectFilter.dataset.bookIdx;
    let chapterIdx = btnSelectFilter.dataset.chapterIdx;
    let seachFilter = {
      bookIdx: bookIdx === 'null' ? null : parseInt(bookIdx),
      chapterIdx: chapterIdx === 'null' ? null : parseInt(chapterIdx)
    };
    return seachFilter;
  }

  hideAllBooks() {
    let books = this.list.querySelectorAll('.filter--book');
    for (let book of books) {
      book.classList.add('filter--hide');
    }
  }

  hideAllChapters() {
    let chapters = this.list.querySelectorAll('.filter--chapter');
    for (let chapter of chapters) {
      chapter.classList.add('filter--hide');
    }
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
    if (target.classList.contains('btn-icon--select-filter')) {
      this.selectFilterClick(target);
      return;
    }
    let divFilter = target.closest('div');
    if (target.classList.contains('btn-filter--tome')) {
      this.tomeClick(divFilter);
      return;
    }
    if (target.classList.contains('btn-filter--book')) {
      this.bookClick(divFilter);
      return;
    }
  }

  rigUpdate(rig) {
    this.rig = rig;
    this.updateBanner();
    this.updateList();
  }

  selectFilterClick(btnSelectFilter) {
    let filter = this.getFilter(btnSelectFilter);
    bus.publish('action.filter.select', filter);
  }

  subscribe() {
    bus.subscribe('filter.hide', () => {
      this.filterHide();
    });
    bus.subscribe('filter.scroll-to-top', () => {
      this.filterScrollToTop();
    });
    bus.subscribe('filter.show', () => {
      this.filterShow();
    });
    bus.subscribe('filter.update', (filter) => {
      this.filterUpdate(filter);
    });
    bus.subscribe('rig.update', (rig) => {
      this.rigUpdate(rig);
    });
  }

  toggleFilter(divFilter) {
    if (divFilter.classList.contains('filter--folded')) {
      divFilter.classList.remove('filter--folded');
      divFilter.classList.add('filter--unfolded');
    } else {
      divFilter.classList.remove('filter--unfolded');
      divFilter.classList.add('filter--folded');
    }
  }

  tomeClick(divFilter) {
    if (divFilter.classList.contains('filter--folded')) {
      this.unfoldTome();
    } else {
      this.foldTome();
    }
    this.toggleFilter(divFilter);
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target === this.btnBack) {
      bus.publish('action.filter.back', null);
      return;
    }
  }

  unfoldBook(divFilter) {
    let bookIdx = divFilter.dataset.bookIdx;
    let chapters = this.list.querySelectorAll(
      `.filter--chapter[data-book-idx="${bookIdx}"]`
    );
    for (let chapter of chapters) {
      chapter.classList.remove('filter--hide');
    }
  }

  unfoldTome() {
    let books = this.list.querySelectorAll('.filter--book');
    for (let book of books) {
      book.classList.remove('filter--hide');
    }
  }

  updateBanner() {
    this.banner.innerHTML = `Filter<br>${this.rig.query}`;
  }

  updateList() {
    removeAllChildren(this.list);
    if (this.rig.state !== 'OK') {
      return;
    }
    let list = this.buildFilters();
    this.list.appendChild(list);
  }

}

export { FilterView };

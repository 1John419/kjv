'use strict';

import { bus } from '../EventBus.js';

import { tome } from '../Tome/tome.js';

import {
  getChapterName,
  getRefName,
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
  { type: 'btn', icon: 'back', label: 'Back' },
  { type: 'input', modifier: 'query', label: 'Search Query' },
  { type: 'btn', icon: 'search-go', label: 'Search Go' }
];

const upperToolSet = [
  { type: 'btn', icon: 'filter', label: 'Filter' },
  { type: 'banner', modifier: 'search', text: null },
  { type: 'btn', icon: 'history', label: 'History' }
];

class SearchView {

  constructor() {
    this.initialize();
  }

  activeBinUpdate(activeBin) {
    this.activeBin = activeBin;
    this.updateBanner();
    this.updateList();
  }

  addListeners() {
    this.inputQuery.addEventListener('keydown', (event) => {
      this.inputQueryKeyDown(event);
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

  addVerse(verseIdx) {
    let btn = document.createElement('button');
    btn.classList.add('btn-search');
    btn.dataset.verseIdx = verseIdx;
    let searchText = document.createElement('span');
    searchText.classList.add('span-search-text');
    let acrostic = this.buildAcrosticSpan(verseIdx);
    let ref = this.buildRefSpan(verseIdx);
    let text = document.createTextNode(tome.verses[verseIdx]);
    searchText.appendChild(ref);
    if (acrostic) {
      searchText.appendChild(acrostic);
    }
    searchText.appendChild(text);
    btn.appendChild(searchText);
    return btn;
  }

  buildAcrosticSpan(verseIdx) {
    let acrostics = tome.acrostics;
    if (!acrostics) {
      return undefined;
    }
    let acrostic = acrostics[verseIdx];
    if (!acrostic) {
      return undefined;
    }
    let acrosticSpan = document.createElement('span');
    acrosticSpan.classList.add('acrostic');
    acrosticSpan.textContent = acrostic;
    return acrosticSpan;
  }

  buildPage() {
    this.page = templatePage('search');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templatePageScroll('search');
    this.list = templateElement('div', 'list', 'search', null, null);
    this.scroll.appendChild(this.list);
    this.page.appendChild(this.scroll);

    this.toolbarLower = templateToolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    let container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  buildRefSpan(verseIdx) {
    let refSpan = document.createElement('span');
    refSpan.classList.add('ref');
    refSpan.textContent = getRefName(verseIdx);
    return refSpan;
  }

  filteredVerses() {
    return this.rig.verses.filter((verse) => {
      return verse >= this.activeBin.start && verse <= this.activeBin.end;
    });
  }

  fontSizeUpdate(fontSize) {
    if (this.fontSize) {
      this.lastFontSize = this.fontSize;
    }
    this.fontSize = fontSize;
    this.updateFontSize();
  }

  fontUpdate(font) {
    if (this.font) {
      this.lastFont = this.font;
    }
    this.font = font;
    this.updateFont();
  }

  goClick() {
    this.query = this.inputQuery.value;
    bus.publish('action.search.go', this.query);
  }

  getElements() {
    this.btnFilter = this.toolbarUpper.querySelector('.btn-icon--filter');
    this.banner = this.toolbarUpper.querySelector('.banner--search');
    this.btnHistory = this.toolbarUpper.querySelector('.btn-icon--history');

    this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
    this.btnBack.classList.add('btn-icon--border-right');
    this.inputQuery = this.toolbarLower.querySelector('.input--query');
    this.btnSearchGo = this.toolbarLower.querySelector('.btn-icon--search-go');
  }

  initialize() {
    this.buildPage();
    this.getElements();
    this.addListeners();
    this.subscribe();
    this.lastFont = null;
    this.lastFontSize = null;
  }

  inputQueryKeyDown(event) {
    if (event.key === 'Enter') {
      this.goClick();
    }
  }

  listClick(event) {
    event.preventDefault();
    let target = event.target;
    let btn = target.closest('button');
    let verseIdx = parseInt(btn.dataset.verseIdx);
    bus.publish('action.search.select', verseIdx);
  }

  panesUpdate(panes) {
    if (panes === 1) {
      this.btnBack.classList.remove('btn-icon--hide');
    } else {
      this.btnBack.classList.add('btn-icon--hide');
    }
  }

  rigUpdate(rig) {
    this.rig = rig;
    this.query = this.rig.query;
    this.inputQuery.value = this.query;
  }

  searchHide() {
    this.page.classList.add('page--hide');
  }

  searchScrollToTop() {
    this.scroll.scrollTop = 0;
  }

  searchShow() {
    this.page.classList.remove('page--hide');
  }

  subscribe() {
    bus.subscribe('active.bin.update', (activeBin) => {
      this.activeBinUpdate(activeBin);
    });
    bus.subscribe('font.update', (font) => {
      this.fontUpdate(font);
    });
    bus.subscribe('font-size.update', (fontSize) => {
      this.fontSizeUpdate(fontSize);
    });
    bus.subscribe('panes.update', (panes) => {
      this.panesUpdate(panes);
    });
    bus.subscribe('rig.update', (rig) => {
      this.rigUpdate(rig);
    });
    bus.subscribe('search.hide', () => {
      this.searchHide();
    });
    bus.subscribe('search.scroll-to-top', () => {
      this.searchScrollToTop();
    });
    bus.subscribe('search.show', () => {
      this.searchShow();
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    switch (target) {
      case this.btnBack:
        bus.publish('action.search.back', null);
        break;
      case this.btnSearchGo:
        this.goClick();
    }
  }

  toolbarUpperClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    switch (target) {
      case this.btnFilter:
        bus.publish('action.search.filter', null);
        break;
      case this.btnHistory:
        bus.publish('action.search.history', null);
    }
  }

  updateBanner() {
    removeAllChildren(this.banner);
    if (this.rig.type === 'EMPTY') {
      this.banner.textContent = 'Enter a search expression.';
      return;
    }
    if (this.rig.type === 'INVALID') {
      this.banner.textContent = 'Invalid search expression.';
      return;
    }
    if (this.rig.tomeWords !== 'OK') {
      this.banner.textContent = this.rig.tomeWords;
      return;
    }
    if (this.activeBin.occurrences === 0) {
      this.banner.textContent = 'Not Found.';
      return;
    }
    let citation;
    if (this.activeBin.chapterIdx === null) {
      citation = this.activeBin.name;
    } else {
      citation = getChapterName(this.activeBin.chapterIdx);
    }
    let times = this.activeBin.occurrences > 1 ?
      `${this.activeBin.occurrences} times in ` :
      '1 time in ';
    let verses = this.activeBin.verses > 1 ?
      `${this.activeBin.verses} verses` :
      '1 verse';
    this.banner.innerHTML =
      `${citation}<br>${times}${verses}`;
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

  updateList() {
    removeAllChildren(this.list);
    if (this.rig.state !== 'OK') {
      return;
    }
    let fragment = document.createDocumentFragment();
    let verses = this.filteredVerses();
    for (let verseIdx of verses) {
      let verse = this.addVerse(verseIdx);
      fragment.appendChild(verse);
    }
    this.list.appendChild(fragment);
  }

}

export { SearchView };

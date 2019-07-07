'use strict';

import { bus } from '../EventBus.js';

import { getChapterPkg } from '../util.js';

class SearchController {

  constructor() {
    this.initialize();
  }

  actionFilterBack() {
    bus.publish('filter.hide', null);
    this.subPage = null;
    bus.publish('search.show', null);
  }

  actionFilterSelect(searchFilter) {
    this.searchFilter = searchFilter;
    bus.publish('filter.change', this.searchFilter);
    bus.publish('filter.hide', null);
    this.subPage = null;
    bus.publish('search.show', null);
    bus.publish('search.scroll-to-top', null);
  }

  actionHistoryBack() {
    bus.publish('history.hide', null);
    this.subPage = null;
    bus.publish('search.show', null);
  }

  actionHistoryDelete(query) {
    bus.publish('history.delete', query);
  }

  actionHistoryDown(query) {
    bus.publish('history.down', query);
  }

  actionHistorySelect(query) {
    this.query = query;
    bus.publish('query.change', this.query);
    bus.publish('history.hide', null);
    this.subPage = null;
    bus.publish('search.show', null);
    bus.publish('search.scroll-to-top', null);
    bus.publish('filter.scroll-to-top', null);
  }

  actionHistoryUp(query) {
    bus.publish('history.up', query);
  }

  actionSearchBack() {
    bus.publish('sidebar.change', 'none');
  }

  actionSearchFilter() {
    bus.publish('search.hide', null);
    this.subPage = 'filter';
    bus.publish('filter.show', null);
  }

  actionSearchGo(query) {
    this.query = query;
    bus.publish('query.change', this.query);
    bus.publish('search.show', null);
    bus.publish('search.scroll-to-top', null);
    bus.publish('filter.scroll-to-top', null);
    bus.publish('history.scroll-to-top', null);
  }

  actionSearchHistory() {
    bus.publish('search.hide', null);
    this.subPage = 'history';
    bus.publish('history.show', null);
  }

  actionSearchSelect(verseIdx) {
    let chapterPkg = getChapterPkg(verseIdx);
    bus.publish('chapterPkg.change', chapterPkg);
    if (this.panes === 1) {
      bus.publish('action.sidebar.select', 'none');
    }
    bus.publish('read.scroll-to-verse', verseIdx);
  }

  initialize() {
    this.subscribe();
  }

  panesUpdate(panes) {
    this.panes = panes;
  }

  sidebarUpdate() {
    if (!this.subPage) {
      return;
    }
    bus.publish(`${this.subPage}.hide`, null);
    this.subPage = null;
  }

  subscribe() {
    bus.subscribe('action.filter.back', () => {
      this.actionFilterBack();
    });
    bus.subscribe('action.filter.select', (searchFilter) => {
      this.actionFilterSelect(searchFilter);
    });
    bus.subscribe('action.history.back', () => {
      this.actionHistoryBack();
    });
    bus.subscribe('action.history.delete', (query) => {
      this.actionHistoryDelete(query);
    });
    bus.subscribe('action.history.down', (query) => {
      this.actionHistoryDown(query);
    });
    bus.subscribe('action.history.select', (query) => {
      this.actionHistorySelect(query);
    });
    bus.subscribe('action.history.up', (query) => {
      this.actionHistoryUp(query);
    });
    bus.subscribe('action.search.back', () => {
      this.actionSearchBack();
    });
    bus.subscribe('action.search.filter', () => {
      this.actionSearchFilter();
    });
    bus.subscribe('action.search.go', (query) => {
      this.actionSearchGo(query);
    });
    bus.subscribe('action.search.history', () => {
      this.actionSearchHistory();
    });
    bus.subscribe('action.search.select', (verseIdx) => {
      this.actionSearchSelect(verseIdx);
    });
    bus.subscribe('panes.update', (panes) => {
      this.panesUpdate(panes);
    });
    bus.subscribe('sidebar.update', () => {
      this.sidebarUpdate();
    });
  }

}

export { SearchController };

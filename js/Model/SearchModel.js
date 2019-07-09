'use strict';

import { bus } from '../EventBus.js';

import { appPrefix } from '../util.js';

import { SearchEngine } from '../SearchEngine.js';

class SearchModel {

  constructor() {
    this.initialize();
  }

  addHistory() {
    if (this.history.indexOf(this.query) != -1) {
      return;
    }
    this.history = [this.query, ...this.history];
    this.updateHistory();
  }

  filterChange(filter) {
    this.filter = filter;
    this.saveFilter();
    bus.publish('filter.update', this.filter);
  }

  getFilter() {
    let value = localStorage.getItem(`${appPrefix}-filter`);
    if (!value) {
      this.resetFilter();
      return;
    } else {
      this.filter = JSON.parse(value);
    }
    bus.publish('filter.update', this.filter);
  }

  getHistory() {
    let value = localStorage.getItem(`${appPrefix}-history`);
    if (!value) {
      this.history = [];
      this.saveHistory();
    } else {
      this.history = JSON.parse(value);
    }
    bus.publish('history.update', this.history);
  }

  getQuery() {
    let value = localStorage.getItem(`${appPrefix}-query`);
    if (!value) {
      this.query = '';
      this.saveQuery();
    } else {
      this.query = JSON.parse(value);
    }
    this.rig = this.engine.performSearch(this.query);
    bus.publish('rig.update', this.rig);
  }

  historyDelete(str) {
    let index = this.history.indexOf(str);
    this.history.splice(index, 1);
    this.updateHistory();
  }

  historyDown(str) {
    let index = this.history.indexOf(str);
    if (index === (this.history.length - 1) || index === -1) {
      return;
    }
    this.reorderHistory(index, index + 1);
    this.updateHistory();
  }

  historyUp(str) {
    let index = this.history.indexOf(str);
    if (index === 0 || index === -1) {
      return;
    }
    this.reorderHistory(index, index - 1);
    this.updateHistory();
  }

  initialize() {
    this.engine = new SearchEngine();
    this.subscribe();
  }

  queryChange(query) {
    this.query = query;
    this.saveQuery();
    this.updateRig();
    this.resetFilter();
  }

  reorderHistory(fromIdx, toIdx) {
    this.history.splice(toIdx, 0, this.history.splice(fromIdx, 1)[0]);
  }

  resetFilter() {
    let filter = {
      bookIdx: null,
      chapterIdx: null
    };
    this.filterChange(filter);
  }

  saveFilter() {
    localStorage.setItem(`${appPrefix}-filter`, JSON.stringify(this.filter));
  }

  saveHistory() {
    localStorage.setItem(`${appPrefix}-history`, JSON.stringify(this.history));
  }

  saveQuery() {
    localStorage.setItem(`${appPrefix}-query`, JSON.stringify(this.query));
  }

  searchGet() {
    this.getHistory();
    this.getQuery();
    this.getFilter();
  }

  subscribe() {
    bus.subscribe('filter.change', (filter) => {
      this.filterChange(filter);
    });
    bus.subscribe('history.delete', (query) => {
      this.historyDelete(query);
    });
    bus.subscribe('history.down', (query) => {
      this.historyDown(query);
    });
    bus.subscribe('history.up', (query) => {
      this.historyUp(query);
    });
    bus.subscribe('query.change', (query) => {
      this.queryChange(query);
    });
    bus.subscribe('search.get', () => {
      this.searchGet();
    });
  }

  updateHistory() {
    this.saveHistory();
    bus.publish('history.update', this.history);
  }

  updateRig() {
    this.rig = this.engine.performSearch(this.query);
    if (this.rig.state === 'OK') {
      this.addHistory();
    }
    bus.publish('rig.update', this.rig);
  }

}

export { SearchModel };

'use strict';

import { bus } from '../EventBus.js';

import { appPrefix } from '../util.js';

class ReadModel {

  constructor() {
    this.initialize();
  }

  columnChange(column) {
    this.column = column;
    this.saveColumn();
    bus.publish('column.update', this.column);
  }

  getColumn() {
    let column = localStorage.getItem(`${appPrefix}-column`);
    if (!column) {
      column = 1;
    } else {
      column = JSON.parse(column);
    }
    this.columnChange(column);
  }

  getSidebar() {
    let sidebar = localStorage.getItem(`${appPrefix}-sidebar`);
    if (!sidebar) {
      sidebar = this.panes > 1 ? 'book' : 'none';
    } else {
      sidebar = JSON.parse(sidebar);
    }
    if (this.panes > 1) {
      sidebar = sidebar === 'none' ? 'book' : sidebar;
    } else if (sidebar !== 'none') {
      sidebar = 'none';
    }
    this.sidebarChange(sidebar);
  }

  initialize() {
    this.subscribe();
  }

  panesChange(panes) {
    this.panes = panes;
    bus.publish('panes.update', this.panes);
  }

  readGet() {
    this.getColumn();
    this.getSidebar();
  }

  saveColumn() {
    localStorage.setItem(`${appPrefix}-column`, JSON.stringify(this.column));
  }

  saveSidebar() {
    localStorage.setItem(`${appPrefix}-sidebar`, JSON.stringify(this.sidebar));
  }

  sidebarChange(sidebar) {
    this.sidebar = sidebar;
    this.saveSidebar();
    bus.publish('sidebar.update', this.sidebar);
  }

  subscribe() {
    bus.subscribe('column.change',
      (column) => { this.columnChange(column); }
    );
    bus.subscribe('panes.change', (panes) => {
      this.panesChange(panes);
    });
    bus.subscribe('read.get',
      () => { this.readGet(); }
    );
    bus.subscribe('sidebar.change', (sidebar) => {
      this.sidebarChange(sidebar);
    });
  }

}

export { ReadModel };

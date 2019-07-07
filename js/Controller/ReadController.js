'use strict';

import { bus } from '../EventBus.js';

class ReadController {

  constructor() {
    this.initialize();
  }

  actionColumnSelect(column) {
    this.column = column;
    bus.publish('column.change', column);
  }

  actionReadBookmarkAdd(verseIdx) {
    bus.publish('bookmark.add', verseIdx);
    bus.publish('bookmark.scroll-to-top', null);
  }

  actionReadBookmarkDelete(verseIdx) {
    bus.publish('bookmark.delete', verseIdx);
  }

  actionReadNextChapter() {
    bus.publish('chapter.next');
    bus.publish('read.scroll-to-top', null);
  }

  actionReadPrevChapter() {
    bus.publish('chapter.prev');
    bus.publish('read.scroll-to-top', null);
  }

  chapterPkgUpdate(chapterPkg) {
    this.chapterPkg = chapterPkg;
  }

  columnUpdate(column) {
    this.column = column;
  }

  decreasePanes() {
    if (this.panes === 1) {
      this.lastSidebar = this.sidebar;
      bus.publish('sidebar.change', 'none');
      bus.publish('action.column.select', 1);
      return;
    }
    if (this.panes === 2) {
      bus.publish('action.column.select', 1);
      return;
    }
    if (this.panes === 3 && this.column > 1) {
      bus.publish('action.column.select', 2);
      return;
    }
  }

  increasePanes() {
    if (this.currentPanes > 1) {
      return;
    }
    if (this.sidebar !== 'none') {
      bus.publish('read.show', null);
      return;
    }
    if (this.lastSidebar === null) {
      bus.publish('sidebar.change', 'book');
      return;
    }
    bus.publish('sidebar.change', this.lastSidebar);
  }

  initialize() {
    this.subscribe();
    this.sidebar = null;
    this.lastSidebar = null;
  }

  initializeApp() {
    this.setPanes();
    this.currentPanes = this.panes;
    bus.publish('bookmark.get', null);
    bus.publish('content.get', null);
    bus.publish('search.get', null);
    bus.publish('setting.get', null);
    bus.publish('help.get', null);
    bus.publish('read.get', null);
  }

  setPanes() {
    this.panes = Math.min(Math.floor(window.innerWidth / 320), 4);
    bus.publish('panes.change', this.panes);
  }

  sidebarClick(sidebar) {
    bus.publish('sidebar.change', sidebar);
  }

  sidebarUpdate(sidebar) {
    if (sidebar === this.sidebar) {
      return;
    }
    if (sidebar === 'none') {
      this.lastSidebar = this.sidebar;
      bus.publish(`${this.sidebar}.hide`, null);
      this.sidebar = sidebar;
      bus.publish('read.show', null);
      return;
    }
    if (this.panes === 1) {
      if (this.sidebar === 'none') {
        bus.publish('read.hide', null);
      } else {
        bus.publish(`${this.sidebar}.hide`, null);
      }
      this.sidebar = sidebar;
      bus.publish(`${this.sidebar}.show`, null);
      return;
    }
    bus.publish('read.show', null);
    bus.publish(`${this.sidebar}.hide`, null);
    this.sidebar = sidebar;
    bus.publish(`${this.sidebar}.show`, null);
  }

  subscribe() {
    bus.subscribe('action.column.select',
      (column) => { this.actionColumnSelect(column); }
    );
    bus.subscribe('action.read.bookmark-add',
      (verseIdx) => { this.actionReadBookmarkAdd(verseIdx); }
    );
    bus.subscribe('action.read.bookmark-delete',
      (verseIdx) => { this.actionReadBookmarkDelete(verseIdx); }
    );
    bus.subscribe('action.read.next-chapter',
      () => { this.actionReadNextChapter(); }
    );
    bus.subscribe('action.read.prev-chapter',
      () => { this.actionReadPrevChapter(); }
    );
    bus.subscribe('action.sidebar.select', (sidebar) => {
      this.sidebarClick(sidebar);
    });
    bus.subscribe('chapterPkg.update', (chapterPkg) => {
      this.chapterPkgUpdate(chapterPkg);
    });
    bus.subscribe('column.update', (column) => {
      this.columnUpdate(column);
    });
    bus.subscribe('sidebar.update', (sidebar) => {
      this.sidebarUpdate(sidebar);
    });
    bus.subscribe('window.resize', () => {
      this.updatePanes();
    });
  }

  updatePanes() {
    this.setPanes();
    if (this.currentPanes === this.panes) {
      return;
    }
    if (this.currentPanes > this.panes) {
      this.decreasePanes();
    } else {
      this.increasePanes();
    }
    this.currentPanes = this.panes;
  }

}

export { ReadController };

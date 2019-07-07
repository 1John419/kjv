'use strict';

import { bus } from '../EventBus.js';

import { tome } from '../Tome/tome.js';

import {
  idxChapter,
  idxFirstChapter
} from '../tomeIdx.js';

import { getChapterName } from '../util.js';

class ContentController {

  constructor() {
    this.initialize();
  }

  actionBookBack() {
    bus.publish('sidebar.change', 'none');
  }

  actionBookSelect(bookIdx) {
    if (bookIdx !== this.lastBookIdx) {
      bus.publish('book.change', bookIdx);
      bus.publish('chapter.scroll-to-top');
    }
    this.lastBookIdx = bookIdx;
    if (this.panes > 1) {
      let chapter = this.buildFirstChapter(bookIdx);
      bus.publish('chapterPkg.change', chapter);
      bus.publish('read.scroll-to-top', null);
    }
    bus.publish('sidebar.change', 'chapter');
  }

  actionChapterBack() {
    bus.publish('sidebar.change', 'none');
  }

  actionChapterSelect(chapter) {
    this.chapter = chapter;
    bus.publish('chapterPkg.change', chapter);
    if (this.panes === 1) {
      bus.publish('chapter.hide', null);
      bus.publish('action.sidebar.select', 'none');
    }
    bus.publish('read.scroll-to-top', null);
  }

  buildFirstChapter(bookIdx) {
    let firstChapterIdx = tome.books[bookIdx][idxFirstChapter];
    let chapterIdx = tome.chapters[firstChapterIdx][idxChapter];
    let chapterName = getChapterName(chapterIdx);
    let chapter = {
      bookIdx: bookIdx,
      chapterIdx: chapterIdx,
      chapterName: chapterName
    };
    return chapter;
  }

  initialize() {
    this.subscribe();
    this.lastBookIdx = null;
  }

  panesUpdate(panes) {
    this.panes = panes;
  }

  subscribe() {
    bus.subscribe('action.book.back', () => {
      this.actionBookBack();
    });
    bus.subscribe('action.book.select', (bookIdx) => {
      this.actionBookSelect(bookIdx);
    });
    bus.subscribe('action.chapter.back', () => {
      this.actionChapterBack();
    });
    bus.subscribe('action.chapter.select', (chapter) => {
      this.actionChapterSelect(chapter);
    });
    bus.subscribe('panes.update', (panes) => {
      this.panesUpdate(panes);
    });
  }

}

export { ContentController };

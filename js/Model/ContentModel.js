'use strict';

import { bus } from '../EventBus.js';

import { tome } from '../Tome/tome.js';

import { idxBook } from '../tomeIdx.js';

import { appPrefix } from '../app.js';

import { getChapterName } from '../util.js';

class ContentModel {

  constructor() {
    this.initialize();
  }

  buildChapterPkg(chapterIdx) {
    let chapter = tome.chapters[chapterIdx];
    return {
      bookIdx: chapter[idxBook],
      chapterIdx: chapterIdx,
      chapterName: getChapterName(chapterIdx)
    };
  }

  chapterPkgChange(chapterPkg) {
    this.chapterPkg = chapterPkg;
    this.saveChapterPkg();
    bus.publish('book.change', this.chapterPkg.bookIdx);
    bus.publish('chapterPkg.update', this.chapterPkg);
  }

  chapterNext() {
    let nextChapterIdx = this.chapterPkg.chapterIdx + 1;
    if (nextChapterIdx >= tome.chapters.length) {
      nextChapterIdx = 0;
    }
    this.chapterPkgChange(this.buildChapterPkg(nextChapterIdx));
  }

  chapterPrev() {
    let prevChapterIdx = this.chapterPkg.chapterIdx - 1;
    if (prevChapterIdx < 0) {
      prevChapterIdx = tome.chapters.length - 1;
    }
    this.chapterPkgChange(this.buildChapterPkg(prevChapterIdx));
  }

  contentGet() {
    this.getChapterPkg();
  }

  getChapterPkg() {
    let chapterPkg = localStorage.getItem(`${appPrefix}-chapterPkg`);
    if (!chapterPkg) {
      chapterPkg = this.buildChapterPkg(0);
    } else {
      chapterPkg = JSON.parse(chapterPkg);
    }
    this.chapterPkgChange(chapterPkg);
  }

  initialize() {
    this.subscribe();
  }

  saveChapterPkg() {
    localStorage.setItem(`${appPrefix}-chapterPkg`, JSON.stringify(this.chapterPkg));
  }

  subscribe() {
    bus.subscribe('chapter.next', () => {
      this.chapterNext();
    });
    bus.subscribe('chapter.prev', () => {
      this.chapterPrev();
    });
    bus.subscribe('chapterPkg.change', (chapter) => {
      this.chapterPkgChange(chapter);
    });
    bus.subscribe('content.get', () => {
      this.contentGet();
    });
  }
}

export { ContentModel };

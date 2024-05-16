'use strict';

import { queue } from '../CommandQueue.js';
import { kjvPureDb, kjvPureVerseCount, kjvPureWords } from '../data/kjvPureDb.js';

export let tomeDb = null;
export let tomeVerseCount = null;
export let tomeWords = null;

class DbModel {

  constructor() {
    this.initialize();
  }

  initialize() {
    this.subscribe();
  }

  restore() {
    tomeDb = kjvPureDb;
    tomeVerseCount = kjvPureVerseCount;
    tomeWords = kjvPureWords;
  }

  subscribe() {
    queue.subscribe('db.restore', () => {
      this.restore();
    });
  }

}

export { DbModel };

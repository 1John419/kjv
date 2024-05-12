'use strict';

import { queue } from '../CommandQueue.js';
import { kjvPureDb, kjvPureName, kjvPureWords } from '../data/kjvPureDb.js';

export let kjvDb = null;
export let kjvWords = null;
export let kjvName = null;

class DbModel {

  constructor() {
    this.initialize();
  }

  initialize() {
    this.subscribe();
  }

  restore() {
    kjvDb = kjvPureDb;
    kjvWords = kjvPureWords;
    kjvName = kjvPureName;
  }

  subscribe() {
    queue.subscribe('db.restore', () => {
      this.restore();
    });
  }

}

export { DbModel };

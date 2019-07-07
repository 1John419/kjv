'use strict';

import { tome } from './Tome/tome.js';

import {
  idxBook,
  idxChapter,
  idxChapterNum,
  idxFirstVerse,
  idxLastVerse,
  idxLongName
} from '../js/tomeIdx.js';

const numSort = (a, b) => a - b;

// Credit: http://eddmann.com/posts/cartesian-product-in-javascript/
const flatten = (arr) => [].concat.apply([], arr);
const product = (sets) =>
  sets.reduce((acc, set) =>
    flatten(acc.map((x) => set.map((y) => [...x, y]))), [
      []
    ]);

class SearchEngine {

  constructor() {
    this.initialize();
  }

  buildBins() {
    let tomeBin = this.rig.bins;
    tomeBin.occurrences += this.verseCount;
    tomeBin.verses += 1;

    let ref = tome.refs[this.verseIdx];
    let bookIdx = ref[idxBook];
    let chapterIdx = ref[idxChapter];
    let book = tome.books[bookIdx];
    let chapter = tome.chapters[chapterIdx];

    let bookBin = tomeBin.books.find((x) => x.bookIdx === bookIdx);
    if (!bookBin) {
      tomeBin.books.push({
        name: book[idxLongName],
        bookIdx: bookIdx,
        chapterIdx: null,
        start: book[idxFirstVerse],
        end: book[idxLastVerse],
        occurrences: 0,
        verses: 0,
        chapters: []
      });
      bookBin = tomeBin.books[tomeBin.books.length - 1];
    }
    bookBin.occurrences += this.verseCount;
    bookBin.verses += 1;

    let chapterBin = bookBin.chapters.find((x) => x.chapterIdx === chapterIdx);
    if (!chapterBin) {
      bookBin.chapters.push({
        name: `Chapter ${chapter[idxChapterNum]}`,
        bookIdx: null,
        chapterIdx: chapterIdx,
        start: chapter[idxFirstVerse],
        end: chapter[idxLastVerse],
        occurrences: 0,
        verses: 0,
      });
      chapterBin = bookBin.chapters[bookBin.chapters.length - 1];
    }
    chapterBin.occurrences += this.verseCount;
    chapterBin.verses += 1;
  }

  buildRegExp(term, flags) {
    let regexStr = term.replace(/\*/g, '[\\w\']*');
    regexStr = term.endsWith('*') ?
      `\\b(${regexStr})` :
      `\\b(${regexStr})( |$)`;
    return new RegExp(regexStr, flags);
  }

  buildRig(query) {
    this.rig = {};
    this.rig.state = 'ERROR';
    this.rig.query = query;
    if (query === '') {
      this.rig.type = 'EMPTY';
      return;
    }
    this.rig.type = 'INVALID';
    this.rig.flags = query.startsWith('@') ? 'g' : 'gi';
    this.rig.searchTerms = this.rig.query
      .replace('@', '')
      .trim()
      .replace(/ {2,}/g, ' ')
      .replace(/ *,+ */g, ',');
    if (this.rig.searchTerms.match(/[^a-z ,'*-]/i)) {
      return;
    }
    if (/^\*$|^\* | \* | \*$|^\*,|,\*,|,\*$/g.test(this.rig.searchTerms)) {
      return;
    }
    if (/^,|,$/g.test(this.rig.searchTerms)) {
      return;
    }
    if (
      this.rig.searchTerms.includes(' ') &&
      this.rig.searchTerms.includes(',')
    ) {
      return;
    }
    this.rig.terms = this.rig.searchTerms
      .replace(/-/g, '').split(/[ ,]/);
    if (
      this.rig.query.includes(',') ||
      this.rig.terms.length === 1
    ) {
      this.rig.type = 'WORD';
    } else {
      this.rig.type = 'PHRASE';
    }
  }

  buildSearchCombinations() {
    this.rig.combinations = product(this.rig.patterns);
  }

  buildSearchIntersects() {
    let verses = new Set();
    for (let set of this.rig.sets) {
      let intersect = this.intersectAll(set);
      for (let verse of [...intersect]) {
        verses.add(verse);
      }
    }
    this.rig.intersects = [...verses].sort(numSort);
  }

  buildSearchPatterns() {
    this.rig.tomeWords = 'OK';
    this.rig.patterns = [];
    let missingTerms = [];
    for (let term of this.rig.terms) {
      let regExp = this.buildRegExp(term, 'gi');
      let words = this.getTomeWords(regExp);
      if (words.length > 0) {
        this.rig.patterns.push(words);
      } else {
        missingTerms.push(term);
      }
    }
    if (missingTerms.length > 0) {
      this.rig.tomeWords = `'${missingTerms.join(', ')}' not found`;
    }
  }

  buildSearchPhraseVerses() {
    let allVerses = [...this.rig.intersects].sort(numSort);
    for (let idx of allVerses) {
      this.verseIdx = idx;
      let text = tome.verses[idx].replace(/[!();:,.?-]/g, '');
      let regExp = this.buildRegExp(
        this.rig.searchTerms, this.rig.flags
      );
      this.verseCount = (text.match(regExp) || []).length;
      if (this.verseCount > 0) {
        this.rig.verses.push(idx);
        this.buildBins();
      }
    }
  }

  buildSearchSets() {
    this.rig.sets = [];
    for (let combination of this.rig.combinations) {
      let comboSets = [];
      for (let word of combination) {
        comboSets.push(new Set(tome.wordVerses[word]));
      }
      this.rig.sets.push(comboSets);
    }
  }

  buildSearchWordVerses() {
    let allVerses = [...this.rig.intersects].sort(numSort);
    for (let idx of allVerses) {
      this.verseIdx = idx;
      let text = tome.verses[idx].replace(/[!();:,.?-]/g, '');
      this.verseCount = 0;
      this.rig.terms.every((term) => {
        let regExp = this.buildRegExp(term, this.rig.flags);
        let hits = (text.match(regExp) || []).length;
        if (hits === 0) {
          this.verseCount = 0;
          return false;
        } else {
          this.verseCount += hits;
          return true;
        }
      });
      if (this.verseCount > 0) {
        this.rig.verses.push(idx);
        this.buildBins();
      }
    }
  }

  buildSearchVerses() {
    this.rig.occurrences = 0;
    this.rig.verses = [];
    this.initializeBins();
    switch (this.rig.type) {
      case 'PHRASE':
        this.buildSearchPhraseVerses(this.rig);
        break;
      case 'WORD':
        this.buildSearchWordVerses(this.rig);
    }
  }

  findAllMatches(str, regEx) {
    let result;
    let matches = [];
    while ((result = regEx.exec(str)) !== null) {
      matches.push(result[1]);
    }
    return matches.length === 0 ? undefined : matches;
  }

  getTomeWords(regExp) {
    let tomeWords = [];
    let words = this.findAllMatches(tome.wordList, regExp);
    if (words) {
      tomeWords = tomeWords.concat(words);
    }
    return tomeWords;
  }

  initialize() {
    this.subscribe();
  }

  initializeBins() {
    this.rig.bins = {
      name: tome.name,
      bookIdx: null,
      chapterIdx: null,
      start: 0,
      end: tome.verses.length - 1,
      occurrences: 0,
      verses: 0,
      books: []
    };
  }

  intersectAll(...sets) {
    let numOfSets = sets.length;
    if (numOfSets == 0) {
      return undefined;
    }
    if (Array.isArray(sets[0])) {
      sets = [...sets[0]];
      numOfSets = sets.length;
    }
    if (numOfSets < 2) {
      return sets[0];
    }
    let intersect = this.intersection(sets[0], sets[1]);
    if (numOfSets == 2) {
      return intersect;
    }
    for (let i = 2; i < numOfSets; i++) {
      intersect = this.intersection(intersect, sets[i]);
    }
    return intersect;
  }

  intersection(set1, set2) {
    return new Set([...set1].filter((x) => set2.has(x)));
  }

  performSearch(query) {
    this.buildRig(query);
    if (
      this.rig.type === 'EMPTY' ||
      this.rig.type === 'INVALID'
    ) {
      return this.rig;
    }
    this.buildSearchPatterns();
    if (this.rig.tomeWords !== 'OK') {
      return this.rig;
    }
    this.rig.state = 'OK';
    this.buildSearchCombinations();
    this.buildSearchSets();
    this.buildSearchIntersects();
    this.buildSearchVerses();
    return this.rig;
  }

  subscribe() {}

}

export {
  SearchEngine
};

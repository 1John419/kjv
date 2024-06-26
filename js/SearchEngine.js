'use strict';

import { binIdx } from './data/binIdx.js';
import { tomeIdx } from './data/tomeIdx.js';
import { tomeLists } from './data/tomeLists.js';
import { tomeDb, tomeWords } from './Model/DbModel.js';

const numSort = (a, b) => a - b;

// Credit: http://eddmann.com/posts/cartesian-product-in-javascript/
const flatten = (arr) => [].concat.apply([], arr);
const product = (sets) =>
  sets.reduce((acc, set) =>
    flatten(acc.map((x) => set.map((y) => [...x, y]))), [
    []
  ]);

const firstMatch = 1;
const firstSet = 0;
const secondSet = 1;

class SearchEngine {

  constructor() {
    this.initialize();
  }

  buildBins(verseIdx) {
    const tomeBin = this.rig.tomeBin;
    const versesLength = tomeBin[binIdx.tomeBinIdx.verses].length;
    tomeBin[binIdx.tomeBinIdx.wordCount] += this.verseCount;
    tomeBin[binIdx.tomeBinIdx.verseCount] += 1;

    const book = tomeLists.books.find(x => x[tomeIdx.book.lastVerseIdx] >= verseIdx);
    const bookIdx = tomeLists.books.indexOf(book);
    const chapter = tomeLists.chapters.find(x => x[tomeIdx.chapter.lastVerseIdx] >= verseIdx);
    const chapterIdx = tomeLists.chapters.indexOf(chapter);

    let bookBin = tomeBin[binIdx.tomeBinIdx.books].find(x => x[binIdx.bookBinIdx.bookIdx] === bookIdx);
    if (!bookBin) {
      const wordCount = 0;
      const verseCount = 0;
      const sliceStart = versesLength - 1;
      const sliceEnd = sliceStart;
      const chapters = [];
      tomeBin[binIdx.tomeBinIdx.books].push([
        bookIdx,
        wordCount,
        verseCount,
        sliceStart,
        sliceEnd,
        chapters,
      ]);
      bookBin = tomeBin[binIdx.tomeBinIdx.books][tomeBin[binIdx.tomeBinIdx.books].length - 1];
    }
    bookBin[binIdx.bookBinIdx.wordCount] += this.verseCount;
    bookBin[binIdx.bookBinIdx.verseCount] += 1;
    bookBin[binIdx.bookBinIdx.sliceEnd] += 1;

    let chapterBin = bookBin[binIdx.bookBinIdx.chapters].find((x) => x[binIdx.chapterBinIdx.chapterIdx] === chapterIdx);
    if (!chapterBin) {
      const wordCount = 0;
      const verseCount = 0;
      const sliceStart = versesLength - 1;
      const sliceEnd = sliceStart;
      bookBin[binIdx.bookBinIdx.chapters].push([
        chapterIdx,
        wordCount,
        verseCount,
        sliceStart,
        sliceEnd,
      ]);
      chapterBin = bookBin[binIdx.bookBinIdx.chapters][bookBin[binIdx.bookBinIdx.chapters].length - 1];
    }
    chapterBin[binIdx.chapterBinIdx.wordCount] += this.verseCount;
    chapterBin[binIdx.chapterBinIdx.verseCount] += 1;
    chapterBin[binIdx.chapterBinIdx.sliceEnd] += 1;
  }

  buildCombinations() {
    this.combinations = product(this.patterns);
  }

  buildIntersects() {
    const verses = new Set();
    for (const set of this.sets) {
      const intersect = this.intersectAll(set);
      for (const verse of [...intersect]) {
        verses.add(verse);
      }
    }
    this.intersects = [...verses].sort(numSort);
  }

  buildPatterns() {
    this.rig.wordStatus = 'OK';
    this.patterns = [];
    const missingTerms = [];
    for (const term of this.terms) {
      const re = new RegExp(`^${term.replace(/\*/g, '.*')}$`, this.testFlags);
      const words = tomeWords.filter(x => re.test(x));
      if (words.length > 0) {
        this.patterns.push(words);
      } else {
        missingTerms.push(term);
      }
    }
    if (missingTerms.length > 0) {
      this.rig.wordStatus = `'${missingTerms.join(', ')}' not found`;
    }
  }

  async buildPhraseVerses() {
    const allVerses = [...this.intersects].sort(numSort);
    const verseObjs = await tomeDb.verses.bulkGet(allVerses);
    for (const verseObj of verseObjs) {
      this.verseIdx = verseObj.k;
      const re = this.buildRegExp(this.searchTerms, this.flags);
      const text = verseObj.v[tomeIdx.verse.text].replace(/[!();:,.?-]/g, '');
      this.verseCount = (text.match(re) || []).length;
      if (this.verseCount > 0) {
        this.rig.tomeBin[binIdx.tomeBinIdx.verses].push(this.verseIdx);
        this.buildBins(this.verseIdx);
      }
    }
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
    } else {
      this.rig.type = 'INVALID';
      this.flags = query.startsWith('@') ? 'g' : 'gi';
      this.testFlags = query.startsWith('@') ? '' : 'i';
      this.searchTerms = this.rig.query
        .replace('@', '')
        .trim()
        .replace(/ {2,}/g, ' ')
        .replace(/ *,+ */g, ',');
      if (
        !this.searchTerms.match(/[^\p{L} ,'*-]/ui) &&
        !(/^\*$|^\* | \* | \*$|^\*,|,\*,|,\*$/g.test(this.searchTerms)) &&
        !(/^,|,$/g.test(this.searchTerms)) &&
        !(
          this.searchTerms.includes(' ') &&
          this.searchTerms.includes(',')
        )
      ) {
        this.terms = this.searchTerms
          .replace(/-/g, '').split(/[ ,]/);
        if (
          this.rig.query.includes(',') ||
          this.terms.length === 1
        ) {
          this.rig.type = 'WORD';
        } else {
          this.rig.type = 'PHRASE';
        }
      }
    }
  }

  async buildSets() {
    this.sets = [];

    const unique = [...new Set([].concat.apply([], this.combinations))].sort();
    this.wordObjs = await tomeDb.words.bulkGet(unique);

    const words = {};
    this.wordObjs.map(obj => words[obj.k] = obj.v);

    for (const combination of this.combinations) {
      const comboSets = [];
      for (const word of combination) {
        const verseKeys = words[word].map(x => x[tomeIdx.word.verseIdx]);
        comboSets.push(new Set(verseKeys));
      }
      this.sets.push(comboSets);
    }
  }

  buildWords() {
    const allVerses = [...this.intersects];
    for (const verseIdx of allVerses) {
      this.verseIdx = verseIdx;
      this.getVerseCount(verseIdx);
      if (this.verseCount > 0) {
        this.rig.tomeBin[binIdx.tomeBinIdx.verses].push(this.verseIdx);
        this.buildBins(this.verseIdx);
      }
    }
  }

  async buildVerses() {
    if (this.rig.type === 'PHRASE') {
      await this.buildPhraseVerses(this.rig);
    } else if (this.rig.type === 'WORD') {
      await this.buildWords(this.rig);
    }
  }

  getVerseCount(verseIdx) {
    this.verseCount = 0;
    for (const wordVerseObj of this.wordObjs) {
      const verseCount = wordVerseObj.v.find(x => x[tomeIdx.word.verseIdx] === verseIdx);
      if (verseCount) {
        this.verseCount += verseCount[tomeIdx.word.count];
      }
    }
  }

  initialize() {
    return;
  }

  initializeTomeBin() {
    const wordCount = 0;
    const verseCount = 0;
    const books = [];
    const verses = [];
    this.rig.tomeBin = [
      wordCount,
      verseCount,
      books,
      verses,
    ];
  }

  intersectAll(...sets) {
    let intersect = null;
    let numOfSets = sets.length;
    if (numOfSets > 0) {
      if (Array.isArray(sets[firstSet])) {
        sets = [...sets[firstSet]];
        numOfSets = sets.length;
      }
      if (numOfSets < 2) {
        intersect = sets[firstSet];
      } else {
        intersect = this.intersection(sets[firstSet], sets[secondSet]);
        if (numOfSets > 2) {
          for (let i = 2; i < numOfSets; i++) {
            intersect = this.intersection(intersect, sets[i]);
          }
        }
      }
    }
    return intersect;
  }

  intersection(set1, set2) {
    return new Set([...set1].filter((x) => set2.has(x)));
  }

  async performSearch(query) {
    this.buildRig(query);
    this.initializeTomeBin();
    if (this.rig.type === 'WORD' || this.rig.type === 'PHRASE') {
      this.buildPatterns();
      if (this.rig.wordStatus === 'OK') {
        this.rig.state = 'OK';
        this.buildCombinations();
        await this.buildSets();
        this.buildIntersects();
        await this.buildVerses();
      }
    }
    return this.rig;
  }
}

export { SearchEngine };

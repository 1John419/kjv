'use strict';

/*global QUnit*/

// Steps to run tests:
//   Start http-server in VSCode (kill any existing instance)
//   Do not use VSCode debugger
//   Open Chromium @ http://192.168.4.100:8820/seTest/

import { TestSearchEngine } from '/seTest/TestSearchEngine.js';
import { initializeKjvLists } from '/js/data/kjvLists.js';
import { initializeKjvPureDb } from '/js/data/kjvPureDb.js';

const idxWordCount = 0;
const idxVerseCount = 1;

(async function () {
  await initializeKjvLists();
  await initializeKjvPureDb();
  const eng = new TestSearchEngine();

  // Assert values verified with King James Pure Bible Search
  // http://purebiblesearch.com/

  QUnit.module('Input Errors');

  QUnit.test('Empty Expression', async (assert) => {
    const rig = await eng.performSearch('');
    assert.equal(rig.type, 'EMPTY');
  });
  QUnit.test('Both Word and Phrase Expression', async (assert) => {
    const rig = await eng.performSearch('god,son of man');
    assert.equal(rig.type, 'INVALID');
  });
  QUnit.test('Illegal Character in Expression', async (assert) => {
    const rig = await eng.performSearch('god+man');
    assert.equal(rig.type, 'INVALID');
  });
  QUnit.test('Invalid Wildcard in Expression', async (assert) => {
    const rig = await eng.performSearch('*');
    assert.equal(rig.type, 'INVALID');
  });
  QUnit.test('Invalid Wildcard in Expression', async (assert) => {
    const rig = await eng.performSearch('* god');
    assert.equal(rig.type, 'INVALID');
  });
  QUnit.test('Invalid Wildcard in Expression', async (assert) => {
    const rig = await eng.performSearch('god * man');
    assert.equal(rig.type, 'INVALID');
  });
  QUnit.test('Invalid Wildcard in Expression', async (assert) => {
    const rig = await eng.performSearch('god *');
    assert.equal(rig.type, 'INVALID');
  });
  QUnit.test('Invalid Wildcard in Expression', async (assert) => {
    const rig = await eng.performSearch('*,god');
    assert.equal(rig.type, 'INVALID');
  });
  QUnit.test('Invalid Wildcard in Expression', async (assert) => {
    const rig = await eng.performSearch('god, *, man');
    assert.equal(rig.type, 'INVALID');
  });
  QUnit.test('Invalid Wildcard in Expression', async (assert) => {
    const rig = await eng.performSearch('god, *');
    assert.equal(rig.type, 'INVALID');
  });
  QUnit.test('Invalid Comma in Expression', async (assert) => {
    const rig = await eng.performSearch('god,');
    assert.equal(rig.type, 'INVALID');
  });
  QUnit.test('Invalid Comma in Expression', async (assert) => {
    const rig = await eng.performSearch(',god');
    assert.equal(rig.type, 'INVALID');
  });

  QUnit.module('Word Search Expressions');

  QUnit.test('abed*', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 15);
    assert.equal(rig.kjvBin[idxVerseCount], 14);
  });
  QUnit.test('@abed*', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 0);
    assert.equal(rig.kjvBin[idxVerseCount], 0);
  });
  QUnit.test('abedn*', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 15);
    assert.equal(rig.kjvBin[idxVerseCount], 14);
  });
  QUnit.test('accept*', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 87);
    assert.equal(rig.kjvBin[idxVerseCount], 86);
  });
  QUnit.test('@Accept', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 1);
    assert.equal(rig.kjvBin[idxVerseCount], 1);
  });
  QUnit.test('@Accept*', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 1);
    assert.equal(rig.kjvBin[idxVerseCount], 1);
  });
  QUnit.test('aha*', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 221);
    assert.equal(rig.kjvBin[idxVerseCount], 188);
  });
  QUnit.test('@aha*', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 3);
    assert.equal(rig.kjvBin[idxVerseCount], 3);
  });
  QUnit.test('angel', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 201);
    assert.equal(rig.kjvBin[idxVerseCount], 192);
  });
  QUnit.test('angel*', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 297);
    assert.equal(rig.kjvBin[idxVerseCount], 283);
  });
  QUnit.test('@Angel*', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 4);
    assert.equal(rig.kjvBin[idxVerseCount], 4);
  });
  QUnit.test("apostles'", async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 5);
    assert.equal(rig.kjvBin[idxVerseCount], 5);
  });
  QUnit.test('as*', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 4938);
    assert.equal(rig.kjvBin[idxVerseCount], 4085);
  });
  QUnit.test('@as*', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 4213);
    assert.equal(rig.kjvBin[idxVerseCount], 3490);
  });
  QUnit.test('@As*', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 725);
    assert.equal(rig.kjvBin[idxVerseCount], 684);
  });
  QUnit.test('be*', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 16269);
    assert.equal(rig.kjvBin[idxVerseCount], 11740);
  });
  QUnit.test('bethel', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 66);
    assert.equal(rig.kjvBin[idxVerseCount], 59);
  });
  QUnit.test('christ', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 555);
    assert.equal(rig.kjvBin[idxVerseCount], 522);
  });
  QUnit.test('christ*', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 576);
    assert.equal(rig.kjvBin[idxVerseCount], 537);
  });
  QUnit.test('*circum*', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 148);
    assert.equal(rig.kjvBin[idxVerseCount], 109);
  });
  QUnit.test('err*d', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 15);
    assert.equal(rig.kjvBin[idxVerseCount], 14);
  });
  QUnit.test('ex*d', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 147);
    assert.equal(rig.kjvBin[idxVerseCount], 143);
  });
  QUnit.test('fou*n', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 113);
    assert.equal(rig.kjvBin[idxVerseCount], 107);
  });
  QUnit.test('jehovah*', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 7);
    assert.equal(rig.kjvBin[idxVerseCount], 7);
  });
  QUnit.test('@JEHOVAH*', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 4);
    assert.equal(rig.kjvBin[idxVerseCount], 4);
  });
  QUnit.test("kings'", async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 5);
    assert.equal(rig.kjvBin[idxVerseCount], 5);
  });
  QUnit.test("@Kings'", async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 1);
    assert.equal(rig.kjvBin[idxVerseCount], 1);
  });
  QUnit.test('lamb*', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 188);
    assert.equal(rig.kjvBin[idxVerseCount], 175);
  });
  QUnit.test('@lamb*', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 158);
    assert.equal(rig.kjvBin[idxVerseCount], 147);
  });
  QUnit.test('@Lamb*', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 30);
    assert.equal(rig.kjvBin[idxVerseCount], 28);
  });
  QUnit.test('lord', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 7830);
    assert.equal(rig.kjvBin[idxVerseCount], 6667);
  });
  QUnit.test('lord*', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 8009);
    assert.equal(rig.kjvBin[idxVerseCount], 6781);
  });
  QUnit.test('@lord', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 234);
    assert.equal(rig.kjvBin[idxVerseCount], 207);
  });
  QUnit.test('@lord*', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 289);
    assert.equal(rig.kjvBin[idxVerseCount], 256);
  });
  QUnit.test('@Lord', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 1130);
    assert.equal(rig.kjvBin[idxVerseCount], 1067);
  });
  QUnit.test('@Lord*', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 1145);
    assert.equal(rig.kjvBin[idxVerseCount], 1079);
  });
  QUnit.test('@LORD*', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 6575);
    assert.equal(rig.kjvBin[idxVerseCount], 5554);
  });
  QUnit.test('lordly', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 1);
    assert.equal(rig.kjvBin[idxVerseCount], 1);
  });
  QUnit.test('love*', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 521);
    assert.equal(rig.kjvBin[idxVerseCount], 442);
  });
  QUnit.test('mal*s', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 41);
    assert.equal(rig.kjvBin[idxVerseCount], 41);
  });
  QUnit.test('net*ite*', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 10);
    assert.equal(rig.kjvBin[idxVerseCount], 9);
  });
  QUnit.test('sojourn*', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 74);
    assert.equal(rig.kjvBin[idxVerseCount], 72);
  });

  QUnit.module('Multiple-Word Search Expressions');

  QUnit.test('fall,living,god', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 3);
    assert.equal(rig.kjvBin[idxVerseCount], 1);
  });
  QUnit.test('forgive,sin', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 25);
    assert.equal(rig.kjvBin[idxVerseCount], 12);
  });
  QUnit.test('forgive*,sin*', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 117);
    assert.equal(rig.kjvBin[idxVerseCount], 54);
  });
  QUnit.test('generation*,jacob', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 6);
    assert.equal(rig.kjvBin[idxVerseCount], 3);
  });
  QUnit.test('@God,scripture', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 14);
    assert.equal(rig.kjvBin[idxVerseCount], 6);
  });
  QUnit.test('@God,scripture*', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 20);
    assert.equal(rig.kjvBin[idxVerseCount], 9);
  });
  QUnit.test('good,fight', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 8);
    assert.equal(rig.kjvBin[idxVerseCount], 3);
  });
  QUnit.test('@LORD,spoken', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 245);
    assert.equal(rig.kjvBin[idxVerseCount], 105);
  });
  QUnit.test('shepherd,sheep', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 39);
    assert.equal(rig.kjvBin[idxVerseCount], 17);
  });
  QUnit.test('@Spirit,glory', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 12);
    assert.equal(rig.kjvBin[idxVerseCount], 5);
  });
  QUnit.test('thought*,way*', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 16);
    assert.equal(rig.kjvBin[idxVerseCount], 6);
  });
  QUnit.test('thoughts,ways', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 8);
    assert.equal(rig.kjvBin[idxVerseCount], 2);
  });

  QUnit.module('Phrase Search Expressions');

  QUnit.test('be scattered', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 13);
    assert.equal(rig.kjvBin[idxVerseCount], 13);
  });
  QUnit.test('day of the lord', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 25);
    assert.equal(rig.kjvBin[idxVerseCount], 23);
  });
  QUnit.test('@day of the LORD', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 19);
    assert.equal(rig.kjvBin[idxVerseCount], 17);
  });
  QUnit.test('@day of the LORD*', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 25);
    assert.equal(rig.kjvBin[idxVerseCount], 23);
  });
  QUnit.test('@day of the Lord', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 6);
    assert.equal(rig.kjvBin[idxVerseCount], 6);
  });
  QUnit.test('day of the lord*', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 31);
    assert.equal(rig.kjvBin[idxVerseCount], 29);
  });
  QUnit.test('days of your fathers', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 2);
    assert.equal(rig.kjvBin[idxVerseCount], 2);
  });
  // Exodus 32:32
  QUnit.test('forgive their sin', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 2);
    assert.equal(rig.kjvBin[idxVerseCount], 2);
  });
  QUnit.test('good fight', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 2);
    assert.equal(rig.kjvBin[idxVerseCount], 2);
  });
  QUnit.test('in christ', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 77);
    assert.equal(rig.kjvBin[idxVerseCount], 76);
  });
  QUnit.test('lord god almighty', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 5);
    assert.equal(rig.kjvBin[idxVerseCount], 5);
  });
  QUnit.test('my thought', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 1);
    assert.equal(rig.kjvBin[idxVerseCount], 1);
  });
  QUnit.test('my thoughts', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 5);
    assert.equal(rig.kjvBin[idxVerseCount], 5);
  });
  QUnit.test('my thought*', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 6);
    assert.equal(rig.kjvBin[idxVerseCount], 6);
  });
  QUnit.test('my way', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 11);
    assert.equal(rig.kjvBin[idxVerseCount], 11);
  });
  QUnit.test('my ways', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 24);
    assert.equal(rig.kjvBin[idxVerseCount], 24);
  });
  QUnit.test('my way*', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 35);
    assert.equal(rig.kjvBin[idxVerseCount], 35);
  });
  // PBS reports 51/49, but 7 span adjacent verses
  QUnit.test('the lord he', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 44);
    assert.equal(rig.kjvBin[idxVerseCount], 42);
  });
  QUnit.test('world itself', async (assert) => {
    const rig = await eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.kjvBin[idxWordCount], 1);
    assert.equal(rig.kjvBin[idxVerseCount], 1);
  });
})();

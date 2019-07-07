'use strict';

/*global QUnit*/

import { SearchEngine } from '/js/SearchEngine.js';

(function () {
  let eng = new SearchEngine();
  // Assert values verified with King James Pure Bible Search
  // http://purebiblesearch.com/

  QUnit.module('Input Errors');

  QUnit.test('Empty Expression', function (assert) {
    let rig = eng.performSearch('');
    assert.equal(rig.type, 'EMPTY');
  });
  QUnit.test('Both Word and Phrase Expression', function (assert) {
    let rig = eng.performSearch('god,son of man');
    assert.equal(rig.type, 'INVALID');
  });
  QUnit.test('Illegal Character in Expression', function (assert) {
    let rig = eng.performSearch('god+man');
    assert.equal(rig.type, 'INVALID');
  });
  QUnit.test('Invalid Wildcard in Expression', function (assert) {
    let rig = eng.performSearch('*');
    assert.equal(rig.type, 'INVALID');
  });
  QUnit.test('Invalid Wildcard in Expression', function (assert) {
    let rig = eng.performSearch('* god');
    assert.equal(rig.type, 'INVALID');
  });
  QUnit.test('Invalid Wildcard in Expression', function (assert) {
    let rig = eng.performSearch('god * man');
    assert.equal(rig.type, 'INVALID');
  });
  QUnit.test('Invalid Wildcard in Expression', function (assert) {
    let rig = eng.performSearch('god *');
    assert.equal(rig.type, 'INVALID');
  });
  QUnit.test('Invalid Wildcard in Expression', function (assert) {
    let rig = eng.performSearch('*,god');
    assert.equal(rig.type, 'INVALID');
  });
  QUnit.test('Invalid Wildcard in Expression', function (assert) {
    let rig = eng.performSearch('god, *, man');
    assert.equal(rig.type, 'INVALID');
  });
  QUnit.test('Invalid Wildcard in Expression', function (assert) {
    let rig = eng.performSearch('god, *');
    assert.equal(rig.type, 'INVALID');
  });
  QUnit.test('Invalid Comma in Expression', function (assert) {
    let rig = eng.performSearch('god,');
    assert.equal(rig.type, 'INVALID');
  });
  QUnit.test('Invalid Comma in Expression', function (assert) {
    let rig = eng.performSearch(',god');
    assert.equal(rig.type, 'INVALID');
  });

  QUnit.module('Word Search Expressions');

  QUnit.test('abed*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 15);
    assert.equal(rig.bins.verses, 14);
  });
  QUnit.test('@abed*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 0);
    assert.equal(rig.bins.verses, 0);
  });
  QUnit.test('abedn*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 15);
    assert.equal(rig.bins.verses, 14);
  });
  QUnit.test('accept*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 87);
    assert.equal(rig.bins.verses, 86);
  });
  QUnit.test('@Accept', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 1);
    assert.equal(rig.bins.verses, 1);
  });
  QUnit.test('@Accept*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 1);
    assert.equal(rig.bins.verses, 1);
  });
  QUnit.test('aha*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 221);
    assert.equal(rig.bins.verses, 188);
  });
  QUnit.test('@aha*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 3);
    assert.equal(rig.bins.verses, 3);
  });
  QUnit.test('angel', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 201);
    assert.equal(rig.bins.verses, 192);
  });
  QUnit.test('angel*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 297);
    assert.equal(rig.bins.verses, 283);
  });
  QUnit.test('@Angel*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 4);
    assert.equal(rig.bins.verses, 4);
  });
  QUnit.test("apostles'", function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 5);
    assert.equal(rig.bins.verses, 5);
  });
  QUnit.test('as*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 4938);
    assert.equal(rig.bins.verses, 4085);
  });
  QUnit.test('@as*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 4213);
    assert.equal(rig.bins.verses, 3490);
  });
  QUnit.test('@As*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 725);
    assert.equal(rig.bins.verses, 684);
  });
  QUnit.test('be*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 16269);
    assert.equal(rig.bins.verses, 11740);
  });
  QUnit.test('bethel', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 66);
    assert.equal(rig.bins.verses, 59);
  });
  QUnit.test('christ', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 555);
    assert.equal(rig.bins.verses, 522);
  });
  QUnit.test('christ*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 576);
    assert.equal(rig.bins.verses, 537);
  });
  QUnit.test('*circum*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 148);
    assert.equal(rig.bins.verses, 109);
  });
  QUnit.test('err*d', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 15);
    assert.equal(rig.bins.verses, 14);
  });
  QUnit.test('ex*d', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 147);
    assert.equal(rig.bins.verses, 143);
  });
  QUnit.test('fou*n', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 113);
    assert.equal(rig.bins.verses, 107);
  });
  QUnit.test('jehovah*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 7);
    assert.equal(rig.bins.verses, 7);
  });
  QUnit.test('@JEHOVAH*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 4);
    assert.equal(rig.bins.verses, 4);
  });
  QUnit.test("kings'", function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 5);
    assert.equal(rig.bins.verses, 5);
  });
  QUnit.test("@Kings'", function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 1);
    assert.equal(rig.bins.verses, 1);
  });
  QUnit.test('lamb*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 188);
    assert.equal(rig.bins.verses, 175);
  });
  QUnit.test('@lamb*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 158);
    assert.equal(rig.bins.verses, 147);
  });
  QUnit.test('@Lamb*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 30);
    assert.equal(rig.bins.verses, 28);
  });
  QUnit.test('lord', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 7830);
    assert.equal(rig.bins.verses, 6667);
  });
  QUnit.test('lord*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 8009);
    assert.equal(rig.bins.verses, 6781);
  });
  QUnit.test('@lord', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 234);
    assert.equal(rig.bins.verses, 207);
  });
  QUnit.test('@lord*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 289);
    assert.equal(rig.bins.verses, 256);
  });
  QUnit.test('@Lord', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 1130);
    assert.equal(rig.bins.verses, 1067);
  });
  QUnit.test('@Lord*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 1145);
    assert.equal(rig.bins.verses, 1079);
  });
  QUnit.test('@LORD*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 6575);
    assert.equal(rig.bins.verses, 5554);
  });
  QUnit.test('lordly', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 1);
    assert.equal(rig.bins.verses, 1);
  });
  QUnit.test('love*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 521);
    assert.equal(rig.bins.verses, 442);
  });
  QUnit.test('mal*s', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 41);
    assert.equal(rig.bins.verses, 41);
  });
  QUnit.test('net*ite*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 10);
    assert.equal(rig.bins.verses, 9);
  });
  QUnit.test('sojourn*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 74);
    assert.equal(rig.bins.verses, 72);
  });

  QUnit.module('Multiple-Word Search Expressions');

  QUnit.test('fall,living,god', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 3);
    assert.equal(rig.bins.verses, 1);
  });
  QUnit.test('forgive,sin', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 25);
    assert.equal(rig.bins.verses, 12);
  });
  QUnit.test('forgive*,sin*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 117);
    assert.equal(rig.bins.verses, 54);
  });
  QUnit.test('generation*,jacob', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 6);
    assert.equal(rig.bins.verses, 3);
  });
  QUnit.test('@God,scripture', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 14);
    assert.equal(rig.bins.verses, 6);
  });
  QUnit.test('good,fight', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 8);
    assert.equal(rig.bins.verses, 3);
  });
  QUnit.test('@LORD,spoken', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 245);
    assert.equal(rig.bins.verses, 105);
  });
  QUnit.test('shepherd,sheep', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 39);
    assert.equal(rig.bins.verses, 17);
  });
  QUnit.test('@Spirit,glory', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 12);
    assert.equal(rig.bins.verses, 5);
  });
  QUnit.test('thought*,way*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 16);
    assert.equal(rig.bins.verses, 6);
  });
  QUnit.test('thoughts,ways', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 8);
    assert.equal(rig.bins.verses, 2);
  });

  QUnit.module('Phrase Search Expressions');

  QUnit.test('be scattered', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 13);
    assert.equal(rig.bins.verses, 13);
  });
  QUnit.test('day of the lord', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 25);
    assert.equal(rig.bins.verses, 23);
  });
  QUnit.test('day of the lord*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 31);
    assert.equal(rig.bins.verses, 29);
  });
  QUnit.test('days of your fathers', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 2);
    assert.equal(rig.bins.verses, 2);
  });
  // Exodus 32:32
  QUnit.test('forgive their sin', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 2);
    assert.equal(rig.bins.verses, 2);
  });
  QUnit.test('good fight', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 2);
    assert.equal(rig.bins.verses, 2);
  });
  QUnit.test('in christ', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 77);
    assert.equal(rig.bins.verses, 76);
  });
  QUnit.test('lord god almighty', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 5);
    assert.equal(rig.bins.verses, 5);
  });
  QUnit.test('my thought', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 1);
    assert.equal(rig.bins.verses, 1);
  });
  QUnit.test('my thoughts', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 5);
    assert.equal(rig.bins.verses, 5);
  });
  QUnit.test('my thought*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 6);
    assert.equal(rig.bins.verses, 6);
  });
  QUnit.test('my way', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 11);
    assert.equal(rig.bins.verses, 11);
  });
  QUnit.test('my ways', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 24);
    assert.equal(rig.bins.verses, 24);
  });
  QUnit.test('my way*', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 35);
    assert.equal(rig.bins.verses, 35);
  });
  // PBS reports 51/49, but 7 span adjacent verses
  QUnit.test('the lord he', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 44);
    assert.equal(rig.bins.verses, 42);
  });
  QUnit.test('world itself', function (assert) {
    let rig = eng.performSearch(QUnit.config.current.testName);
    assert.equal(rig.bins.occurrences, 1);
    assert.equal(rig.bins.verses, 1);
  });
})();

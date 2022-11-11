'use strict';

import Dexie from '../lib/dexie.min.mjs';
import { progress } from '../load.js';

export const tomeName = 'kjv';

const tomeStores = {
  lists: 'k',
  verses: 'k',
  words: 'k'
};

const dbVersion = () => {
  let defaultVersion = '1970-01-01';
  let version = localStorage.getItem('dbVersion');
  if (!version) {
    version = defaultVersion;
  } else {
    try {
      version = JSON.parse(version);
    } catch (error) {
      version = defaultVersion;
    }
    if (typeof version !== 'string') {
      version = defaultVersion;
    }
  }
  localStorage.setItem('dbVersion',
    JSON.stringify(version));

  return version;
};

export const fetchJson = async (url) => {
  progress('fetching...');
  let response = await fetch(url);
  progress('parsing...');
  let data = await response.json();

  return data;
};

export const versionCheck = async (version) => {
  let currentVersion = dbVersion();

  let db = new Dexie(tomeName);
  await db.version(1).stores(tomeStores);
  db.open();

  if (version !== currentVersion) {
    progress('new version.');
    for (let store of Object.keys(tomeStores)) {
      progress(`clearing ${store}...`);
      await db.table(store).clear();
    }
    localStorage.setItem('dbVersion',
      JSON.stringify(version));
  }

  return db;
};

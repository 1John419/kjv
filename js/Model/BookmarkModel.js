'use strict';

import { bus } from '../EventBus.js';

import { tome } from '../Tome/tome.js';

const numSortAscend = (a, b) => a - b;
const numSortDescend = (a, b) => b - a;

class BookmarkModel {

  constructor() {
    this.initialize();
  }

  bookmarkAdd(verseIdx) {
    let bookmarks = this.folder.bookmarks;
    if (bookmarks.indexOf(verseIdx) === -1) {
      this.folder.bookmarks = [verseIdx, ...bookmarks];
      this.updateFolder();
    }
  }

  bookmarkCopy(copyPkg) {
    let toFolder = this.getFolder(copyPkg.to);
    toFolder.bookmarks = [copyPkg.verseIdx, ...toFolder.bookmarks];
    this.updateFolder();
  }

  bookmarkDelete(verseIdx) {
    let bookmarks = this.folder.bookmarks;
    let index = bookmarks.indexOf(verseIdx);
    if (index !== -1) {
      bookmarks.splice(index, 1);
      this.updateFolder();
    }
  }

  bookmarkDown(verseIdx) {
    let bookmarks = this.folder.bookmarks;
    let index = bookmarks.indexOf(verseIdx);
    if (index !== bookmarks.length - 1 && index !== -1) {
      this.reorderBookmarks(index, index + 1);
    }
  }

  bookmarkGet() {
    this.getFolders();
    this.getActiveFolder();
  }

  bookmarkMove(movePkg) {
    let toFolder = this.getFolder(movePkg.to);
    toFolder.bookmarks = [movePkg.verseIdx, ...toFolder.bookmarks];

    let bookmarks = this.folder.bookmarks;
    let index = bookmarks.indexOf(movePkg.verseIdx);
    if (index !== -1) {
      bookmarks.splice(index, 1);
      this.updateFolder();
    }
  }

  bookmarkSort(sorter) {
    let bookmarks = this.folder.bookmarks;
    if (bookmarks.length !== 0) {
      bookmarks.sort(sorter);
      this.updateFolder();
    }
  }

  bookmarkSortInvert() {
    let bookmarks = this.folder.bookmarks;
    bookmarks.reverse();
    this.updateFolder();
  }

  bookmarkUp(verseIdx) {
    let bookmarks = this.folder.bookmarks;
    let index = bookmarks.indexOf(verseIdx);
    if (index === 0 || index === -1) {
      return;
    }
    this.reorderBookmarks(index, index - 1);
  }

  changeActiveFolder(folderName) {
    this.folder = this.getFolder(folderName);
    this.activeFolder = folderName;
    this.saveActiveFolder();
    this.updateFolder();
  }

  createFolder(folderName) {
    return {
      name: folderName,
      bookmarks: []
    };
  }

  createFolders() {
    return [this.createFolder('Default')];
  }

  folderAdd(folderName) {
    let newFolder = this.getFolder(folderName);
    if (newFolder) {
      return;
    }
    newFolder = this.createFolder(folderName);
    this.folders = [newFolder, ...this.folders];
    this.folder = this.folders[0];
    this.activeFolder = folderName;
    this.saveActiveFolder();
    this.updateFolder();
  }

  folderChange(folderName) {
    this.folder = this.getFolder(folderName);
    this.activeFolder = folderName;
    this.updateFolder();
  }

  folderDelete(folderName) {
    let idx = this.getFolderIdx(folderName);
    this.folders.splice(idx, 1);
    bus.publish('folder.list.update', this.getFolderList());
    this.resetFolder();
  }

  folderDown(folderName) {
    let index = this.folders.findIndex((folder) => folder.name === folderName);
    if (index !== this.folders.length - 1 && index !== -1) {
      this.reorderFolders(index, index + 1);
      bus.publish('folder.list.update', this.getFolderList());
    }
  }

  folderImport(pkgStr) {
    let bookmarkPkg = this.getBookmarkPkg(pkgStr);
    if (!bookmarkPkg) {
      bus.publish('import.message', 'Invalid JSON string');
      return;
    }
    let status = this.validatePkg(bookmarkPkg);
    if (status === 'OK') {
      status = this.validateFolders(bookmarkPkg.folders);
    }
    if (status !== 'OK') {
      bus.publish('import.message', status);
      return;
    }
    this.importPkg(bookmarkPkg);
  }

  folderRename(namePkg) {
    let oldFolder = this.getFolder(namePkg.old);
    oldFolder.name = namePkg.new;
    this.activeFolder = namePkg.new;
    this.saveActiveFolder();
    this.updateFolder();
  }

  folderUp(folderName) {
    let index = this.folders.findIndex((folder) => folder.name === folderName);
    if (index !== 0 && index !== -1) {
      this.reorderFolders(index, index - 1);
      bus.publish('folder.list.update', this.getFolderList());
    }
  }

  getActiveFolder() {
    let activeFolder = localStorage.getItem('activeFolder');
    if (!activeFolder) {
      activeFolder = 'Default';
    } else {
      activeFolder = JSON.parse(activeFolder);
    }
    this.changeActiveFolder(activeFolder);
  }

  getBookmarkPkg(pkgStr) {
    let bookmarkPkg;
    try {
      bookmarkPkg = JSON.parse(pkgStr);
    } catch (error) {
      bookmarkPkg = null;
    }
    return bookmarkPkg;
  }

  getFolder(folderName) {
    return this.folders.find((folder) => {
      return folder.name === folderName;
    });
  }

  getFolderIdx(folderName) {
    return this.folders.findIndex((folder) => {
      return folder.name === folderName;
    });
  }

  getFolders() {
    let folders = localStorage.getItem('folders');
    if (!folders) {
      folders = this.createFolders();
    } else {
      folders = JSON.parse(folders);
    }
    this.folders = folders;
  }

  getFolderList() {
    return this.folders.map((folder) => folder.name);
  }

  importPkg(bookmarkPkg) {
    for (let folder of bookmarkPkg.folders) {
      let targetFolder = this.getFolder(folder.name);
      if (!targetFolder) {
        targetFolder = this.createFolder(folder.name);
        this.folders = [targetFolder, ...this.folders];
      }
      for (let verseIdx of folder.bookmarks) {
        let bookmarks = targetFolder.bookmarks;
        if (bookmarks.indexOf(verseIdx) !== -1) {
          continue;
        }
        targetFolder.bookmarks = [verseIdx, ...bookmarks];
      }
    }
    this.updateFolder();
    bus.publish('import.message', 'Import successful.');
  }

  initialize() {
    this.subscribe();
  }

  moveCopyListChange(verseIdx) {
    let foldersNotFoundIn = this.folders.filter(
      (folder) => !folder.bookmarks.some((element) => element === verseIdx)
    );
    let moveCopyList = foldersNotFoundIn.map((folder) => folder.name);
    bus.publish('move-copy.list.update', moveCopyList);
  }

  reorderBookmarks(fromIdx, toIdx) {
    let bookmarks = this.folder.bookmarks;
    bookmarks.splice(
      toIdx, 0, bookmarks.splice(fromIdx, 1)[0]
    );
    this.updateFolder();
  }

  reorderFolders(fromIdx, toIdx) {
    this.folders.splice(
      toIdx, 0, this.folders.splice(fromIdx, 1)[0]
    );
    this.updateFolder();
    this.updateFolderList();
  }

  resetFolder() {
    if (this.folders.length === 0) {
      this.folderAdd('Default');
    }
    let firstFolder = this.folders[0].name;
    this.folderChange(firstFolder);
  }

  saveActiveFolder() {
    localStorage.setItem('activeFolder', JSON.stringify(this.activeFolder));
  }

  saveFolders() {
    localStorage.setItem('folders', JSON.stringify(this.folders));
    bus.publish('folders.update', this.folders);
  }

  subscribe() {
    bus.subscribe('bookmark.add', (verseIdx) => {
      this.bookmarkAdd(verseIdx);
    });
    bus.subscribe('bookmark.copy', (copyPkg) => {
      this.bookmarkCopy(copyPkg);
    });
    bus.subscribe('bookmark.delete', (verseIdx) => {
      this.bookmarkDelete(verseIdx);
    });
    bus.subscribe('bookmark.down', (verseIdx) => {
      this.bookmarkDown(verseIdx);
    });
    bus.subscribe('bookmark.get', () => {
      this.bookmarkGet();
    });
    bus.subscribe('bookmark.move', (movePkg) => {
      this.bookmarkMove(movePkg);
    });
    bus.subscribe('bookmark.sort-ascend', () => {
      this.bookmarkSort(numSortAscend);
    });
    bus.subscribe('bookmark.sort-descend', () => {
      this.bookmarkSort(numSortDescend);
    });
    bus.subscribe('bookmark.sort-invert', () => {
      this.bookmarkSortInvert();
    });
    bus.subscribe('bookmark.up', (verseIdx) => {
      this.bookmarkUp(verseIdx);
    });
    bus.subscribe('folder.add', (folderName) => {
      this.folderAdd(folderName);
    });
    bus.subscribe('folder.change', (folderName) => {
      this.folderChange(folderName);
    });
    bus.subscribe('folder.delete', (folderName) => {
      this.folderDelete(folderName);
    });
    bus.subscribe('folder.down', (folderName) => {
      this.folderDown(folderName);
    });
    bus.subscribe('folder.import', (pkgStr) => {
      this.folderImport(pkgStr);
    });
    bus.subscribe('folder.rename', (namePkg) => {
      this.folderRename(namePkg);
    });
    bus.subscribe('folder.up', (folderName) => {
      this.folderUp(folderName);
    });
    bus.subscribe('move-copy.list.change', (verseIdx) => {
      this.moveCopyListChange(verseIdx);
    });
  }

  updateFolder() {
    this.saveFolders();
    this.saveActiveFolder();
    bus.publish('folder.update', this.folder);
    bus.publish('folder.list.update', this.getFolderList());
  }

  updateFolderList() {
    this.saveFolders();
    bus.publish('folder.list.update', this.getFolderList());
  }

  validateFolders(folders) {
    let status = 'OK';
    let maxIdx = tome.verses.length - 1;
    folders.some((folder) => {
      if (
        !folder.name ||
        typeof folder.name !== 'string' ||
        !folder.bookmarks ||
        !Array.isArray(folder.bookmarks)
      ) {
        status = 'Invalid folder structure';
        return true;
      }
      let bookmarkError = folder.bookmarks.some((bookmark) => {
        if (
          !Number.isInteger(bookmark) ||
          bookmark < 0 ||
          bookmark > maxIdx
        ) {
          status = 'Invalid verse';
          return true;
        }
        return false;
      });
      return bookmarkError;
    });
    return status;
  }

  validatePkg(bookmarkPkg) {
    let status = 'OK';
    if (
      !bookmarkPkg.tome ||
      !bookmarkPkg.folders ||
      !Array.isArray(bookmarkPkg.folders)
    ) {
      status = 'Invalid package structure';
      return status;
    }
    if (bookmarkPkg.tome !== tome.name) {
      status = 'Tome mismatch';
      return status;
    }
    return status;
  }
}

export { BookmarkModel };

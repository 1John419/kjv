'use strict';

import { bus } from '../EventBus.js';

import { getChapterPkg } from '../util.js';

class BookmarkController {

  constructor() {
    this.initialize();
  }

  actionBookmarkBack() {
    bus.publish('sidebar.change', 'none');
  }

  actionBookmarkDelete(verseIdx) {
    bus.publish('bookmark.delete', verseIdx);
  }

  actionBookmarkDown(verseIdx) {
    bus.publish('bookmark.down', verseIdx);
  }

  actionBookmarkFolder() {
    bus.publish('bookmark.hide', null);
    this.subPage = 'folder';
    bus.publish('folder.show', null);
  }

  actionBookmarkFolderAdd() {
    bus.publish('bookmark.hide', null);
    this.subPage = 'folder-add';
    bus.publish('folder-add.show', null);
  }

  actionBookmarkMoveCopy(verseIdx) {
    bus.publish('bookmark.hide', null);
    this.subPage = 'move-copy';
    bus.publish('move-copy.list.change', verseIdx);
    bus.publish('move-copy.show', verseIdx);
    bus.publish('move-copy.scroll-to-top');
  }

  actionBookmarkSelect(verseIdx) {
    this.gotoBookmark(verseIdx);
  }

  actionBookmarkSortAscend() {
    bus.publish('bookmark.sort-ascend', null);
  }

  actionBookmarkSortDescend() {
    bus.publish('bookmark.sort-descend', null);
  }

  actionBookmarkSortInvert() {
    bus.publish('bookmark.sort-invert', null);
  }

  actionBookmarkUp(verseIdx) {
    bus.publish('bookmark.up', verseIdx);
  }

  actionExportBack() {
    bus.publish('export.hide', null);
    this.subPage = 'folder';
    bus.publish('folder.show', null);
  }

  actionFolderAddBack() {
    bus.publish('folder-add.hide', null);
    this.subPage = null;
    bus.publish('bookmark.show', null);
  }

  actionFolderAddSave(name) {
    bus.publish('folder.add', name);
    bus.publish('folder-add.hide', null);
    this.subPage = null;
    bus.publish('bookmark.show', null);
    bus.publish('folder.scroll-to-top', null);
  }

  actionFolderBack() {
    bus.publish('folder.hide', null);
    this.subPage = null;
    bus.publish('bookmark.show', null);
  }

  actionFolderDelete(folderName) {
    bus.publish('folder.hide');
    this.subPage = 'folder-delete';
    bus.publish('folder-delete.show', folderName);
  }

  actionFolderDeleteBack() {
    bus.publish('folder-delete.hide', null);
    this.subPage = 'folder';
    bus.publish('folder.show', null);
  }

  actionFolderDeleteConfirm(folderName) {
    bus.publish('folder.delete', folderName);
    bus.publish('folder-delete.hide', null);
    this.subPage = 'folder';
    bus.publish('folder.show', null);
  }

  actionFolderDown(folderName) {
    bus.publish('folder.down', folderName);
  }

  actionFolderExport() {
    bus.publish('folder.hide', null);
    this.subPage = 'export';
    bus.publish('export.show', null);
  }

  actionFolderImport() {
    bus.publish('folder.hide', null);
    this.subPage = 'import';
    bus.publish('import.show', null);
  }

  actionFolderRename(folderName) {
    bus.publish('folder.hide', null);
    this.subPage = 'folder-rename';
    bus.publish('folder-rename.show', folderName);
  }

  actionFolderRenameBack() {
    bus.publish('folder-rename.hide', null);
    this.subPage = 'folder';
    bus.publish('folder.show', null);
  }

  actionFolderRenameSave(namePkg) {
    bus.publish('folder.rename', namePkg);
    bus.publish('folder-rename.hide', null);
    this.subPage = 'folder';
    bus.publish('folder.show', null);
  }

  actionFolderSelect(folderName) {
    bus.publish('folder.change', folderName);
    bus.publish('folder.hide', null);
    this.subPage = null;
    bus.publish('bookmark.show', null);
  }

  actionFolderUp(folderName) {
    bus.publish('folder.up', folderName);
  }

  actionImportBack() {
    bus.publish('import.hide', null);
    this.subPage = 'folder';
    bus.publish('folder.show', null);
  }

  actionImportImport(pkgStr) {
    bus.publish('folder.import', pkgStr);
  }

  actionMoveCopyBack() {
    bus.publish('move-copy.hide', null);
    this.subPage = null;
    bus.publish('bookmark.show', null);
  }

  actionMoveCopyCopy(copyPkg) {
    bus.publish('bookmark.copy', copyPkg);
  }

  actionMoveCopyMove(movePkg) {
    bus.publish('bookmark.move', movePkg);
  }

  gotoBookmark(verseIdx) {
    let chapterPkg = getChapterPkg(verseIdx);
    bus.publish('chapterPkg.change', chapterPkg);
    if (this.panes === 1) {
      bus.publish('action.sidebar.select', 'none');
    }
    bus.publish('read.scroll-to-verse', verseIdx);
  }

  initialize() {
    this.subscribe();
  }

  panesUpdate(panes) {
    this.panes = panes;
  }

  sidebarUpdate() {
    if (!this.subPage) {
      return;
    }
    bus.publish(`${this.subPage}.hide`, null);
    this.subPage = null;
  }

  subscribe() {
    bus.subscribe('action.bookmark.back', () => {
      this.actionBookmarkBack();
    });
    bus.subscribe('action.bookmark.delete', (verseIdx) => {
      this.actionBookmarkDelete(verseIdx);
    });
    bus.subscribe('action.bookmark.down', (verseIdx) => {
      this.actionBookmarkDown(verseIdx);
    });
    bus.subscribe('action.bookmark.folder', () => {
      this.actionBookmarkFolder();
    });
    bus.subscribe('action.bookmark.folder-add', () => {
      this.actionBookmarkFolderAdd();
    });
    bus.subscribe('action.bookmark.move.copy', (verseIdx) => {
      this.actionBookmarkMoveCopy(verseIdx);
    });
    bus.subscribe('action.bookmark.select', (verseIdx) => {
      this.actionBookmarkSelect(verseIdx);
    });
    bus.subscribe('action.bookmark.sort-ascend', () => {
      this.actionBookmarkSortAscend();
    });
    bus.subscribe('action.bookmark.sort-descend', () => {
      this.actionBookmarkSortDescend();
    });
    bus.subscribe('action.bookmark.sort-invert', () => {
      this.actionBookmarkSortInvert();
    });
    bus.subscribe('action.bookmark.up', (verseIdx) => {
      this.actionBookmarkUp(verseIdx);
    });
    bus.subscribe('action.export.back', () => {
      this.actionExportBack();
    });
    bus.subscribe('action.folder-add.back', () => {
      this.actionFolderAddBack();
    });
    bus.subscribe('action.folder-add.save', (name) => {
      this.actionFolderAddSave(name);
    });
    bus.subscribe('action.folder.back', () => {
      this.actionFolderBack();
    });
    bus.subscribe('action.folder.delete', (folderName) => {
      this.actionFolderDelete(folderName);
    });
    bus.subscribe('action.folder-delete.back', () => {
      this.actionFolderDeleteBack();
    });
    bus.subscribe('action.folder-delete.confirm', (folderName) => {
      this.actionFolderDeleteConfirm(folderName);
    });
    bus.subscribe('action.folder.down', (folderName) => {
      this.actionFolderDown(folderName);
    });
    bus.subscribe('action.folder.export', () => {
      this.actionFolderExport();
    });
    bus.subscribe('action.folder.import', () => {
      this.actionFolderImport();
    });
    bus.subscribe('action.folder.rename', (folderName) => {
      this.actionFolderRename(folderName);
    });
    bus.subscribe('action.folder-rename.back', () => {
      this.actionFolderRenameBack();
    });
    bus.subscribe('action.folder-rename.save', (namePkg) => {
      this.actionFolderRenameSave(namePkg);
    });
    bus.subscribe('action.folder.select', (folderName) => {
      this.actionFolderSelect(folderName);
    });
    bus.subscribe('action.folder.up', (folderName) => {
      this.actionFolderUp(folderName);
    });
    bus.subscribe('action.import.back', () => {
      this.actionImportBack();
    });
    bus.subscribe('action.import.import',
      (pkgStr) => { this.actionImportImport(pkgStr); }
    );
    bus.subscribe('move-copy.list.back', () => {
      this.actionMoveCopyBack();
    });
    bus.subscribe('action.move-copy.copy', (copyPkg) => {
      this.actionMoveCopyCopy(copyPkg);
    });
    bus.subscribe('action.move-copy.move', (movePkg) => {
      this.actionMoveCopyMove(movePkg);
    });
    bus.subscribe('panes.update', (panes) => {
      this.panesUpdate(panes);
    });
    bus.subscribe('sidebar.update', () => {
      this.sidebarUpdate();
    });
  }

}

export { BookmarkController };

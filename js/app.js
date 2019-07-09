'use strict';

/*eslint no-unused-vars: ["off"]*/

export const appPrefix = 'kjv';

import { ReadModel } from './Model/ReadModel.js';
import { ReadView } from './View/ReadView.js';
import { ReadController } from './Controller/ReadController.js';
import { ContentModel } from './Model/ContentModel.js';
import { BookView } from './View/BookView.js';
import { ChapterView } from './View/ChapterView.js';
import { ContentController } from './Controller/ContentController.js';
import { BookmarkModel } from './Model/BookmarkModel.js';
import { BookmarkView } from './View/BookmarkView.js';
import { ExportView } from './View/ExportView.js';
import { ImportView } from './View/ImportView.js';
import { FolderView } from './View/FolderView.js';
import { FolderAddView } from './View/FolderAddView.js';
import { FolderDeleteView } from './View/FolderDeleteView.js';
import { FolderRenameView } from './View/FolderRenameView.js';
import { MoveCopyView } from './View/MoveCopyView.js';
import { BookmarkController } from './Controller/BookmarkController.js';
import { SearchModel } from './Model/SearchModel.js';
import { SearchView } from './View/SearchView.js';
import { FilterView } from './View/FilterView.js';
import { HistoryView } from './View/HistoryView.js';
import { SearchController } from './Controller/SearchController.js';
import { SettingModel } from './Model/SettingModel.js';
import { SettingView } from './View/SettingView.js';
import { SettingController } from './Controller/SettingController.js';
import { HelpModel } from './Model/HelpModel.js';
import { HelpView } from './View/HelpView.js';
import { TopicView } from './View/TopicView.js';
import { HelpController } from './Controller/HelpController.js';

(function() {
  let readModel = new ReadModel();
  let readView = new ReadView();
  let readController = new ReadController();
  let contentModel = new ContentModel();
  let bookView = new BookView();
  let chapterView = new ChapterView();
  let contentController = new ContentController();
  let bookmarkModel = new BookmarkModel();
  let bookmarkView = new BookmarkView();
  let exportView = new ExportView();
  let importView = new ImportView();
  let folderView = new FolderView();
  let folderAddView = new FolderAddView();
  let folderDeleteView = new FolderDeleteView();
  let folderRenameView = new FolderRenameView();
  let moveCopyView = new MoveCopyView();
  let bookmarkController = new BookmarkController();
  let searchModel = new SearchModel();
  let searchView = new SearchView();
  let filterView = new FilterView();
  let historyView = new HistoryView();
  let searchController = new SearchController();
  let settingModel = new SettingModel();
  let settingView = new SettingView();
  let settingController = new SettingController();
  let helpModel = new HelpModel();
  let helpView = new HelpView();
  let topicView = new TopicView();
  let helpController = new HelpController();
  readController.initializeApp();
})();

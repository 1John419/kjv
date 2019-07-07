'use strict';

import { bus } from '../EventBus.js';

class HelpController {

  constructor() {
    this.initialize();
  }

  actionHelpBack() {
    bus.publish('sidebar.change', 'none');
  }

  actionHelpTopic() {
    bus.publish('help.hide', null);
    this.subPage = 'topic';
    bus.publish('topic.show', null);
  }

  actionTopicBack() {
    bus.publish('topic.hide', null);
    this.subPage = null;
    bus.publish('help.show', null);
  }

  actionTopicSelect(topic) {
    bus.publish('topic.hide', null);
    this.subPage = null;
    bus.publish('topic.change', topic);
    bus.publish('help.show', null);
  }

  initialize() {
    this.subscribe();
  }

  sidebarUpdate() {
    if (!this.subPage) {
      return;
    }
    bus.publish(`${this.subPage}.hide`, null);
    this.subPage = null;
  }

  subscribe() {
    bus.subscribe('action.help.back', () => {
      this.actionHelpBack();
    });
    bus.subscribe('action.help.topic', (topic) => {
      this.actionHelpTopic(topic);
    });
    bus.subscribe('action.topic.back', (topic) => {
      this.actionTopicBack(topic);
    });
    bus.subscribe('action.topic.select', (topic) => {
      this.actionTopicSelect(topic);
    });
    bus.subscribe('sidebar.update', () => {
      this.sidebarUpdate();
    });
  }

}

export { HelpController };

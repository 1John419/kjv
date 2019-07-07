'use strict';

import { bus } from '../EventBus.js';

import {
  templateElement,
  templatePage,
  templatePageScroll,
  templateToolbarLower,
  templateToolbarUpper
} from '../template.js';

const lowerToolSet = [
  { type: 'btn', icon: 'back', label: 'Back' }
];

const upperToolSet = [
  { type: 'banner', modifier: 'topic', text: 'Topic' }
];

export const helpTopic = [
  { topic: 'about', name: 'About' },
  { topic: 'overview', name: 'Overview' },
  { topic: 'read', name: 'Read' },
  { topic: 'book-chapter', name: 'Book/Chapter' },
  { topic: 'bookmark', name: 'Bookmark' },
  { topic: 'search', name: 'Search' },
  { topic: 'setting', name: 'Setting' },
  { topic: 'help', name: 'Help' },
  { topic: 'thats-my-king', name: 'That\'s MY KING!' }
];

const templateBtnTopic = (helpTopic) => {
  let btnTopic = templateElement(
    'button', 'btn-topic', helpTopic.topic, helpTopic.name, helpTopic.name);
  btnTopic.dataset.topic = helpTopic.topic;
  return btnTopic;
};

const templateListTopic = () => {
  let list = templateElement(
    'div', 'list', 'topic', null, null);
  for (let topic of helpTopic) {
    let btn = templateBtnTopic(topic);
    list.appendChild(btn);
  }
  return list;
};

class TopicView {

  constructor() {
    this.initialize();
  }

  addListeners() {
    this.scroll.addEventListener('click', (event) => {
      this.scrollClick(event);
    });
    this.toolbarLower.addEventListener('click', (event) => {
      this.toolbarLowerClick(event);
    });
  }

  buildPage() {
    this.page = templatePage('topic');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templatePageScroll('topic');
    this.list = templateListTopic();
    this.scroll.appendChild(this.list);

    this.page.appendChild(this.scroll);

    this.toolbarLower = templateToolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    let container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  getElements() {
    this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
  }

  initialize() {
    this.buildPage();
    this.getElements();
    this.addListeners();
    this.subscribe();
  }

  scrollClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target.classList.contains('btn-topic')) {
      let topic = target.dataset.topic;
      bus.publish('action.topic.select', topic);
      return;
    }
  }

  subscribe() {
    bus.subscribe('topic.show', () => {
      this.topicShow();
    });
    bus.subscribe('topic.hide', () => {
      this.topicHide();
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target === this.btnBack) {
      bus.publish('action.topic.back', null);
    }
  }

  topicHide() {
    this.page.classList.add('page--hide');
  }

  topicShow() {
    this.page.classList.remove('page--hide');
  }

}

export { TopicView };

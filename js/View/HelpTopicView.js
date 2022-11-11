'use strict';

import queue from '../CommandQueue.js';
import {
  templateElement,
  templatePage,
  templateScroll,
  templateToolbarLower,
  templateToolbarUpper
} from '../template.js';
import { appText } from '../data/language.js'

const lowerToolSet = [
  { type: 'btn', icon: 'back', ariaLabel: `${appText.back}` },
  { type: 'btn', icon: 'help-read', ariaLabel: `${appText.helpRead}` }
];

const upperToolSet = [
  { type: 'banner', cssModifier: 'topic', text: `${appText.topic}` }
];

export const helpTopicList = [
  { topic: 'about', name: `${appText.about}` },
  { topic: 'overview', name: `${appText.overview}` },
  { topic: 'read', name: `${appText.read}` },
  { topic: 'navigator', name: `${appText.navigator}` },
  { topic: 'bookmark', name: `${appText.bookmark}` },
  { topic: 'search', name: `${appText.search}` },
  { topic: 'setting', name: `${appText.setting}` },
  { topic: 'help', name: `${appText.help}` },
  { topic: 'thats-my-king', name: `${appText.thatsMyKing}` }
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
  for (let topic of helpTopicList) {
    let btn = templateBtnTopic(topic);
    list.appendChild(btn);
  }
  return list;
};

class HelpTopicView {

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
    this.page = templatePage('help-topic');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templateScroll('help-topic');
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
    this.btnHelpRead = this.toolbarLower.querySelector('.btn-icon--help-read');
  }

  hide() {
    this.page.classList.add('page--hide');
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
    if (target) {
      if (target.classList.contains('btn-topic')) {
        let helpTopic = target.dataset.topic;
        queue.publish('help-topic.select', helpTopic);
      }
    }
  }

  show() {
    this.page.classList.remove('page--hide');
  }

  subscribe() {
    queue.subscribe('help-topic.show', () => {
      this.show();
    });
    queue.subscribe('help-topic.hide', () => {
      this.hide();
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target) {
      if (target === this.btnBack) {
        queue.publish('help.back', null);
      } else if (target === this.btnHelpRead) {
        queue.publish('help-read', null);
      }
    }
  }

}

export { HelpTopicView };
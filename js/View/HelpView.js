'use strict';

import { bus } from '../EventBus.js';

import { helpTopic } from './TopicView.js';

import {
  templatePage,
  templatePageScroll,
  templateToolbarLower,
  templateToolbarUpper
} from '../template.js';

const lowerToolSet = [
  { type: 'btn', icon: 'back', label: 'Back' }
];

const upperToolSet = [
  { type: 'banner', modifier: 'help', text: null },
  { type: 'btn', icon: 'topic', label: 'Topic' }
];

class HelpView {

  constructor() {
    this.initialize();
  }

  addListeners() {
    this.toolbarLower.addEventListener('click', (event) => {
      this.toolbarLowerClick(event);
    });
    this.toolbarUpper.addEventListener('click', (event) => {
      this.toolbarUpperClick(event);
    });
  }

  buildPage() {
    this.page = templatePage('help');

    this.toolbarUpper = templateToolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = templatePageScroll('help');
    this.page.appendChild(this.scroll);

    this.toolbarLower = templateToolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    let container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  getElements() {
    this.banner = this.toolbarUpper.querySelector('.banner--help');
    this.btnTopic = this.toolbarUpper.querySelector('.btn-icon--topic');

    this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
  }

  helpHide() {
    this.page.classList.add('page--hide');
  }

  helpShow() {
    this.page.classList.remove('page--hide');
  }

  initialize() {
    this.buildPage();
    this.getElements();
    this.addListeners();
    this.subscribe();
  }

  panesUpdate(panes) {
    if (panes === 1) {
      this.btnBack.classList.remove('btn-icon--hide');
    } else {
      this.btnBack.classList.add('btn-icon--hide');
    }
  }

  subscribe() {
    bus.subscribe('help.show', () => {
      this.helpShow();
    });
    bus.subscribe('help.hide', () => {
      this.helpHide();
    });
    bus.subscribe('panes.update', (panes) => {
      this.panesUpdate(panes);
    });
    bus.subscribe('topic.update', (topic) => {
      this.topicUpdate(topic);
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    if (target === this.btnBack) {
      bus.publish('action.help.back', null);
    }
  }

  toolbarUpperClick(event) {
    event.preventDefault();
    let target = event.target.closest('button');
    switch (target) {
      case this.btnTopic:
        bus.publish('action.help.topic', null);
    }
  }

  topicUpdate(topic) {
    this.updateBanner(topic);
    let url = `help/${topic}.html`;
    fetch(url)
      .then((response) => {
        return response.text();
      }).then((html) => {
        this.scroll.innerHTML = html;
        this.scroll.scrollTop = 0;
      }).catch((error) => {
        console.log(error);
      });
  }

  updateBanner(topic) {
    let title = helpTopic.find(obj => obj.topic === topic).name;
    this.banner.textContent = title;
  }

}

export { HelpView };

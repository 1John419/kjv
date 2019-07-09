'use strict';

import { bus } from '../EventBus.js';

import { appPrefix } from '../util.js';

class SettingModel {
  constructor() {
    this.initialize();
  }

  changeFont(font) {
    this.font = font;
    this.saveFont();
    bus.publish('font.update', this.font);
  }

  changeFontSize(fontSize) {
    this.fontSize = fontSize;
    this.saveFontSize();
    bus.publish('font-size.update', this.fontSize);
  }

  changeTheme(theme) {
    this.theme = theme;
    this.saveTheme();
    bus.publish('theme.update', this.theme);
  }

  getFont() {
    let font = localStorage.getItem(`${appPrefix}-font`);
    if (!font) {
      font = {
        fontName: 'Roboto',
        fontClass: 'font--roboto'
      };
    } else {
      font = JSON.parse(font);
    }
    this.changeFont(font);
  }

  getFonts() {
    this.fonts = [];
    this.fonts.push({
      fontName: 'Roboto',
      fontClass: 'font--roboto'
    });
    this.fonts.push({
      fontName: 'Open Sans',
      fontClass: 'font--open-sans'
    });
    this.fonts.push({
      fontName: 'Lato',
      fontClass: 'font--lato'
    });
    this.fonts.push({
      fontName: 'Slabo',
      fontClass: 'font--slabo'
    });
    this.fonts.push({
      fontName: 'Merriweather',
      fontClass: 'font--merriweather'
    });
    this.fonts.push({
      fontName: 'Roboto Slab',
      fontClass: 'font--roboto-slab'
    });
    bus.publish('fonts.update', this.fonts);
  }

  getFontSize() {
    let fontSize = localStorage.getItem(`${appPrefix}-fontSize`);
    if (!fontSize) {
      fontSize = 'font-size--m';
    } else {
      fontSize = JSON.parse(fontSize);
    }
    this.changeFontSize(fontSize);
  }

  getTheme() {
    let theme = localStorage.getItem(`${appPrefix}-theme`);
    if (!theme) {
      theme = {
        themeName: 'Sapphire',
        themeClass: 'theme--sapphire'
      };
    } else {
      theme = JSON.parse(theme);
    }
    this.changeTheme(theme);
  }

  getThemes() {
    this.themes = [];
    this.themes.push({
      themeName: 'Jasper',
      themeClass: 'theme--jasper'
    });
    this.themes.push({
      themeName: 'Sapphire',
      themeClass: 'theme--sapphire'
    });
    this.themes.push({
      themeName: 'Chalcedony',
      themeClass: 'theme--chalcedony'
    });
    this.themes.push({
      themeName: 'Emerald',
      themeClass: 'theme--emerald'
    });
    this.themes.push({
      themeName: 'Beryl',
      themeClass: 'theme--beryl'
    });
    this.themes.push({
      themeName: 'Topaz',
      themeClass: 'theme--topaz'
    });
    this.themes.push({
      themeName: 'Amethyst',
      themeClass: 'theme--amethyst'
    });
    bus.publish('themes.update', this.themes);
  }

  initialize() {
    this.subscribe();
  }

  saveFont() {
    localStorage.setItem(`${appPrefix}-font`, JSON.stringify(this.font));
  }

  saveFontSize() {
    localStorage.setItem(`${appPrefix}-fontSize`, JSON.stringify(this.fontSize));
  }

  saveTheme() {
    localStorage.setItem(`${appPrefix}-theme`, JSON.stringify(this.theme));
  }

  settingGet() {
    this.getFonts();
    this.getFont();
    this.getFontSize();
    this.getThemes();
    this.getTheme();
  }

  subscribe() {
    bus.subscribe('font.change', (font) => {
      this.changeFont(font);
    });
    bus.subscribe('font-size.change', (fontSize) => {
      this.changeFontSize(fontSize);
    });
    bus.subscribe('setting.get', () => {
      this.settingGet();
    });
    bus.subscribe('theme.change', (theme) => {
      this.changeTheme(theme);
    });
  }

}

export { SettingModel };

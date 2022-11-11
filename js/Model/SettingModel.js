'use strict';

import queue from '../CommandQueue.js';
import { appText } from '../data/language.js';

const validFontSizes = ['font-size--s', 'font-size--m', 'font-size--l',
  'font-size--xl', 'font-size--xxl'
];

const fontDefault = 0;
const fontSizeDefault = 1;
const themeDefault = 9;

class SettingModel {

  constructor() {
    this.initialize();
  }

  fontChange(font) {
    this.font = font;
    this.saveFont();
    queue.publish('font.update', this.font);
  }

  fontIsValid(font) {
    let result;
    try {
      result = this.fonts.some((validFont) => {
        return validFont.fontName === font.fontName &&
          validFont.fontClass === font.fontClass;
      });
    } catch (error) {
      result = false;
    }
    return result;
  }

  fontSizeChange(fontSize) {
    this.fontSize = fontSize;
    this.saveFontSize();
    queue.publish('font-size.update', this.fontSize);
  }

  initialize() {
    this.subscribe();
  }

  initializeFonts() {
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
      fontName: 'Roboto Slab',
      fontClass: 'font--roboto-slab'
    });
    this.fonts.push({
      fontName: 'Merriweather',
      fontClass: 'font--merriweather'
    });
    this.fonts.push({
      fontName: 'Dancing Script',
      fontClass: 'font--dancing-script'
    });
    this.fonts.push({
      fontName: 'Shadows Into Light',
      fontClass: 'font--shadows-into-light'
    });
    this.fonts.push({
      fontName: 'Roboto Mono',
      fontClass: 'font--roboto-mono'
    });
    this.fonts.push({
      fontName: 'Inconsolata',
      fontClass: 'font--inconsolata'
    });
    queue.publish('fonts.update', this.fonts);
  }

  initializeThemes() {
    this.themes = [];
    this.themes.push({
      themeType: 'dark',
      themeName: `${appText.jasper}`,
      themeClass: 'theme--jasper-dark'
    });
    this.themes.push({
      themeType: 'light',
      themeName: `${appText.jasper}`,
      themeClass: 'theme--jasper-light'
    });
    this.themes.push({
      themeType: 'dark',
      themeName: `${appText.beryl}`,
      themeClass: 'theme--beryl-dark'
    });
    this.themes.push({
      themeType: 'light',
      themeName: `${appText.beryl}`,
      themeClass: 'theme--beryl-light'
    });
    this.themes.push({
      themeType: 'dark',
      themeName: `${appText.emerald}`,
      themeClass: 'theme--emerald-dark'
    });
    this.themes.push({
      themeType: 'light',
      themeName: `${appText.emerald}`,
      themeClass: 'theme--emerald-light'
    });
    this.themes.push({
      themeType: 'dark',
      themeName: `${appText.topaz}`,
      themeClass: 'theme--topaz-dark'
    });
    this.themes.push({
      themeType: 'light',
      themeName: `${appText.topaz}`,
      themeClass: 'theme--topaz-light'
    });
    this.themes.push({
      themeType: 'dark',
      themeName: `${appText.sapphire}`,
      themeClass: 'theme--sapphire-dark'
    });
    this.themes.push({
      themeType: 'light',
      themeName: `${appText.sapphire}`,
      themeClass: 'theme--sapphire-light'
    });
    this.themes.push({
      themeType: 'dark',
      themeName: `${appText.amethyst}`,
      themeClass: 'theme--amethyst-dark'
    });
    this.themes.push({
      themeType: 'light',
      themeName: `${appText.amethyst}`,
      themeClass: 'theme--amethyst-light'
    });
    this.themes.push({
      themeType: 'dark',
      themeName: `${appText.chalcedony}`,
      themeClass: 'theme--chalcedony-dark'
    });
    this.themes.push({
      themeType: 'light',
      themeName: `${appText.chalcedony}`,
      themeClass: 'theme--chalcedony-light'
    });
        queue.publish('themes.update', this.themes);
  }

  restore() {
    this.initializeFonts();
    this.restoreFont();
    this.restoreFontSize();
    this.initializeThemes();
    this.restoreTheme();
  }

  restoreFont() {
    let defaultFont = this.fonts[fontDefault];
    let font = localStorage.getItem('font');
    if (!font) {
      font = defaultFont;
    } else {
      try {
        font = JSON.parse(font);
      } catch (error) {
        font = defaultFont;
      }
      if (!this.fontIsValid(font)) {
        font = defaultFont;
      }
    }
    this.fontChange(font);
  }

  restoreFontSize() {
    let defaultFontSize = validFontSizes[fontSizeDefault];
    let fontSize = localStorage.getItem('fontSize');
    if (!fontSize) {
      fontSize = defaultFontSize;
    } else {
      try {
        fontSize = JSON.parse(fontSize);
      } catch (error) {
        fontSize = defaultFontSize;
      }
      if (!validFontSizes.includes(fontSize)) {
        fontSize = defaultFontSize;
      }
    }
    this.fontSizeChange(fontSize);
  }

  restoreTheme() {
    let defaultTheme = this.themes[themeDefault];
    let theme = localStorage.getItem('theme');
    if (!theme) {
      theme = defaultTheme;
    } else {
      try {
        theme = JSON.parse(theme);
      } catch (error) {
        theme = defaultTheme;
      }
      if (!this.themeIsValid(theme)) {
        theme = defaultTheme;
      }
    }
    this.themeChange(theme);
  }

  saveFont() {
    localStorage.setItem('font', JSON.stringify(this.font));
  }

  saveFontSize() {
    localStorage.setItem('fontSize', JSON.stringify(this.fontSize));
  }

  saveTheme() {
    localStorage.setItem('theme', JSON.stringify(this.theme));
  }

  subscribe() {
    queue.subscribe('font.change', (font) => {
      this.fontChange(font);
    });

    queue.subscribe('font-size.change', (fontSize) => {
      this.fontSizeChange(fontSize);
    });

    queue.subscribe('setting.restore', () => {
      this.restore();
    });

    queue.subscribe('theme.change', (theme) => {
      this.themeChange(theme);
    });
  }

  themeChange(theme) {
    this.theme = theme;
    this.saveTheme();
    queue.publish('theme.update', this.theme);
  }

  themeIsValid(theme) {
    let result;
    try {
      result = this.themes.some((validTheme) => {
        return validTheme.themeType === theme.themeType &&
          validTheme.themeName === theme.themeName &&
          validTheme.themeClass === theme.themeClass;
      });
    } catch (error) {
      result = false;
    }
    return result;
  }

}

export { SettingModel };

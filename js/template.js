'use strict';

const svgNS = 'http://www.w3.org/2000/svg';
const xlinkNS = 'http://www.w3.org/1999/xlink';

export const templateActionMenu = (modifier, actionSet) => {
  let actionMenu = templateElement(
    'div', 'action-menu', modifier, null, null);
  actionMenu.classList.add('action-menu--hide');
  for (let btn of actionSet) {
    let element = templateBtnIcon(btn.icon, btn.label);
    actionMenu.appendChild(element);
  }
  return actionMenu;
};

export const templateBtnIcon = (svgId, label) => {
  let svg = document.createElementNS(svgNS, 'svg');
  svg.classList.add('btn-icon__svg');
  let useTag = document.createElementNS(svgNS, 'use');
  useTag.classList.add('btn-icon__use', `btn-icon__use--${svgId}`);
  useTag.setAttributeNS(xlinkNS, 'xlink:href', `icons.svg#${svgId}`);
  svg.appendChild(useTag);
  let btnIcon = templateElement(
    'button', 'btn-icon', svgId, label, null);
  btnIcon.appendChild(svg);
  return btnIcon;
};

export const templateDivDialog = (modifier, toolSet) => {
  let divDialog = templateElement(
    'div', 'dialog', modifier, null, null);
  let divDialogBtns = templateElement(
    'div', 'dialog-btns', modifier, null, null);
  for (let tool of toolSet) {
    let element;
    switch (tool.type) {
      case 'btn':
        element = templateElement(
          'button', 'btn-dialog', tool.id, tool.label, tool.label);
        divDialogBtns.appendChild(element);
        break;
      case 'input':
        element = templateInput('dialog-input', modifier, tool.label);
        divDialog.appendChild(element);
        break;
      case 'label':
        element = templateElement(
          'div', 'dialog-label', modifier, null, null);
        if (tool.text) {
          element.textContent = tool.text;
        }
        divDialog.appendChild(element);
        break;
      case 'textarea':
        element = templateElement(
          'textarea', 'dialog-textarea', modifier, tool.label, null);
        divDialog.appendChild(element);
    }
  }
  divDialog.appendChild(divDialogBtns);
  return divDialog;
};

export const templateElement = (tagName, block, modifier, label, content) => {
  let element = document.createElement(tagName);
  element.classList.add(block);
  if (modifier) {
    element.classList.add(`${block}--${modifier}`);
  }
  if (label) {
    element.setAttribute('aria-label', label);
  }
  if (content) {
    element.textContent = content;
  }
  return element;
};

export const templateInput = (block, modifier, label) => {
  let input = templateElement(
    'input', block, modifier, label, null);
  input.setAttribute('type', 'text');
  return input;
};

export const templatePage = (modifier) => {
  let page = templateElement(
    'div', 'page', modifier, null, null);
  page.classList.add('page--hide');
  return page;
};

export const templatePageScroll = (modifier) => {
  let scroll = templateElement(
    'div', 'page__scroll', modifier, null, null);
  return scroll;
};

export const templatePageToolbar = (modifier) => {
  let toolbar = templateElement(
    'div', 'page__toolbar', modifier, null, null);
  return toolbar;
};

export const templateToolbarLower = (toolSet) => {
  let toolbarLower = templatePageToolbar('lower');
  for (let tool of toolSet) {
    let element;
    switch (tool.type) {
      case 'btn':
        element = templateBtnIcon(tool.icon, tool.label);
        toolbarLower.appendChild(element);
        break;
      case 'input':
        element = templateInput('input', tool.modifier, tool.label);
        toolbarLower.appendChild(element);
    }
  }
  return toolbarLower;
};

export const templateToolbarUpper = (toolSet) => {
  let toolbarUpper = templatePageToolbar('upper');
  for (let tool of toolSet) {
    let element;
    switch (tool.type) {
      case 'btn':
        element = templateBtnIcon(tool.icon, tool.label);
        toolbarUpper.appendChild(element);
        break;
      case 'banner':
        element = templateElement(
          'div', 'banner', tool.modifier, null, tool.text);
        toolbarUpper.appendChild(element);
    }
  }
  return toolbarUpper;
};

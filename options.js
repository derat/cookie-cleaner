// Copyright 2019 Daniel Erat. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import { clearData } from './common.js';

const $ = (id) => document.getElementById(id);

function saveOptions() {
  const exceptions = $('exceptions-textarea')
    .value.trim()
    .split('\n')
    .map((d) => d.trim())
    .filter(Boolean)
    .sort()
    .join('\n');
  chrome.storage.sync.set({ exceptions }, () => {
    $('exceptions-textarea').value = exceptions;
    $('save-button').disabled = true;
  });
}

function restoreOptions() {
  chrome.storage.sync.get('exceptions', (items) => {
    $('exceptions-textarea').value = items.exceptions ?? '';
    $('save-button').disabled = true;
  });
}

function textareaChanged() {
  $('save-button').disabled = false;
}

document.addEventListener('DOMContentLoaded', () => {
  $('save-button').addEventListener('click', saveOptions);

  const clearButton = $('clear-button');
  clearButton.addEventListener('click', () => {
    clearButton.innerText = 'Clearing...';
    clearButton.disabled = true;
    saveOptions();
    clearData().finally(() => {
      clearButton.innerText = 'Clear data';
      clearButton.disabled = false;
    });
  });

  $('exceptions-textarea').addEventListener('change', textareaChanged);
  $('exceptions-textarea').addEventListener('keyup', textareaChanged);
  $('exceptions-textarea').addEventListener('paste', textareaChanged);
  restoreOptions();
});

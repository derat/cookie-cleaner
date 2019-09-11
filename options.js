// Copyright 2019 Daniel Erat. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function $(id) { return document.getElementById(id); }

function save_options() {
  var lines = $('exceptions-textarea').value.split("\n");
  var domains = [];
  for (var i = 0; i < lines.length; i++) {
    var domain = lines[i].trim();
    if (domain)
      domains.push(domain);
  }
  var value = domains.sort().join("\n");

  chrome.storage.sync.set({ exceptions: value }, function(items) {
    $('exceptions-textarea').value = value;
    $('save-button').disabled = true;
  });
}

function restore_options() {
  chrome.storage.sync.get('exceptions', function(items) {
    $('exceptions-textarea').value = items.exceptions ? items.exceptions : '';
    $('save-button').disabled = true;
  });
}

function textarea_changed() {
  $('save-button').disabled = false;
}

document.addEventListener('DOMContentLoaded', restore_options);
$('save-button').addEventListener('click', save_options);
$('exceptions-textarea').addEventListener('change', textarea_changed);
$('exceptions-textarea').addEventListener('keyup', textarea_changed);
$('exceptions-textarea').addEventListener('paste', textarea_changed);

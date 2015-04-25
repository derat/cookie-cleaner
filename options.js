function $(id) { return document.getElementById(id); }

function save_options() {
  chrome.storage.sync.set({
    exceptions: $('exceptions-textarea').value
  }, function(items) {
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

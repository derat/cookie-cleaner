// Copyright 2019 Daniel Erat. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// From http://stackoverflow.com/questions/280634/endswith-in-javascript
String.prototype.endsWith = function(suffix) {
  return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function clear_cookies() {
  // Hope I get to try promises someday.
  chrome.storage.sync.get('exceptions', function(items) {
    if (!items.exceptions)
      return;
    var domains = items.exceptions.split("\n");
    if (!domains.length)
      return;

    chrome.cookies.getAll({}, function(cookies) {
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var keepCookie = false;

        for (var j = 0; j < domains.length; j++) {
          var domain = domains[j];
          if (cookie.domain == domain || cookie.domain.endsWith('.' + domain)) {
            keepCookie = true;
            break;
          }
        }

        if (keepCookie)
          continue;

        var prefix = cookie.secure ? "https://" : "http://";
        var domain = cookie.domain.substring(cookie.domain[0] == '.' ? 1 : 0);
        var url = prefix + domain + cookie.path;
        console.log('deleting ' + cookie.name + ' for ' + url);
        chrome.cookies.remove({
          url: url,
          name: cookie.name
        });

      }
    });

    // TODO: Local storage?
    // See https://developer.chrome.com/extensions/browsingData
    // RemovalOptions has excludeOrigins since Chrome 74.
  });
}

chrome.runtime.onStartup.addListener(clear_cookies);

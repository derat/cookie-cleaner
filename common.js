// Copyright 2019 Daniel Erat. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Deletes all cookies except those explicitly excluded by the user.
function clearCookies() {
  chrome.storage.sync.get('exceptions', function (items) {
    if (!items.exceptions) return;
    const domains = items.exceptions.split('\n');
    if (!domains.length) return;

    chrome.cookies.getAll({}, (cookies) => {
      for (const cookie of cookies) {
        const keep = domains.find(
          (d) => cookie.domain === d || cookie.domain.endsWith(`.${d}`)
        );
        if (keep) continue;

        const prefix = cookie.secure ? 'https://' : 'http://';
        const domain = cookie.domain.replace(/^\./, '');
        const url = prefix + domain + cookie.path;
        console.log(`Deleting "${cookie.name}" for ${url}`);
        chrome.cookies.remove({ url, name: cookie.name });
      }
    });

    // TODO: Also clear local storage?
    // See https://developer.chrome.com/extensions/browsingData
    // RemovalOptions has excludeOrigins since Chrome 74.
  });
}

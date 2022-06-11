// Copyright 2019 Daniel Erat. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Deletes all data except that explicitly excluded by the user.
// Returns a promise that is resolved once clearing is complete.
export function clearData() {
  return new Promise((resolve) => {
    chrome.storage.sync.get('exceptions', function (items) {
      const excludeOrigins = (items.exceptions ?? '')
        .split('\n')
        .map((d) => d.trim())
        .filter(Boolean)
        .map((d) => [`http://${d}`, `https://${d}`])
        .flat();
      if (!excludeOrigins.length) {
        console.log("No exceptions defined, so won't clear data");
        resolve();
        return;
      }

      console.log('Clearing data');
      chrome.browsingData.remove(
        { excludeOrigins },
        {
          cacheStorage: true,
          cookies: true,
          fileSystems: true,
          indexedDB: true,
          localStorage: true,
          serviceWorkers: true,
          webSQL: true,
        },
        () => {
          console.log('Cleared data');
          resolve();
        }
      );
    });
  });
}

// Copyright 2019 Daniel Erat. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import { clearData } from './common.js';

chrome.runtime.onStartup.addListener(clearData);

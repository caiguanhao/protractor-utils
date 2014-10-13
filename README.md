protractor-utils
================

Small utils for Protractor.

## httpGetChecksum

```js
var baseUrl = 'http://localhost:9000';
exports.config = {
  onPrepare: function () {
    expect.myPage = function (path) {
      return {
        haveChecksum = function (expected) {
          var checksum = require('protractor-utils').httpGetChecksum;
          expect(checksum(baseUrl + path)).toEqual(expected);
          return this;
        }
      }
    };
  }
};

// expect.myPage('/index.html').haveChecksum('ca5767e0ecef0...');
```

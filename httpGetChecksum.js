var Q = require('q');
var Url = require('url');
var crypto = require('crypto');

module.exports = httpGetChecksum;

function httpGetChecksum (algorithm, url) {
  if (arguments.length === 1) {
    url = algorithm;
    algorithm = 'sha1';
  }
  var deferred = Q.defer();
  var http;
  if (url.slice(0, 5) === 'https') {
    http = require('https');
  } else if (url.slice(0, 4) === 'http')  {
    http = require('http');
  } else {
    deferred.resolve('[ERROR] Unknown protocol.');
    return deferred.promise;
  }
  var parts = Url.parse(url);
  http.get({
    host: parts.hostname,
    port: parts.port,
    path: parts.pathname,
    agent: false
  }, function(res) {
    var code = res.statusCode;
    if (code === 301 || code === 302) {
      return deferred.resolve(httpGetChecksum(algorithm, res.headers.location));
    } else if (code !== 200) {
      return deferred.resolve('[ERROR] Fail to get the page. Status: ' + code);
    }
    var sum = crypto.createHash(algorithm);
    res.on('data', function(data) {
      sum.update(data);
    });
    res.on('end', function() {
      deferred.resolve(sum.digest('hex'));
    });
  }).on('error', function (e) {
    deferred.resolve('[ERROR] ' + e.toString());
  });
  return deferred.promise;
}

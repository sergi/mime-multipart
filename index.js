var uuid = require('node-uuid');
var CRLF = '\r\n';

function generate(tuples, options) {
  options = options || {};
  var boundary = options.boundary || uuid();
  var headers = [
    'From: ' + (options.from || ('nobody ' + Date())),
    'MIME-Version: 1.0',
    'Content-Type: multipart/mixed; boundary=' + boundary
  ];

  var delimiter = '--' + boundary;
  var closeDelimiter = delimiter + '--';

  var parts = tuples.map(function(tuple, i) {
    var mimetype = tuple.mime || 'text/plain';
    var encoding = tuple.encoding || 'utf8';
    var filename = tuple.filename || ('file' + i);
    var fileHeaders = [
      'MIME-Version: 1.0',
      'Content-Type: ' + mimetype + '; charset="' + encoding + '"',
      'Content-Transfer-Encoding: 7bit',
      'Content-Disposition: attachment; filename="' + filename + '"',
    ].join(CRLF) + CRLF;

    return [delimiter, fileHeaders, tuple.content].join(CRLF);
  });

  return [
    headers.join(CRLF),
    parts.join(CRLF + CRLF),
    closeDelimiter
  ].join(CRLF + CRLF);
}

module.exports = {
  generate: generate
};

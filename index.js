var uuid = require('node-uuid');
var CRLF = '\r\n';

function generate(tuples, options) {
  if (tuples.length === 0) {
    // according to rfc1341 there should be at least one encapsulation
    throw new Error('Missing argument. At least one part to generate is required');
  }

  options = options || {};
  var from = options.from;
  var preamble = options.preamble;
  var epilogue = options.epilogue;
  var boundary = options.boundary || uuid();

  if (boundary.length < 1 || boundary.length > 70) {
    throw new Error('Boundary should be between 1 and 70 characters long');
  }

  var headers = [
    'From: ' + (from || ('nobody ' + Date())),
    'MIME-Version: 1.0',
    'Content-Type: multipart/mixed; boundary="' + boundary + '"',
  ];

  var delimiter = CRLF + '--' + boundary;
  var closeDelimiter = delimiter + '--';

  var encapsulations = tuples.map(function(tuple, i) {
    var mimetype = tuple.mime || 'text/plain';
    var encoding = tuple.encoding || 'utf-8';
    var filename = tuple.filename || ('file' + i);

    var headers = [
      'MIME-Version: 1.0',
      'Content-Type: ' + mimetype + '; charset="' + encoding + '"',
      'Content-Transfer-Encoding: 7bit',
      'Content-Disposition: attachment; filename="' + filename + '"',
    ];

    var bodyPart = headers.join(CRLF) + CRLF + CRLF + tuple.content;

    return delimiter + CRLF + bodyPart;
  });

  var multipartBody = [
    preamble ? CRLF + preamble : undefined,
    encapsulations.join(''),
    closeDelimiter,
    epilogue ? CRLF + epilogue : undefined,
  ].filter(function(element) { return !!element; });

  return headers.join(CRLF) + CRLF + multipartBody.join('');
}

module.exports = {
  generate: generate
};

var uuid = require('node-uuid');
var CRLF = '\r\n';

function generate(tuples, options) {
  options = options || {};
  var boundary = options.boundary || uuid;
  var headers = [
    'From: ' + options.from || 'nobody' + Date(),
    'MIME-Version: 1.0',
    'Content-Type:multipart/mixed; boundary=' + boundary
  ];

  var delimiter = CRLF + '--' + boundary;
  var closeDelimiter = delimiter + '--';

  var parts = tuples.map(function(tuple, i) {
    var mimetype = tuple.mime || 'text/plain';
    console.log(tuple);
    var encoding = tuple.encoding || 'utf8';
    var fileHeaders = [
      'MIME-Version: 1.0',
      'Content-Type: ' + mimetype + '; charset="' + encoding + '"',
      'Content-Transfer-Encoding: 7bit',
      'Content-Disposition: attachment; filename="file' + i + '"'
    ].join(CRLF);

    return [delimiter, fileHeaders, tuple.content, closeDelimiter].join(CRLF);
  });

  return [headers.join(CRLF), parts].join(CRLF);
}

module.exports = {
  generate: generate
};

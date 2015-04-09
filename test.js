var multipart = require('./');
var test = require('tape');

test('produces valid mime multipart archive', function(t) {
  t.plan(1);

  var content1 = {
    content: 'thug',
    mime: 'text/upstart-job',
    encoding: 'ascii'
  };

  var content2 = { content: 'life' };

  var expected = 'From: nobody Thu Apr 09 2015 14:24:54 GMT+0200\r\nMIME-Version: 1.0\r\nContent-Type:multipart/mixed; boundary=4987e8f2-34a1-41a5-a4aa-3bfc3398651d\r\n\r\n--4987e8f2-34a1-41a5-a4aa-3bfc3398651d\r\nMIME-Version: 1.0\r\nContent-Type: text/upstart-job; charset="ascii"\r\nContent-Transfer-Encoding: 7bit\r\nContent-Disposition: attachment; filename="file0"\r\n\r\nthug\r\n\r\n--4987e8f2-34a1-41a5-a4aa-3bfc3398651d\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset="utf8"\r\nContent-Transfer-Encoding: 7bit\r\nContent-Disposition: attachment; filename="file1"\r\n\r\nlife\r\n\r\n--4987e8f2-34a1-41a5-a4aa-3bfc3398651d--';

  var result = multipart.generate([content1, content2], {
    boundary: '4987e8f2-34a1-41a5-a4aa-3bfc3398651d',
    from: 'nobody Thu Apr 09 2015 14:24:54 GMT+0200'
  });

  t.equal(result, expected);
});

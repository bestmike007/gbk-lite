// Run `curl -O http://www.unicode.org/Public/MAPPINGS/VENDORS/MICSFT/WindowsBestFit/bestfit936.txt` before this.

var fs = require('fs');

// reading CP936 gbk -> utf8 mappings.
var cp936src = fs.readFileSync('./bestfit936.txt', 'UTF8').split('\r\n');

var startLine = cp936src.indexOf(cp936src.find(function (line) { return line.indexOf('WCTABLE') === 0; }));
var endLine = cp936src.indexOf('ENDCODEPAGE');

if (startLine < 0 || endLine < 0) {
  console.error('Unexpected code page file.', startLine, endLine);
  process.exit();
}

cp936src = cp936src.slice(startLine + 2, endLine - 1);

// generate parsed code page.
var parsed = "", currentCode = 0;
cp936src.forEach(function (line) {
  var columns = line.split('\t');
  var code = parseInt(columns[0]);
  if (code < 128 || parseInt(columns[1]) < 128) return; // skip ascii chars.
  if (code === currentCode + 1) {
    parsed += unescape('%u' + columns[1].substr(2));
  } else {
    parsed += columns[0].substr(2) + unescape('%u' + columns[1].substr(2));
  }
  currentCode = code;
});

// save parsed code page.
fs.writeFileSync('lib/gbk-lite.js', new Buffer(fs.readFileSync('index.js', 'utf8').replace('[CP936CODES]', parsed)));

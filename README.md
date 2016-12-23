## Pure JS character GBK encoding conversion

Export and download in-browser data w/ gbk character set encoding. Multibyte encodings are generated from http://www.unicode.org/Public/MAPPINGS/VENDORS/MICSFT/WindowsBestFit/bestfit936.txt;

### Usage

Browser only, use [iconv-lite](https://github.com/ashtuchkin/iconv-lite) for general purposes. It's a single script of size 74KB (50KB gzipped).

```html
<script src="http://bestmike007.com/gbk-lite/lib/gbk-lite.min.js"></script>
```

Or use JavaScript to load it asynchronously.

```js
function loadScript(url, callback) {
  var script = document.createElement("script")
  script.type = "text/javascript";

  if (script.readyState) { //IE
    script.onreadystatechange = function() {
      if (script.readyState == "loaded" ||
        script.readyState == "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else { //Others
    script.onload = function() {
      callback();
    };
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
}

loadScript("http://bestmike007.com/gbk-lite/lib/gbk-lite.min.js", function() {
  // do something with GBK.
});
```

### Examples

Encode Unicode string into bytes:

```js
var bytes = GBK.toBytes(GBK.fromString("你好，中国！"));
```

Export csv for office that read csv using gbk as default character set:

```js
var content = '"utf8str",string with ","phone",number,decimal\n' +
              '"=""你好，中国！""","=""1,2,3,""&CHAR(34)&""4""&CHAR(34)","=""13800138000""",123,1.23';
// In browser which support data url.
var dataUrl = "data:text/csv;charset=gbk;base64," + GBK.toBase64(GBK.fromString(content));
// In browser that support blob url.
var blobUrl = GBK.toDataUrl(GBK.fromString(content), 'text/csv;charset=gbk');
// In browser that support setting the default filename for data url or blob url, e.g. Chrome, Firefox.
var link = $(`<a download="data-gbk.csv" target="_blank" style="display:none">Export CSV in GBK</a>`).attr('href', dataUrl || bloblUrl).appendTo('body');
link[0].click();
link.remove();
```

### License

MIT
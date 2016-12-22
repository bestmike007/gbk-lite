(function () {
  var CP936 = "[CP936CODES]";
  var g2u = {}, u2g = {}, currentCode = parseInt(CP936.substr(0, 4), 16), cursor = 4;
  while (cursor < CP936.length) {
    var c = CP936.charCodeAt(cursor);
    if (c > 128) {
      u2g[String.fromCharCode(currentCode)] = String.fromCharCode(c);
      g2u[String.fromCharCode(c)] = String.fromCharCode(currentCode);
      cursor++;
      currentCode++;
    } else {
      currentCode = parseInt(CP936.substr(cursor, 4), 16);
      cursor += 4;
    }
  }
  u2g["¦"] = "|";
  u2g["ª"] = "a";
  u2g['­'] = "-";
  u2g["²"] = "2";
  u2g["³"] = "3";
  u2g["¹"] = "1";
  u2g["º"] = "o";
  u2g["Ð"] = "D";
  u2g["Ý"] = "Y";
  u2g["Þ"] = "T";
  u2g["â"] = "a";
  u2g["ð"] = "e";
  u2g["ý"] = "y";
  u2g["þ"] = "t";
  window.GBK = {};
  GBK.toString = function (gbk) {
    var unicode = "";
    for (var i = 0; i < gbk.length; i++) {
      var c = gbk.charAt(i);
      unicode += g2u[c] || c;
    }
    return unicode;
  };
  GBK.fromString = function (unicode) {
    var gbk = "";
    for (var i = 0; i < unicode.length; i++) {
      var c = unicode.charAt(i);
      gbk += u2g[c] || c;
    }
    return gbk;
  };
  GBK.toBytes = function (gbk) {
    var bytes = [];
    for (var i = 0; i < gbk.length; i++) {
      var code = gbk.charCodeAt(i);
      if (code > 0xffffff) throw new Error("String contains an invalid character: " + String.fromCharCode(code));
      if (code > 0xffff) {
        bytes.push(code >> 16, code & 0xff00 >> 8, code & 0xff);
      } else if (code > 0xff) {
        bytes.push(code >> 8, code & 0xff);
      } else {
        bytes.push(code);
      }
    }
    return bytes;
  };
  GBK.toHex = function (gbk) {
    return GBK.toBytes(gbk).map(function (byte) { return byte.toString(16); }).join("");
  }
  var BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split('');
  GBK.toBase64 = function (gbk) {
    var bytes = GBK.toBytes(gbk);
    for (var i = 0, j = 0, len = bytes.length / 3, base64 = []; i < len; ++i) {
      var a = bytes[j++], b = bytes[j++], c = bytes[j++];
      base64[base64.length] = BASE64[a >> 2] + BASE64[((a << 4) & 63) | (b >> 4)] +
        (isNaN(b) ? "=" : BASE64[((b << 2) & 63) | (c >> 6)]) +
        (isNaN(b + c) ? "=" : BASE64[c & 63]);
    }
    return base64.join("");
  }
  GBK.toDataUrl = function (gbk, type) {
    var bytes = GBK.toBytes(gbk);
    var buffer = new ArrayBuffer(bytes.length);
    var view = new Int8Array(buffer);
    for (var i = 0; i < bytes.length; i++) view[i] = bytes[i];
    var blob = new Blob([buffer], { type: type });
    return URL.createObjectURL(blob);
  }
})();
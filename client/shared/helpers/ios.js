export class IOS {
  static compVersions(a, b) {
    let i, diff;
    let regExStrip0 = /(\.0+)+$/;
    let segmentsA = a.replace(regExStrip0, '').split('.');
    let segmentsB = b.replace(regExStrip0, '').split('.');
    let l = Math.min(segmentsA.length, segmentsB.length);

    for (i = 0; i < l; i++) {
      diff = parseInt(segmentsA[i], 10) - parseInt(segmentsB[i], 10);
      if (diff) {
        return diff;
      }
    }
    return segmentsA.length - segmentsB.length;
  }

  static clientVersionHeaderNames = ['X-Firmware','x-firmware', 'HTTP_X_FIRMWARE'];

  static clientVersionForHeaders(headers) {
    for (let headerName of IOS.clientVersionHeaderNames) {
      if (headers[headerName] && headers[headerName].length > 0) {
        return headers[headerName].toLowerCase();
      }
    }

    if (/iP(hone|od|ad)/.test(headers['user-agent'])) {
      // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
      let v = String(headers['user-agent']).match(/OS (\d+)_(\d+)_?(\d+)? like/i);
      let version = [];
      if (v.length >= 2) { version[0] = parseInt(v[1]) }
      else return '';

      if (v.length >= 3) { version[1] = parseInt(v[2] || "0") }
      else { version[1] = 0 }

      if (v.length >= 4) { version[2] = parseInt(v[3] || "0") }
      else { version[2] = 0 }

      return version[0] + "." + version[1] + "." + version[2];
    }
    return '';
  };
}

'use strict';

module.exports = function(data) {
  return '<html><head><link rel="stylesheet" type="text/css" href="/assets/css/device-link.css" /></head>' +
    '</head><body><a href="' +
    data['linkURL'] +
    '"><button class="link-button">Link Device</button></a></body></html>';
};

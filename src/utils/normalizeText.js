const unorm = require('unorm');

String.prototype.normalize = function () {
    return unorm.nfkd(this).replace(/[\u0300-\u036F]/g, '').toLowerCase();
};
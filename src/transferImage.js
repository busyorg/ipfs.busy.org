const { promisifyAll } = require('bluebird');
const gm = require('gm');
const { MAX_IMAGE_DIMENSION } = require('./constants');

promisifyAll(gm.prototype);

async function transferImage(input) {
  return await gm(input)
    .resize(MAX_IMAGE_DIMENSION, MAX_IMAGE_DIMENSION, '>')
    .toBufferAsync();
}

module.exports = transferImage;

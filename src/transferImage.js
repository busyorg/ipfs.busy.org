const gifsicle = require('gifsicle');
const gm = require('gm');
const { promisify, promisifyAll } = require('bluebird');
const { execFile } = require('child_process');
const { readFile } = require('fs');
const { MAX_IMAGE_DIMENSION } = require('./constants');

const execFileAsync = promisify(execFile);
const readFileAsync = promisify(readFile);
promisifyAll(gm.prototype);

async function transferImage(file) {
  if (file.type === 'image/svg+xml') {
    return await readFileAsync(file.path);
  } else if (file.type === 'image/gif') {
    const outputFile = `${file.path}.tmp`;
    await execFileAsync(gifsicle, ['-o', outputFile, file.path]);
    return await readFileAsync(outputFile);
  }

  return await gm(file.path)
    .resize(MAX_IMAGE_DIMENSION, MAX_IMAGE_DIMENSION, '>')
    .toBufferAsync();
}

module.exports = transferImage;

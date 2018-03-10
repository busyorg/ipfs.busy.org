const fs = require('fs');
const util = require('util');
const express = require('express');
const compression = require('compression');
const multipart = require('connect-multiparty');
const debug = require('debug')('http');
const transferImage = require('./transferImage');
const uploadAndPin = require('./uploadAndPin');
const { MAX_FILE_SIZE } = require('./constants');

const readFile = util.promisify(fs.readFile);

const app = express();
const multipartMiddleware = multipart();

app.use(compression());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.post('/upload', multipartMiddleware, async (req, res) => {
  try {
    const { file } = req.files;

    if (file.size >= MAX_FILE_SIZE) {
      return res.status(413).json({ error: 'PAYLOAD_TOO_LARGE' });
    }

    if (!file.type.match('image/.*')) {
      return res.status(415).json({ error: 'UNSUPPORTED_MEDIA_TYPE' });
    }

    const buffer =
      file.type === 'image/gif' ? await readFile(file.path) : await transferImage(file.path);

    const hash = await uploadAndPin(buffer);

    return res.json({
      name: file.name,
      url: `http://localhost:8080/ipfs/${hash}`,
      hash,
    });
  } catch (err) {
    debug('Error occured during processing /upload', err);
    return res.status(501).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
});

const port = process.env.PORT || 4000;
app.listen(port);

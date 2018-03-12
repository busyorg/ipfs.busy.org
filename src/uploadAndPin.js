const ipfsAPI = require('ipfs-api');

const ipfsHost = process.env.IPFS_HOST || 'localhost';

const ipfs = ipfsAPI(ipfsHost, 5001);

async function uploadAndPin(buffer) {
  const resp = await ipfs.files.add(buffer);

  const hash = resp[0].hash;

  await ipfs.pin.add(hash);

  return hash;
}

module.exports = uploadAndPin;

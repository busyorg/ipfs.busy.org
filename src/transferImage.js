async function transferImage(input) {
  return await sharp(input)
    .resize(MAX_IMAGE_DIMENSION, MAX_IMAGE_DIMENSION)
    .max()
    .withoutEnlargement()
    .jpeg()
    .toBuffer();
}

module.exports = transferImage;

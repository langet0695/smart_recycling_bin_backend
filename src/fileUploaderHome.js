// Upload code adapted from https://dev.to/foqc/uploading-images-to-aws-s3-with-serverless-1ae0
// Change a couple functions and fixed a few bugs that existed in the base code

"use strict";

const AWS = require("aws-sdk");
const { v4: uuidv4 } = require('uuid');
const Jimp = require("jimp");
const s3 = new AWS.S3();
const formParser = require("./formParser");

const bucket = process.env.Bucket;
const MAX_SIZE = 2500000; //2.5MB

const PNG_MIME_TYPE = "image/png";
const JPEG_MIME_TYPE = "image/jpeg";
const JPG_MIME_TYPE = "image/jpg";

const MIME_TYPES = [PNG_MIME_TYPE, JPEG_MIME_TYPE, JPG_MIME_TYPE];

module.exports.handler = async event => {
  try {
    const formData = await formParser.parser(event, MAX_SIZE);
    const file = formData.files[0];

    if (!isAllowedFile(file.content.byteLength, file.contentType))
      getErrorMessage("File size or type not allowed");

    const uid = uuidv4();

    const originalKey = `${uid}_original_${file.filename}`;

    const fileResizedBuffer = await resize(
      file.content,
      file.contentType,
      460
    );

    const originalFile = await uploadToS3(bucket, originalKey, file.content, file.contentType);

    const signedOriginalUrl = s3.getSignedUrl("getObject", {
      Bucket: originalFile.Bucket,
      Key: originalKey,
      Expires: 60000
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        id: uid,
        mimeType: file.contentType,
        originalKey: originalFile.key,
        bucket: originalFile.Bucket,
        fileName: file.filename,
        originalUrl: signedOriginalUrl,
        originalSize: file.content.byteLength
      })
    };
  } catch (e) {
    return getErrorMessage(e.message);
  }
};

const getErrorMessage = message => ({
  statusCode: 500,
  body: JSON.stringify({
    message
  })
});

const isAllowedSize = size => size <= MAX_SIZE;

const isAllowedMimeType = mimeType =>
  MIME_TYPES.find(type => type === mimeType);

const isAllowedFile = (size, mimeType) =>
  isAllowedSize(size) && isAllowedMimeType(mimeType);

const uploadToS3 = (bucket, key, buffer, mimeType) =>
  new Promise((resolve, reject) => {
    s3.upload(
      {
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: mimeType
      },
      function(err, data) {
        if (err) reject(err);
        resolve(data);
      }
    );
  });

const resize = (buffer, mimeType, width) =>
  new Promise((resolve, reject) => {
    Jimp
      .read(buffer)
      .then(image => image.resize(width, Jimp.AUTO).quality(70).getBufferAsync(mimeType))
      .then(resizedBuffer => resolve(resizedBuffer))
      .catch(error => reject(error));
  });
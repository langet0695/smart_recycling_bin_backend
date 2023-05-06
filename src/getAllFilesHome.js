'use strict';

const AWS = require("aws-sdk");
const s3 = new AWS.S3();

module.exports.handler = async (event, context) => {

  let files = [];

  let params = {
    Bucket: process.env.BUCKET,
    Prefix: 'upload'
  };

  let result = await s3.listObjectsV2(params).promise();

  let data = result.Contents;
  Object.keys(data).forEach((key, index) => {

    let fileObject = data[key];

    files.push(`https://${result.Name}.s3.us-east-2.amazonaws.com/${fileObject.Key}`);
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      files: files,
      bucketName: `${result.Name}`,
      subFolder: `${result.Prefix}`,
    }, null, 2),
  };
};

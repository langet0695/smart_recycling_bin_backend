'use strict';

//FIRST
const AWS = require("aws-sdk");
//SECOND
const rekognition = new AWS.Rekognition(
{ apiVersion: "2016-06-27" }
);
const s3 = new AWS.S3();

module.exports.healthCheck = async (event, context) => {
  const response =  {
    statusCode: 200,
    body: JSON.stringify("Success")
  };
  return response
};

module.exports.getAllFiles = async (event, context) => {

  let files = [];

  let params = {
    Bucket: process.env.BUCKET, /* required */
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

module.exports.uploadFile = async (event, context) => {

  let request = event.body;
  // console.info("EVENT\n" + JSON.stringify(event, null, 2));
  let jsonData = JSON.parse(request);
  let base64String = jsonData.base64String;
  let buffer = Buffer.from(base64String, 'base64');
  let fileMime = fileType(buffer);

  if (fileMime == null) {
    return context.fail('The string supplied is not a file type.');
  }

  let file = getFile(fileMime, buffer); 
//Extract file info in getFile
//File.params would have
//{'params': params,uploadFile': uploadFile};
  let params = file.params;

  let result = await s3.putObject(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      url: `${file.uploadFile.full_path}`,
    }, null, 2),
  };
};

module.exports.detectFace = async (event, context) => {

  let request = event.body;

  let jsonData = JSON.parse(request);

  let imageToDetect = jsonData.fileName;

  let faceDetectionParams = {
    Image: {
      S3Object: {
        Bucket: process.env.BUCKET,
        Name: imageToDetect
      }
    },
  };

  let faceResult = await rekognition.detectFaces(faceDetectionParams).promise();

  let details = faceResult.FaceDetails;

  return {
    statusCode: 200,
    body: JSON.stringify({
      details: details,
    }, null, 2),
  };

};

module.exports.detectLabel = async (event, context) => {

  let request = event.body;

  let jsonData = JSON.parse(request);

  let imageToDetect = jsonData.fileName;

  let labelDetectionParams = {
    Image: {
      S3Object: {
        Bucket: process.env.BUCKET,
        Name: imageToDetect
      }
    },
    MaxLabels: 123, 
    MinConfidence: 70
  };

  let labelResult = await rekognition.detectLabels(labelDetectionParams).promise();

  let labels = labelResult.Labels;


  return {
    statusCode: 200,
    body: JSON.stringify({
      details: labels
    }, null, 2),
  };

};


module.exports.uploadImg = async (event, context) => {

  let request = event.body;

  params = {
    Bucket: process.env.BUCKET,
    Key: "hello-s3.txt",
    Body: "Hello S3!",
  }
  let result = await s3.putObject(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify("Success"),
  };
};
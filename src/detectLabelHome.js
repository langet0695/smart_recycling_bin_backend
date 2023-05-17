'use strict';

const AWS = require("aws-sdk");
const rekognition = new AWS.Rekognition(
{ apiVersion: "2016-06-27" }
);
const labelAnalyzer = require("./labelAnalyzer");

module.exports.handler = async (event, context) => {

  let request = event.body;
  console.log(event);
  // Create a buffer from the string
  let bufferObj = Buffer.from(request, "base64");

  let decodedRequest = bufferObj.toString("utf8");
  let jsonData = JSON.parse(decodedRequest);

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

  const output = await labelAnalyzer.analyzer(labels);

  return {
    statusCode: 200,
    body: JSON.stringify(output, null, 2),
  };

};

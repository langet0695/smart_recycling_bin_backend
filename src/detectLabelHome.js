'use strict';

const AWS = require("aws-sdk");
const rekognition = new AWS.Rekognition(
{ apiVersion: "2016-06-27" }
);

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

  //TODO: Write and insert method to interpret an analyze label result to assess recyclability

  let labels = labelResult.Labels;


  return {
    statusCode: 200,
    body: JSON.stringify({
      details: labels
    }, null, 2),
  };

};
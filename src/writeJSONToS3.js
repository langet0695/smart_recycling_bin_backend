'use strict';

const AWS = require("aws-sdk");
const s3 = new AWS.S3();

module.exports.s3JSONWriter = (filename, content, prefix) => {

    const body = Buffer.from(JSON.stringify(content));

    let file = filename;
    let filename_arr = filename.split('/');

    if (filename_arr[0] == 'upload'){
        filename_arr.shift();
        file = filename_arr.join('/');
    };

    console.log(file);

    const data = {
        Bucket: 'smart-recycling-bin-images/' + prefix,
        Key: file + '#' + '.json',
        Body: body,
        ContentEncoding: 'base64',
        ContentType: 'application/json'
    };

    console.log(data);

    new Promise((resolve, reject) => {
        s3.upload(
          data,
          function(err, data) {
            if (err) reject(err);
            resolve(data);
          }
        );
    });
};
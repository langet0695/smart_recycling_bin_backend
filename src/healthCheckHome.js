'use strict';

module.exports.handler = async (event, context) => {
  const response =  {
    statusCode: 200,
    body: JSON.stringify("Success")
  };
  return response
};

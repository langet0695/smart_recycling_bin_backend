//import your handler file or main file of Lambda
//let handler = require('./src/detectLabelHome.js');
let handler = require('./src/writeJSONToS3.js');

//Call your exports function with required params
//In AWS lambda these are event, content, and callback
//event and content are JSON object and callback is a function
//In my example i'm using empty JSON
//handler.handler( JSON.stringify({"fileName": "upload/598dc9e1-3ed9-42dc-80f9-adacf3fc37ac_original_bottle_on_ground.png"}), //event
//    {}, //content
//    function(data,ss) {  //callback function with two arguments
//        console.log(data);
//    });

const filename = 'upload/598dc9e1-3ed9-42dc-80f9-adacf3fc37ac_original_bottle_on_ground.png';
const content = {
    "is_recyclable": true,
    "item_type": "plastic_bottle",
    "confidence_score": 95.19456481933594,
    "instances": []
};
const prefix = 'analyzedLabelResponse'

handler.s3JSONWriter(filename, content, prefix);
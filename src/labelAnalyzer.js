// Create constants of valid labels to be searched for
const valid_item_labels = new Set(["can", "bottle"]);
const valid_material_labels = new Set(["plastic", "aluminum", "metal", "glass"]);


module.exports.analyzer = (labels) => {
// Initiate valid elements to null
    let valid_item = null
    let valid_material = null

// Iterate over each label and operate
    for (let i = 0; i < labels.length; i++){
        let label = JSON.stringify(labels[i]["Name"]).toLowerCase();
        label_elements = label.slice(1,label.length-1).split(' ');

// Within each element check to see if it is valid
        for (let j=0; j<label_elements.length; j++){
            let label_element =  label_elements[j];
            if (valid_item_labels.has(label_element)) {
                valid_item = {
                    "Name": label_element,
                    "Confidence": labels[i]["Confidence"],
                    "Instances": labels[i]["Instances"]
                }
            }
            else if (valid_material_labels.has(label_element)) {
                valid_material = {
                    "Name": label_element,
                    "Confidence": labels[i]["Confidence"],
                    "Instances": labels[i]["Instances"]
                }
            }
        }
    }

// Construct a response for the api
    let response = {}

    if (valid_item && valid_material) {
        let item_type = ''.concat(valid_material["Name"], "_", valid_item["Name"]);
        let confidence_score = valid_material["Confidence"] < valid_item["Confidence"] ? valid_material["Confidence"] : valid_item["Confidence"]
        let instances = valid_item["Instances"]

        response = {
               "is_recyclable": true,
               "item_type": item_type,
               "confidence_score": confidence_score,
               "instances": instances
            };
    }
    else if (valid_item) {
        let item_type = valid_item["Name"];
        let confidence_score = valid_item["Confidence"]
        let instances = valid_item["Instances"]

        response = {
               "is_recyclable": true,
               "item_type": item_type,
               "confidence_score": confidence_score,
               "instances": instances
            };
    }
    else {
        response = {
               "is_recyclable": false,
               "item_type": null,
               "confidence_score": 100,
               "instances": []
            };
    }
    return response;
};

const ObjectId = require('bson').ObjectId;

const hydrateProperties = (obj, props, data) => {
    const keys = Object.keys(props);

    keys.forEach(key => {
        obj[key] = data[key] || null
    });
};

function ClassModelWrapper(properties) {

    function ClassModel(sourceObject) {
        sourceObject = sourceObject || {};

        if(!sourceObject._id) {
            sourceObject._id = new ObjectId();
        }
        hydrateProperties(this, properties, sourceObject);

    }

    ClassModel.prototype.toJS = function() {
        const jsObject = {};
        hydrateProperties(jsObject, properties, this);
        return jsObject;
    };

    return ClassModel;
}

module.exports = ClassModelWrapper;
const ObjectId = require('bson').ObjectId;

class ClassModel {
    constructor(sourceObject) {
        sourceObject = sourceObject || {};

        if (!sourceObject._id) {
            sourceObject._id = new ObjectId();
        }
        this._hydrateProperties(this, sourceObject);
    }

    toJS() {
        const jsObject = {};
        this._hydrateProperties(jsObject, this);
        return jsObject;
    }

    _hydrateProperties (obj, data)  {
        const properties = this._getProperties();
        const keys = Object.keys(properties);

        keys.forEach(key => {
            obj[key] = data[key] || null
        });
    }

    _getProperties() {
        return {
            _id: 0
        };
    }
}

module.exports = ClassModel;
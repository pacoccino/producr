const ObjectId = require('bson').ObjectId;

const normalizeId = (object) => {
    if(object && object["_id"]) {
        object["_id"] = ObjectId(object["_id"]);
    }
};

class DBModel {
    constructor(model, collection) {
        this._model = model;
        this._collection = collection;
    }

    _insert(data) {
        return this._collection.insert(data)
            .then(results => {
                return results.ops.map(this._model);
            });
    }

    insert(obj) {
        obj = this._model(obj);
        obj = obj.toJS();

        return this._insert(obj)
            .then(results => results[0]);
    }

    insertMultiple(array) {
        array = array.map(this._model);
        array = array.map(obj => obj.toJS());

        return this._insert(array);
    }

    _update(query, data) {
        return this._collection
            .updateOne(query, data);
    }

    update(obj) {
        const jsUser = obj.toJS();
        jsUser._id = ObjectId(jsUser._id);
        const query = {_id: jsUser._id};

        return this._update(query, jsUser)
            .then(() => {
                return this._model(obj);
            });
    }

    updateField(obj, field) {
        const objectId = ObjectId(obj._id);
        const query = {_id: objectId};
        const updateObject = {
            "$set": {}
        };
        updateObject["$set"] = {};
        updateObject["$set"][field] = obj[field];

        return this._update(query, updateObject)
            .then(() => {
                return this._model(obj);
            });
    }
    updateFields(obj, fields) {
        const objectId = ObjectId(obj._id);
        const query = {_id: objectId};
        const updateObject = {
            "$set": {}
        };
        updateObject["$set"] = fields;

        return this._update(query, updateObject)
            .then(() => {
                return this._model(obj);
            });
    }
    _updateOperation(obj, operation, data) {
        const objectId = ObjectId(obj._id);
        const query = {_id: objectId};

        const updateObject = {};
        updateObject[operation] = data;

        return this._update(query, updateObject);
    }

    incField(obj, data) {
        return this._updateOperation(obj, '$inc', data)
            .then(() => {
                return this._model(obj);
            });
    }

    getById(_id, customField) {

        const query = {};
        if(customField) {
            query[customField] = _id;
        } else {
            query["_id"] = _id;
        }
        normalizeId(query);

        return this.findOne(query);
    }

    find(query, options) {
        normalizeId(query);
        options = options || {};
        const { limit = 0, skip = 0, sort = null } = options;

        return this._collection.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .toArray()
            .then(array => array.map(this._model));
    }
    findOne(query) {
        normalizeId(query);

        return new Promise((resolve, reject) => {
            this._collection.findOne(query)
                .then(obj => {
                    if(obj) {
                        const objInstance = this._model(obj);
                        resolve(objInstance);
                    } else {
                        resolve(null);
                    }
                }).catch(reject);
        });
    }

    remove(obj) {
        const objId = ObjectId(obj._id);
        const query = {
            _id: objId
        };
        return this._collection.deleteOne(query);
    }
}

module.exports = DBModel;

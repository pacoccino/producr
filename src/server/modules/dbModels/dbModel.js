const ObjectId = require('bson').ObjectId;

class DBModel {
    constructor(model, collection) {
        this._model = model;
        this._collection = collection;
    }

    create(obj) {
        obj = this._model(obj);
        obj = obj.toJS();

        return this._collection.insert(obj)
            .then(results => {
                return this._model(results.ops[0]);
            });
    }

    update(obj) {
        const jsUser = obj.toJS();
        jsUser._id = ObjectId(jsUser._id);

        return this._collection
            .updateOne({_id: jsUser._id}, jsUser)
            .then(() => {
                return this._model(obj);
            });
    }

    getById(_id, customField) {

        const query = {};
        if(customField) {
            query[customField] = _id;
        } else {
            query["_id"] = ObjectId(_id);
        }

        return new Promise((resolve, reject) => {
            this._collection
                .findOne(query)
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

    find(query, options) {
        return this._collection.find(query, options)
            .toArray()
            .then(array => array.map(this._model));
    }
    findOne(query, options) {
        return this._collection.findOne(query, options)
            .then(this._model);
    }
}

// TODO
/*
 DBModel.prototype.delete = function(userId) {
 return new Promise((resolve, reject) => {
 if(!userId) reject("Delete user error: no userId provided");

 CacheWrapper.delete(USR_PREFIX + userId)
 .then(resolve, reject);
 });
 };*/

module.exports = DBModel;

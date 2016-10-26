const ObjectId = require('bson').ObjectId;

class DBModel {
    constructor(model, collection) {
        this._model = model;
        this._collection = collection;
    }

    create(obj) {
        obj = new this._model(obj);
        obj = obj.toJS();

        return this._collection.insert(obj)
            .then(results => {
                return new this._model(results.ops[0]);
            });
    }

    update(obj) {
        const jsUser = obj.toJS();
        jsUser._id = ObjectId(jsUser._id);

        return this._collection
            .updateOne({_id: jsUser._id}, jsUser)
            .then(() => {
                return new this._model(obj);
            });
    }

    getById(_id, customField) {

        const query = {};
        _id = ObjectId(_id);
        if(customField) {
            query[customField] = _id;
        } else {
            query["_id"] = _id;
        }

        return new Promise((resolve, reject) => {
            this._collection
                .findOne(query)
                .then(obj => {
                    if(obj) {
                        resolve(new this._model(obj));
                    } else {
                        resolve(null);
                    }
                }).catch(reject);
        });
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

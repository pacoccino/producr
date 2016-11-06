const ObjectId = require('bson').ObjectId;

const normalizeId = (object) => {
    if(object && object["_id"]) {
        object["_id"] = ObjectId(object["_id"]);
    }
};

class DBModel {
    constructor(Model, collection) {
        if(!Model || !collection) {
            throw "DBModel must be instanciated with model and collection";
        }
        this._model = Model;
        this._collection = collection;
        this._convertObjectToModel = this._convertObjectToModel.bind(this);
    }

    _convertObjectToModel(object) {
        if(object instanceof this._model) {
            return object;
        } else {
            return new this._model(object);
        }
    }

    _insert(data) {
        return this._collection.insert(data)
            .then(results => {
                return results.ops.map(this._convertObjectToModel);
            });
    }

    insert(obj) {
        obj = this._convertObjectToModel(obj);
        const jsObject = obj.toJS();

        return this._insert(jsObject)
            .then(results => results[0]);
    }

    insertMultiple(array) {
        array = array.map(this._convertObjectToModel);
        const jsArray = array.map(obj => obj.toJS());

        return this._insert(jsArray);
    }

    _update(query, data) {
        return this._collection
            .updateOne(query, data);
    }

    update(obj) {
        obj = this._convertObjectToModel(obj);

        const jsUser = obj.toJS();
        jsUser._id = ObjectId(jsUser._id); // ??

        const query = {_id: jsUser._id};
        normalizeId(query);

        return this._update(query, jsUser)
            .then(() => {
                return this.obj(obj);
            });
    }

    updateField(obj, field) {
        obj = this._convertObjectToModel(obj);

        const fieldUpdate = {};
        fieldUpdate[field] = obj[field];

        return this.updateFields(obj, fieldUpdate);

    }
    updateFields(obj, fields) {
        // TODO Il y a un probleme quand on file des clés valeurs a update, l'objet retourné n'est pas update. Marche avec le field parceque l'objet est deja bon
        return this._updateOperation(obj, "$set", fields);
    }

    _updateOperation(obj, operation, data) {
        obj = this._convertObjectToModel(obj);

        const query = {_id: obj._id};
        normalizeId(query);

        const updateObject = {};
        updateObject[operation] = data;

        return this._update(query, updateObject)
            .then(() => {
                return obj;
            });
    }

    incField(obj, data) {
        return this._updateOperation(obj, '$inc', data);
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
            .then(array => array.map(this._convertObjectToModel));
    }
    findOne(query) {
        normalizeId(query);

        return new Promise((resolve, reject) => {
            this._collection.findOne(query)
                .then(obj => {
                    if(obj) {
                        const objInstance = this._convertObjectToModel(obj);
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

import test from 'ava';

import DBModel from '../../src/server/modules/dbModels/dbModel';

const mockModel = function(obj) {
    const copy = Object.assign({}, obj);
    copy.toJS = function() {return copy;};

    return copy;
};

const mockCollection = {
    insert: (data) => {
        return Promise.resolve({
            ops: [
                data
            ]
        });
    }
};

test('constructor', t => {

    const dbModel = new DBModel("a", "b");

    t.is(dbModel._model, "a");
    t.is(dbModel._collection, "b");
});

test('_insert', t => {
    return new Promise((resolve, reject) => {

        const dbModel = new DBModel(mockModel, mockCollection);

        const data = {a:1};
        dbModel._insert(data).then(inserteds => {
            t.not(data, inserteds[0]);
            t.is(inserteds[0].a, 1);
            resolve();
        })
            .catch(reject);
    });
});

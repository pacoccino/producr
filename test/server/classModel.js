import test from 'ava';
import {ObjectId} from 'bson';

import ClassModel from '../../src/common/classModels/classModel';

test('constructor from undefined', t => {

    const instance = new ClassModel();

    t.not(instance._id, null);
    t.is(instance._id instanceof ObjectId, true);
});

test('constructor from with id', t => {

    const initObject = {
        _id: new ObjectId()
    };

    const instance = new ClassModel(initObject);

    t.not(instance._id, null);
    t.is(instance._id, initObject._id);
});


test('toJS', t => {

    const instance = new ClassModel();
    instance.caca = "caca";

    const jsObject = instance.toJS();

    t.is(jsObject._id instanceof ObjectId, true);
    t.is(jsObject.caca, undefined);
    t.is(jsObject.toJS, undefined);
    t.is(jsObject._hydrateProperties, undefined);
});
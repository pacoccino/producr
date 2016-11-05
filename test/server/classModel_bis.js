import test from 'ava';
import {ObjectId} from 'bson';

import ClassModel from '../../src/common/classModels/classModel_bis';


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

test('extend class', t => {

    class exClass extends ClassModel  {
        _getProperties() {
            return {
                _id: 0,
                a: 0,
                b: 0
            };
        }

        extMethod(c) {
            this.c = c;
        }
    }
    const initObject = {
        a: "a",
        b: "b"
    };

    const instance = new exClass(initObject);

    instance.extMethod("c");

    t.is(instance.a, "a");
    t.is(instance.b, "b");
    t.is(instance.c, "c");
});

test('extend class with super constructor', t => {

    class exClass extends ClassModel  {

        _getProperties() {
            return {
                _id: 0,
                a: 0,
                b: 0
            };
        }

        constructor(obj) {
            super(obj);
            this.c = "c";
        }
    }
    const initObject = {
        a: "a",
        b: "b"
    };

    const instance = new exClass(initObject);

    t.is(instance.a, "a");
    t.is(instance.b, "b");
    t.is(instance.c, "c");
});

import test from 'ava';
import {ObjectId} from 'bson';

import ClassModelWrapper from '../../src/common/classModels/classModel';

test('constructor', t => {

    const properties = {
        _id: 0,
        a: 0,
        b: 0
    };

    const initObject = {
        a: "a",
        b: "b"
    };

    const ClassModel = new ClassModelWrapper(properties);

    const instance = new ClassModel(initObject);

    t.not(instance._id, null);
    t.is(instance._id instanceof ObjectId, true);
    t.is(instance.a, "a");
    t.is(instance.b, "b");
});

test('constructor from with id', t => {

    const properties = {
        _id: 0,
        a: 0,
        b: 0
    };

    const initObject = {
        _id: new ObjectId(),
        a: "a",
        b: "b"
    };

    const ClassModel = new ClassModelWrapper(properties);

    const instance = new ClassModel(initObject);

    t.not(instance._id, null);
    t.is(instance._id, initObject._id);
    t.is(instance.a, "a");
    t.is(instance.b, "b");
});

test('constructor from undefined', t => {

    const properties = {
        _id: 0,
        a: 0,
        b: 0
    };

    const ClassModel = new ClassModelWrapper(properties);

    const instance = new ClassModel();

    t.not(instance._id, null);
    t.is(instance._id instanceof ObjectId, true);
    t.is(instance.a, null);
    t.is(instance.b, null);
});

test('add prototypes', t => {

    const properties = {
        _id: 0,
        a: 0,
        b: 0
    };

    const initObject = {
        a: "a",
        b: "b"
    };

    const ClassModel = new ClassModelWrapper(properties);
    ClassModel.prototype.test = function(c) {
        this.c = c
    };

    const instance = new ClassModel(initObject);

    instance.test("c");

    t.is(instance.a, "a");
    t.is(instance.b, "b");
    t.is(instance.c, "c");
});

test('reimplement constructor', t => {

    const properties = {
        _id: 0,
        a: 0,
        b: 0,
        over: 0
    };

    const initObject = {
        a: "a",
        b: "b"
    };

    const ClassModel = new ClassModelWrapper(properties);

    const OverClassModel = function(obj) {
        obj.over = "over";
        return ClassModel(obj);
    };
    const instance = new OverClassModel(initObject);

    t.is(instance.a, "a");
    t.is(instance.b, "b");
    t.is(instance.over, "over");
});

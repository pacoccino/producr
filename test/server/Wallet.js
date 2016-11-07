import test from 'ava';
import {ObjectId} from 'bson';

import Wallet from '../../src/common/classModels/Wallet';

test('constructor from undefined', t => {

    const instance = new Wallet();

    t.not(instance._id, null);
    t.is(instance._id instanceof ObjectId, true);
    t.is(instance.balance, 0);
    t.not(instance.whatever, null);
});

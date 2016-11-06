import test from 'ava';
import {ObjectId} from 'bson';

import HistoryPLay from '../../src/common/classModels/HistoryPlay';

test('constructor from undefined', t => {

    const instance = new HistoryPLay();

    t.not(instance._id, null);
    t.is(instance._id instanceof ObjectId, true);
    t.is(instance.track, null);
    t.is(instance.artist, null);
    t.is(instance.player, null);
    t.is(instance.played_at, null);
    t.is(instance.played_duration, null);
    t.is(instance.played_state, null);
    t.is(instance.transaction_id, null);
    t.not(instance.whatever, null);
});

test('set played_state if played_duration is defined at construction', t => {

    const initObject = {
        played_duration: 15
    };

    const instance = new HistoryPLay(initObject);

    t.is(instance.played_duration, 15);
    t.is(instance.played_state, HistoryPLay.ListenedStates.LISTENED);
});

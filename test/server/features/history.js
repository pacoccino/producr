import test from 'ava';

import History from '../../../src/server/modules/features/history';
import HistoryModel from '../../../src/common/classModels/HistoryPlay';

const histMock = [
    {
        urn: 'foakfe',
        played_at: 50000,
        track: {duration: 1000}
    },
    {
        urn: 'dezfez',
        played_at: 40000,
        track: {duration: 1000}
    },
    {
        urn: 'fsdf',
        played_at: 20000,
        track: {duration: 1000}
    },
    {
        urn: 'foakfezfzefe',
        played_at: 15000,
        track: {duration: 1000}
    }
].map(play => new HistoryModel(play));

// TODO test OVERTRACK

test('computeDifference', t => {
    let histDiffed = History.computeDiff(histMock);

    t.is(histDiffed[0].played_duration, null);
    t.is(histDiffed[1].played_duration, 10);
    t.is(histDiffed[2].played_duration, 20);
    t.is(histDiffed[3].played_duration, 5);
});

test('getListenedState', t => {
    let histDiffed = History.computeDiff(histMock);

    t.is(histDiffed[0].getListenedState(), HistoryModel.ListenedStates.LISTENING);
    t.is(histDiffed[1].getListenedState(), HistoryModel.ListenedStates.LISTENED);
    t.is(histDiffed[2].getListenedState(), HistoryModel.ListenedStates.LISTENED);
    t.is(histDiffed[3].getListenedState(), HistoryModel.ListenedStates.SKIPPED);
});

test('setListenedState', t => {
    let histDiffed = History.computeDiff(histMock);
    histDiffed = History.setListenedState(histDiffed);

    t.is(histDiffed[0].played_state, HistoryModel.ListenedStates.LISTENING);
    t.is(histDiffed[1].played_state, HistoryModel.ListenedStates.LISTENED);
    t.is(histDiffed[2].played_state, HistoryModel.ListenedStates.LISTENED);
    t.is(histDiffed[3].played_state, HistoryModel.ListenedStates.SKIPPED);
});

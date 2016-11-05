import test from 'ava';

import History from '../../../src/server/modules/features/history';

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
];

// TODO test OVERTRACK

test('computeDifference', t => {
    let histDiffed = History.computeDiff(histMock);

    t.is(histDiffed[0].played_duration, null);
    t.is(histDiffed[1].played_duration, 10);
    t.is(histDiffed[2].played_duration, 20);
    t.is(histDiffed[3].played_duration, 5);
});

test('getListenedState', t => {
    t.is(History.getListenedState({played_duration: null, track: {duration: 1000}}), History.ListenedStates.LISTENING);
    t.is(History.getListenedState({played_duration: 0,    track: {duration: 1000}}), History.ListenedStates.SKIPPED);
    t.is(History.getListenedState({played_duration: 5,    track: {duration: 1000}}), History.ListenedStates.SKIPPED);
    t.is(History.getListenedState({played_duration: 20,   track: {duration: 1000}}), History.ListenedStates.LISTENED);
    t.is(History.getListenedState({played_duration: 200,  track: {duration: 1000}}), History.ListenedStates.LISTENED);
});

test('setListenedState', t => {
    let histDiffed = History.computeDiff(histMock);
    histDiffed = History.setListenedState(histDiffed);

    t.is(histDiffed[0].played_state, History.ListenedStates.LISTENING);
    t.is(histDiffed[1].played_state, History.ListenedStates.LISTENED);
    t.is(histDiffed[2].played_state, History.ListenedStates.LISTENED);
    t.is(histDiffed[3].played_state, History.ListenedStates.SKIPPED);
});

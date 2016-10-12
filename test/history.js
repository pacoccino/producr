import test from 'ava';

import History from '../src/server/modules/history';

const histMock = [
    {
        urn: 'foakfe',
        played_at: 50000
    },
    {
        urn: 'dezfez',
        played_at: 40000
    },
    {
        urn: 'fsdf',
        played_at: 20000
    },
    {
        urn: 'foakfezfzefe',
        played_at: 15000
    }
];

test('computeDifference', t => {
    let histDiffed = History.computeDiff(histMock);

    t.is(histMock[1].played_duration, undefined);

    t.is(histDiffed[0].played_duration, null);
    t.is(histDiffed[1].played_duration, 10);
    t.is(histDiffed[2].played_duration, 20);
    t.is(histDiffed[3].played_duration, 5);
});

test('getListenedState', t => {
    t.is(History.getListenedState(null), History.ListenedStates.LISTENING);
    t.is(History.getListenedState(0), History.ListenedStates.SKIPPED);
    t.is(History.getListenedState(5), History.ListenedStates.SKIPPED);
    t.is(History.getListenedState(20), History.ListenedStates.LISTENED);
    t.is(History.getListenedState(200), History.ListenedStates.LISTENED);
});


test('setListenedState', t => {
    let histDiffed = History.computeDiff(histMock);
    histDiffed = History.setListenedState(histDiffed);

    t.is(histMock[0].listenedState, undefined);

    t.is(histDiffed[0].listenedState, History.ListenedStates.LISTENING);
    t.is(histDiffed[1].listenedState, History.ListenedStates.LISTENED);
    t.is(histDiffed[2].listenedState, History.ListenedStates.LISTENED);
    t.is(histDiffed[3].listenedState, History.ListenedStates.SKIPPED);
});
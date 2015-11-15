var AGRacingProtocol = function () {
    'use strict';
        
    return {
       
        SESSIONTYPE : {
            0: {name: 'Session Invalid', dashPage: 0},
            1: { name: 'Practice', dashPage: 0 },
            2: { name: 'Test', dashPage: 0 },
            3: { name: 'Qualifying', dashPage: 1 },
            4: { name: 'Formation Lap', dashPage: 2 },
            5: { name: 'Race', dashPage: 2 },
            6: { name: 'Time Attack', dashPage: 2 }
        },

        RACESTATE : {
            0: {name: 'Race State Invalid'},
            1: {name: 'Not Started'},
            2: {name: 'Racing'},
            3: {name: 'Finished'},
            4: {name: 'Disqualified' },
            5: {name: 'Retired' },
            6: {name: 'DNF'}
        },

        FLAGS : {
            0: {flag: 'none.svg'},
            1: {flag: 'green.svg' },
            2: {flag: 'blue.svg' },
            3: {flag: 'white.svg' },
            4: {flag: 'yellow.svg' },
            5: {flag: 'yellow.svg' },
            6: {flag: 'black.svg' },
            7: { flag: 'chequered.svg' }
        },

        FLAGREASON : {
            0: {name: ''},
            1: {name: 'You Crashed!'},
            2: {name: 'Accident'},
            3: {name: 'Slow Car'}
        }    
        
    }
}();
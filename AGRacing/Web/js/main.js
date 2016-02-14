var AGRacing = function () {
    'use strict';

    var _worker = null;
    
    var _currentSessionType = -1;
    
    function initDataReader() {
        _worker = new Worker('/js/datareader.js');
        _worker.addEventListener('message', function(e) {
            var message = JSON.parse(e.data);
            
            switch (message.action) {
                case 'data':
                    break;

                case 'connected':
                    AGRacingUI.connected(message.data);
                    break;

                case 'disconnected':
                    AGRacingUI.notConnected();
                    break;
            }
            AGRacingView.updateUI(message);
        });        
    }

    function messageDataReader(command, data) {

        if (_worker !== null) {
            var message = {
                cmd: command,
                data: data
            };
            _worker.postMessage(message);
        }
    }
    
    function startDataReader(config) {
        messageDataReader('start', config);
    }   

    function stopDataReader() {
        messageDataReader('stop', {});
    }

    return {
        run: function () {
            initDataReader();
            AGRacingUI.init();
        },
        
        getCurrentSessionType: function() {
            return _currentSessionType;    
        },

        startDataReader: function (config) {
            startDataReader(config);
        },

        stopDataReader: function () {
            stopDataReader();
        }
    }
}();

jQuery(document).ready(function () {
    AGRacing.run();
});
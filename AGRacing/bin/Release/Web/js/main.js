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
                    AGRacingUI.connected();
                    AGRacingView.updateUI(message);
                    break;
                   
                case 'notconnected':
                    AGRacingUI.notConnected();
                    break;
            }
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
    
    function startDataReader() {
        messageDataReader('start',{});    
    }   

    function stopDataReader() {
        messageDataReader('stop', {});
    }

    return {
        run: function () {
            AGRacingUI.init();
            initDataReader();
            startDataReader();
        },
        
        getCurrentSessionType: function() {
            return _currentSessionType;    
        },

        startDataReader: function () {
            startDataReader();
        },

        stopDataReader: function () {
            stopDataReader();
        }
    }
}();

jQuery(document).ready(function () {
    AGRacing.run();
});
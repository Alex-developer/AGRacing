var AGDATAREADER = function() {
    'use strict';
    
    importScripts('/js/twix/twix.js');
    
    var _allDataURI = 'http://' + location.host.replace(':'+location.port,'') + ':' + location.port + '/';
    var _timers = {
        allData: {
            dataFrequency: 0,
            dataTimer: null,
            source: 'all.json',
            inXHR: false,
            notify: 'alldata'
        },
        carData: {
            dataFrequency: 50,
            dataTimer: null,
            source: 'car.json',
            inXHR: false,
            notify: 'cardata'
        },
        timingData: {
            dataFrequency: 1000,
            dataTimer: null,
            source: 'timing.json',
            inXHR: false,
            notify: 'timingdata'
        },
        environmentData: {
            dataFrequency: 5000,
            dataTimer: null,
            source: 'environment.json',
            inXHR: false,
            notify: 'environmentdata'
        }
    };

    function sendMessage(action, dataType, data) {
        var message = {
            'action': action,
            'datatype': dataType,
            'data': data
        };
        self.postMessage(JSON.stringify(message));     
    }
    
    function processMessage(e) {
        var message = e.data;
        switch (message.cmd) {
                
            case 'start':             
                startDataReaders();           
                break;

                
            case 'stop':
                clearInterval(_timers.allDataTimer);                 
                break;
            
            default:
        };        
    }

    function startDataReaders() {
        if (_timers.allData.dataFrequency > 0) {
            setInterval(function () { readData(_timers.allData) }, _timers.allData.dataFrequency);
        }
        if (_timers.carData.dataFrequency > 0) {
            setInterval(function () { readData(_timers.carData) }, _timers.carData.dataFrequency);
        }
        if (_timers.timingData.dataFrequency > 0) {
            setInterval(function () { readData(_timers.timingData) }, _timers.timingData.dataFrequency);
        }
        if (_timers.environmentData.dataFrequency > 0) {
            setInterval(function () { readData(_timers.environmentData) }, _timers.environmentData.dataFrequency);
        }
    }   
    
    function readData(timer) {
        if (!timer.inXHR) {
            timer.inXHR = true;
            Twix.ajax({
                url: _allDataURI + timer.source + '?nonce=' + (new Date).getTime(),
                success: function (data) {
                    timer.inXHR = false;
                    if (data !== null) {
                        sendMessage('data', timer.notify, data);
                    } else {
                        sendMessage('notconnected', '', null);
                    }
                },
                error: function () {
                }
            });
        }
    }
    
    return {
        processMessage : function(e) {
            processMessage(e);    
        }
    }
}();


self.addEventListener('message', AGDATAREADER.processMessage, false); 
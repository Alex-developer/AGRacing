var AGDATAREADER = function () {
    'use strict';

    importScripts('/js/twix/twix.js');

    var _uri;
    var _allDataURI;
    var _pollTimer;
    var _dataValid = false;
    var _running = false;
    var _timers = {
        carData: {
            dataFrequency : 50,
            defaultDataFrequency : 50,
            dataTimer : null,
            source : 'Car',
            inXHR : false,
            notify : 'cardata',
            webSocket : null
        },
        timingData: {
            dataFrequency: 1000,
            defaultDataFrequency: 1000,
            dataTimer: null,
            source: 'Timing',
            inXHR: false,
            notify: 'timingdata',
            webSocket: null
        },
        environmentData: {
            dataFrequency: 1000,
            defaultDataFrequency: 1000,
            dataTimer: null,
            source: 'Environment',
            inXHR: false,
            notify: 'environmentdata',
            webSocket: null
        }
    };

    if (location.port !== '') {
        _uri = location.host.replace(':' + location.port, '') + ':' + location.port;
        _allDataURI = 'http://' + _uri;
    } else {
        _uri = location.host;
        _allDataURI = 'http://' + _uri + '/';
    }

    var _usingWebSockets = true;
    var _pollingWebsocket = null;

    if (typeof WebSocket === 'function') {
        _usingWebSockets = true;
    } else {
        _usingWebSockets = false;
    }

   // _usingWebSockets = false;

    _pollTimer = setInterval(pollTimer, 1000);


    if (_usingWebSockets) {
        _pollingWebsocket = new WebSocket('ws://' + _uri + '/Connected');
        _pollingWebsocket.onopen = function (evt) {
        };
        _pollingWebsocket.onclose = function (evt) {
        };
        _pollingWebsocket.onmessage = function (evt) {
            var data = JSON.parse(evt.data);
            if (data.Connected === true) {
                _dataValid = true;
                if (_running) {
                    sendMessage('data', 'connected', data);
                    startDataReaders();
                }
            } else {
                _dataValid = false;
                if (_running) {
                    sendMessage('data', 'disconnected', null);
                    stopDataReaders();
                }
            }
        };
        _pollingWebsocket.onerror = function (evt) {
            _dataValid = false;
            if (_running) {
                sendMessage('data', 'disconnected', null);
                stopDataReaders();
            }
        };
    }

    function pollTimer() {
        if (!_dataValid) {
            if (_usingWebSockets) {
                if (_pollingWebsocket.readyState === 1) {
                    _pollingWebsocket.send('a');
                }
            } else {
                Twix.ajax({
                    url: _allDataURI + '/Connected?nonce=' + (new Date()).getTime(),
                    success: function (result) {
                        if (result) {
                            _dataValid = true;
                            if (_running) {
                                sendMessage('connected', 'connected', result);
                                startDataReaders();
                            }
                        } else {
                            _dataValid = false;
                            if (_running) {
                                sendMessage('disconnected', 'disconnected', null);
                                stopDataReaders();
                            }
                        }
                    },
                    error: function () {
                        _dataValid = false;
                        if (_running) {
                            sendMessage('disconnected', 'disconnected', null);
                            stopDataReaders();
                        }
                    }
                });
            }
        }
    }

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
                _running = true;
                _dataValid = false;

               // _timers.allData.dataFrequency = _timers.allData.defaultDataFrequency;
                _timers.carData.dataFrequency = _timers.carData.defaultDataFrequency;
                _timers.timingData.dataFrequency = _timers.timingData.defaultDataFrequency;
                _timers.environmentData.dataFrequency = _timers.environmentData.defaultDataFrequency;

                if (message.data !== undefined) {
                    var config = message.data;
                 //   if (config.allData !== undefined) {
                 //       _timers.allData.dataFrequency = config.allData;
                 //   }
                    if (config.carData !== undefined) {
                        _timers.carData.dataFrequency = config.carData;
                    }
                    if (config.timingData !== undefined) {
                        _timers.timingData.dataFrequency = config.timingData;
                    }
                    if (config.environmentData !== undefined) {
                        _timers.environmentData.dataFrequency = config.environmentData;
                    }
                }
                break;
    
            case 'stop':
                _running = false;
                stopDataReaders();
                break;
            
            default:
        }        
    }

    function stopDataReaders() {
        clearInterval(_timers.carData.dataTimer);
        clearInterval(_timers.timingData.dataTimer);
        clearInterval(_timers.environmentData.dataTimer);

        if (_usingWebSockets) {
            if (_timers.carData.webSocket !== null && _timers.carData.webSocket.readyState === 1) {
                _timers.carData.webSocket.close();
            }
            if (_timers.timingData.webSocket !== null && _timers.timingData.webSocket.readyState === 1) {
                _timers.timingData.webSocket.close();
            }
            if (_timers.environmentData.webSocket !== null && _timers.environmentData.webSocket.readyState === 1) {
                _timers.environmentData.webSocket.close();
            }
        }

        _timers.carData.inXHR = false;
        _timers.timingData.inXHR = false;
        _timers.environmentData.inXHR = false;
    }

    function startDataReaders() {
        if (_usingWebSockets) {
            _timers.carData.webSocket = new WebSocket('ws://' + _uri + '/Car');
            _timers.carData.webSocket.onopen = function (evt) {
                _timers.carData.dataTimer = setInterval(function () { readData(_timers.carData); }, _timers.carData.dataFrequency);
            };
            _timers.carData.webSocket.onclose = function (evt) {
            };
            _timers.carData.webSocket.onmessage = function (evt) {
                var data = JSON.parse(evt.data);
                if (data !== null) {
                    sendMessage('data', _timers.carData.notify, data);
                } else {
                    stopDataReaders();
                    _dataValid = false;
                }
                _timers.carData.inXHR = false;
            };
            _timers.carData.webSocket.onerror = function (evt) {
                stopDataReaders();
                _dataValid = false;
                _timers.carData.inXHR = false;
            };

            _timers.timingData.webSocket = new WebSocket('ws://' + _uri + '/Timing');
            _timers.timingData.webSocket.onopen = function (evt) {
                _timers.timingData.dataTimer = setInterval(function () { readData(_timers.timingData); }, _timers.timingData.dataFrequency);
            };
            _timers.timingData.webSocket.onclose = function (evt) {
            };
            _timers.timingData.webSocket.onmessage = function (evt) {
                var data = JSON.parse(evt.data);
                if (data !== null) {
                    sendMessage('data', _timers.timingData.notify, data);
                } else {
                    stopDataReaders();
                    _dataValid = false;
                }
                _timers.timingData.inXHR = false;
            };
            _timers.timingData.webSocket.onerror = function (evt) {
                stopDataReaders();
                _dataValid = false;
                _timers.timingData.inXHR = false;
            };

            _timers.environmentData.webSocket = new WebSocket('ws://' + _uri + '/Environment');
            _timers.environmentData.webSocket.onopen = function (evt) {
                _timers.environmentData.dataTimer = setInterval(function () { readData(_timers.environmentData); }, _timers.environmentData.dataFrequency);
            };
            _timers.environmentData.webSocket.onclose = function (evt) {
            };
            _timers.environmentData.webSocket.onmessage = function (evt) {
                var data = JSON.parse(evt.data);
                if (data !== null) {
                    sendMessage('data', _timers.environmentData.notify, data);
                } else {
                    stopDataReaders();
                    _dataValid = false;
                }
                _timers.environmentData.inXHR = false;
            };
            _timers.environmentData.webSocket.onerror = function (evt) {
                stopDataReaders();
                _dataValid = false;
                _timers.timingData.inXHR = false;
            };

        } else {
         //   if (_timers.allData.dataFrequency > 0) {
         //       _timers.allData.dataTimer = setInterval(function () { readData(_timers.allData); }, _timers.allData.dataFrequency);
         //   }
            if (_timers.carData.dataFrequency > 0) {
                _timers.carData.dataTimer = setInterval(function () { readData(_timers.carData); }, _timers.carData.dataFrequency);
            }
            if (_timers.timingData.dataFrequency > 0) {
                _timers.timingData.dataTimer = setInterval(function () { readData(_timers.timingData); }, _timers.timingData.dataFrequency);
            }
            if (_timers.environmentData.dataFrequency > 0) {
                _timers.environmentData.dataTimer = setInterval(function () { readData(_timers.environmentData); }, _timers.environmentData.dataFrequency);
            }
        }
    }   
    
    function readData(timer) {
        if (!timer.inXHR) {
            timer.inXHR = true;

            if (_usingWebSockets) {
                if (timer.webSocket.readyState === 1) {
                    timer.webSocket.send('a');
                }
            } else {
                Twix.ajax({
                    url: _allDataURI + '/' + timer.source + '?nonce=' + (new Date()).getTime(),
                    success: function (data) {
                        timer.inXHR = false;
                        if (data !== null) {
                            sendMessage('data', timer.notify, data);
                        } else {
                            stopDataReaders();
                            _dataValid = false;
                        }
                    },
                    error: function () {
                        _dataValid = false;
                        timer.inXHR = false;
                    }
                });
            }
        }
    }
    
    return {
        processMessage: function (e) {
            processMessage(e);
        }
    };
}();


self.addEventListener('message', AGDATAREADER.processMessage, false);
//# sourceURL=/js/datareader.js
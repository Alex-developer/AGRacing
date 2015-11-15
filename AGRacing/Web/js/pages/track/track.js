var AGRacingView = function () {
    'use strict';

    var _initialised = false;
    var _dataURI = 'http://' + location.host.replace(':' + location.port, '') + ':' + location.port + '/';
    var _zoomFactor = 2;
    var _stage = null;
    var _trackLayer;
    var _carLayer;
    var _debugLayer;
    var _showDebug = false;
    var _track = null;
    var _currentTrack = '';
    var _trackURI = null;
    var _timingUiInitialised = false;
    var _rotation = 0;
    var _positionColours = ['green', 'yellow', '#0089b6'];
    var _dataReader = {
        allData: 0,
        carData: 0,
        carPos: 50,
        timingData: 0,
        environmentData: 1000
    };
    var _positionUpdate = 10;
    var _positionUpdateCounter = 0;
    var centerx = jQuery('#trackcanvaswrapper').width() / 2;;
    var centery = jQuery('#trackcanvaswrapper').height() / 2;
    var x;
    var y;
    var point;
    var _defaultCarColor = '#cccccc';

    var _scripts = [
        '/js/konva/konva.min.js'
    ];

    function init() {
        buildUI();
    }

    function buildUI() {
        _initialised = true;

        jQuery('#trackpage').on('click', '#debug', function (e) {
            _showDebug = !_showDebug;
            drawTrack();
        });

        jQuery('#trackpage').on('click', '.zoom', function (e) {
            var type = jQuery(this).attr('id');
            switch (type) {
                case 'zoomin':
                    _zoomFactor = _zoomFactor - 0.05;
                    break;
                case 'zoomout':
                    _zoomFactor = _zoomFactor + 0.05;
                    break;
            };
            drawTrack();
        });

        jQuery('#trackpage').on('click', '.rotate', function (e) {
            var type = jQuery(this).attr('id');
            switch (type) {
                case 'rotateleft':
                    _rotation -= 1;
                    break;
                case 'rotatereset':
                    _rotation = 0;
                    break;
                case 'rotateright':
                    _rotation += 1;
                    break;
            }
            drawTrack();
        });

        var html = '<div id="trackanalysisinfo"></div>';
        jQuery('#rightmenu').html(html);

        jQuery('#trackmap').on('click', '.recording', function (e) {
            var action = jQuery(this).attr('id');
            switch(action) {
                case 'startrecording':
                    startRecording();
                    break;
                case 'stoprecording':
                    stopRecording();
                    break;
                case 'savetrack':
                    saveTrack();
                    break;
            }
        });

        _stage = new Konva.Stage({
            container: 'trackcanvas',
            width: jQuery('#trackcanvaswrapper').width(),
            height: jQuery('#trackcanvaswrapper').height()
        });
        _trackLayer = new Konva.Layer();
        _carLayer = new Konva.Layer();
        _debugLayer = new Konva.Layer();
        _stage.add(_trackLayer);
        _stage.add(_carLayer);
        _stage.add(_debugLayer);
    }

    function resizeUI() {
        var containerSize = {
            width: jQuery('#trackcanvaswrapper').width(),
            height: jQuery('#trackcanvaswrapper').height()
        };
        _stage.size(containerSize);
        centerx = jQuery('#trackcanvaswrapper').width() / 2;
        centery = jQuery('#trackcanvaswrapper').height() / 2;
    }

    function startRecording() {
        jQuery('#stoprecording').removeClass('disabled');
        jQuery('#startrecording').addClass('disabled');
        jQuery('#savetrack').addClass('disabled');

       jQuery.ajax({
            url: _dataURI + 'StartRecording?nonce=' + (new Date).getTime(),
            success: function (result) {
            }
        });
    }

    function stopRecording() {
        jQuery.ajax({
            url: _dataURI + 'StopRecording?nonce=' + (new Date).getTime(),
            success: function (result) {
            }
        });
        jQuery('#stoprecording').addClass('disabled');
        jQuery('#startrecording').removeClass('disabled');
        jQuery('#savetrack').removeClass('disabled');

        jQuery.ajax({
            url: _dataURI + 'AnalyseRecording?nonce=' + (new Date).getTime(),
            success: function (result) {
                var html = '';
                jQuery.each(result.AnalysisDrivers, function (index, driver) {

                    var lapCount = driver.AnalysisLaps.length;
                    var lapHTML = '';
                    jQuery.each(driver.AnalysisLaps, function (i, lap) {
                        var href = '/' + driver.Name + '/' + lap.Lap;
                        lapHTML += ',<a href="' + href + '" class="loadanalysedtrack">' + lap.Lap + '(' + lap.TotalPoints + ')</a>&nbsp;&nbsp;&nbsp;';
                    });

                    html += '\
                        <div>' + driver.Name + '(' + lapCount + ' Laps) ' + lapHTML + '</div>\
                    ';
                });

                jQuery(document).on('click', '.loadanalysedtrack', function (e) {
                    e.preventDefault();
                    var href = jQuery(this).attr('href');
                    _trackURI = href + '?nonce=' + (new Date).getTime();
                    jQuery.ajax({
                        url: _dataURI + 'LoadAnalysedTrack' + _trackURI,
                        success: function (result) {
                            _track = result;
                            drawTrack();
                        }
                    });
                });

                jQuery('#trackanalysisinfo').html(html);
                jQuery('#trackanalysisinfo').show();
            }
        });
    }

    function drawTrack() {
        if (_stage !== null) {
            if (_track !== null) {
              //  var centerx = jQuery('#trackcanvaswrapper').width() / 2;
              //  var centery = jQuery('#trackcanvaswrapper').height() / 2;
                var x;
                var y;
                var points = [];
                var counter = 0;
                _trackLayer.removeChildren();
                _debugLayer.removeChildren();

                if (_showDebug) {
                    var text = new Konva.Text({
                        x: 0,
                        y: 0,
                        text: _track.TrackName + _track.TrackVariation + '\n\n' + _track.TrackPoints.length + ' Points\n\nLength ' + _track.TrackLength + 'M',
                        fontSize: 12,
                        fontFamily: 'Calibri',
                        fill: 'white',
                        width: 500,
                        align: 'left'
                    });
                    _debugLayer.add(text);
                }

                var sector = 1;
                var sectorColour = 0;
                var sc = ['#9c7800','#6e5400','#9c5d00','#6e4100'];
                jQuery.each(_track.TrackPoints, function (index, point) {

                    var rotatedPoint = rotate(point, centerx, centery, _rotation);
                    x = rotatedPoint[0];
                    y = rotatedPoint[1];

                    x = x / _zoomFactor;
                    y = y / _zoomFactor;

                    x = centerx - x;
                    y = centery + y - 100;

                    if (point.s !== sector) {
                        var trackMap = new Konva.Line({
                            points: points,
                            stroke: sc[sectorColour],
                            strokeWidth: 2,
                            lineCap: 'round'
                        });
                        _trackLayer.add(trackMap);
                        var lx = points[points.length - 2];
                        var ly = points[points.length - 1];
                        points = [];
                        points.push(lx);
                        points.push(ly);
                        sector++;
                        sectorColour++;
                        if (sectorColour > sc.length - 1) {
                            sectorColour = 0;
                        }
                    }
                    points.push(x);
                    points.push(y);

                    if (_showDebug) {
                        counter++;
                        if (counter > 30) {
                            var text = new Konva.Text({
                                x: x,
                                y: y,
                                text: x.toFixed(2) + ',' + y.toFixed(2),
                                fontSize: 12,
                                fontFamily: 'Calibri',
                                fill: 'white',
                                width: 120,
                                align: 'left'
                            });
                            var circle = new Konva.Circle({
                                x: x,
                                y: y,
                                radius: 5,
                                fill: 'red'
                            });
                            _debugLayer.add(circle);
                            _debugLayer.add(text);
                            counter = 0;
                        }
                    }
                });
                if (points.length > 0) {
                    var trackMap = new Konva.Line({
                        points: points,
                        stroke: sc[sector - 1],
                        strokeWidth: 2,
                        lineCap: 'round'
                    });
                }
                _trackLayer.add(trackMap);
                _trackLayer.draw();
                _debugLayer.draw();
            }
        }
    }

    function saveTrack() {
        if (_trackURI !== null) {
            jQuery.ajax({
                url: _dataURI + 'SaveTrack' + _trackURI,
                success: function (result) {
                }
            });
        }
    }

    function loadTrack() {
        jQuery.ajax({
            url: _dataURI + 'LoadTrack?nonce=' + (new Date).getTime(),
            success: function (result) {
                _track = result;
                drawTrack();
                jQuery('#zoomin').removeClass('disabled');
                jQuery('#zoomreset').removeClass('disabled');
                jQuery('#zoomout').removeClass('disabled');
            }
        });
    }

    function updateUI(message) {
        _initialised = true;
        if (_initialised) {
            switch (message.datatype) {
                case 'connected':
                    loadTrack();
                    break;

                case 'cardata':
                  //  _carLayer.removeChildren();
                  //  _carLayer.clearCache();
                 //   _carLayer.clear();
                 //   _carLayer.destroyChildren();
                  //  var centerx = jQuery('#trackcanvaswrapper').width() / 2;
                 //   var centery = jQuery('#trackcanvaswrapper').height() / 2;
                    for (var i = 0; i < message.data.TrackPos.length; i++) {
                        var data = message.data.TrackPos[i];
                        x = data.CarPosition.x;
                        y = data.CarPosition.y;

                        point = rotate(data.CarPosition, centerx, centery, _rotation);
                        x = point[0];
                        y = point[1];

                        x = x / _zoomFactor;
                        y = y / _zoomFactor;
                        x = centerx - x;
                        y = centery + y - 100;

                        var car = _stage.findOne('#car' + i);

                        if (car === undefined) {
                            var color;
                            if (message.data.TrackPos[i].IsMe) {
                                color = 'red';
                            } else {
                                if (_positionColours[data.Position - 1] !== undefined) {
                                    color = _positionColours[data.Position - 1];
                                } else {
                                    color = _defaultCarColor;
                                }
                            }
                            car = new Konva.Circle({
                                id: 'car' + i,
                                x: x,
                                y: y,
                                radius: 10,
                                fill: color,
                                stroke: 'black',
                                strokeWidth: 1
                            });
                            _carLayer.add(car);
                        }

                        car.x(x);
                        car.y(y);

                    }
                    _carLayer.draw();

                    if (!_timingUiInitialised) {
                        var html = '';
                        jQuery.each(message.data.TrackPos, function (index, driver) {
                            var color = 'white';
                            if (_positionColours[index] !== undefined) {
                                color = _positionColours[index];
                            }
                            html += '<div class="row large-collapse small-collapse" style="color:' + color + '">';
                            html += '<div class="small-1 large-1 columns" id="pos' + index + '">' + (index + 1) + '</div>';
                            html += '<div class="small-8 large-8 columns" id="driver' + index + '"></div>';
                            html += '<div class="small-3 large-2 columns" id="best' + index + '"></div>';
                            html += '</div>';
                        });
                        jQuery('#timings').html(html);
                        _timingUiInitialised = true;
                    }

                    _positionUpdateCounter++;
                    if (_positionUpdateCounter === _positionUpdateCounter) {
                        _positionUpdateCounter = 0;
                        message.data.TrackPos.sort(compare);

                        jQuery.each(message.data.TrackPos, function (index, driver) {
                            jQuery('#driver' + index).text(driver.Name);
                            if (driver.FastestLapTime !== -1) {
                                var time = (driver.FastestLapTime / 1000).toFixed(3);
                                jQuery('#best' + index).text(time);
                            } else {
                                jQuery('#best' + index).text('--:--:--');
                            }
                        });
                    }
                    

                    break;
            }
        }
    }

    function compare(a, b) {
        if (a.Position < b.Position)
            return -1;
        if (a.Position > b.Position)
            return 1;
        return 0;
    }

    function rotate(point, xm, ym, a) {
        var cos = Math.cos;
        var sin = Math.sin;
        var a = a * Math.PI / 180;

        var xr = (point.x - xm) * cos(a) - (point.y - ym) * sin(a) + xm;
        var yr = (point.x - xm) * sin(a) + (point.y - ym) * cos(a) + ym;

        return [xr, yr];
    }

    return {
        init: function () {
            return init();
        },

        scripts: function () {
            return _scripts;
        },

        initDataReader: function() {
            return _dataReader;
        },

        buildUI: function () {
            buildUI();
        },

        updateUI: function (data) {
            updateUI(data);
        },

        resize: function () {
            resizeUI();
            drawTrack();
        },

        connected: function () {
            loadTrack();
        }

    }
}();
//# sourceURL=/js/pages/track/track.js
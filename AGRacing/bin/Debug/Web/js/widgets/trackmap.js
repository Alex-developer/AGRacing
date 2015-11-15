var AGRacingTRACKMAPWidget = function () {
    'use strict';

    var _name = 'Track Map';
    var _icon = '/images/widgets/track.png';
    var _labels = ['Track Map', 'Circuit'];

    var _initialised = false;
    var _el = null;
    var _stage = null;
    var _trackLayer;
    var _carLayer;
    var _track = null;
    var _zoomFactor = 0.25;
    var _rotation = 0;
    var _smallestX;
    var _smallestY;
    var _biggestX;
    var _biggestY;
    var _defaultCarColor = '#cccccc';
    var _positionColours = ['green', 'yellow', '#0089b6'];
    var _debugLayer;
    var _showDebug = false;

    var _properties = {
        type: 'trackmap',
        css: {
            left: 0,
            top: 0,
            width: 300,
            height: 300
        }
    };
    var _messages = ['connected', 'disconnected', 'cardata'];
    var _scripts = [
        '/js/konva/konva.min.js'
    ];

    var _uri;
    var _dataURI;
    if (location.port !== '') {
        _uri = location.host.replace(':' + location.port, '') + ':' + location.port;
        _dataURI = 'http://' + _uri + '/';
    } else {
        _uri = location.host;
        _dataURI = 'http://' + _uri + '/';
    }

    function init(element, properties) {
        _el = element;
        _properties = properties;
        require(_scripts, function () {
            buildUI();
        });
    }

    function destroy() {
        _initialised = false;
        jQuery(_el).remove();
    }

    function buildUI() {
        _stage = new Konva.Stage({
            container: _el.attr('id'),
            width: jQuery(_el).width(),
            height: jQuery(_el).height()
        });
        _trackLayer = new Konva.Layer();
        _carLayer = new Konva.Layer();
        _debugLayer = new Konva.Layer();
        _stage.add(_trackLayer);
        _stage.add(_carLayer);
        _stage.add(_debugLayer);
        _initialised = true;
    }

    function resizeStage() {
        _stage.size({
            width: jQuery(_el).width(),
            height: jQuery(_el).height()
        });
    }

    function startEdit() {
        AGRacingWidgets.startEdit(_el, {
            resize: function () {
                drawTrack();
            },
            resizeStop: function () {
                resizeStage();
                drawTrack();
            }
        });
    }

    function finishEdit() {
        AGRacingWidgets.finishEdit(_el, _properties);
        return _properties;
    }

    function updateUI(data, datatype) {
        if (_initialised) {
            switch (datatype) {
                case 'connected':
                    loadTrack();
                    break;

                case 'cardata':
                    updateCars(data);
                    break;

            }
        }
    }

    function loadTrack() {
        jQuery.ajax({
            url: _dataURI + 'LoadTrack?nonce=' + (new Date).getTime(),
            success: function (result) {
                _track = result;
                drawTrack();
            }
        });
    }

    function drawTrack() {

        var counter = 0;
        _smallestX = 0;
        _smallestY = 0;

        _biggestX = 0;
        _biggestY = 0;

        for (var i = 0; i < _track.TrackPoints.length; i++) {

            if (_track.TrackPoints[i].x > _biggestX)
            {
                _biggestX = _track.TrackPoints[i].x;
            }
            if (_track.TrackPoints[i].y > _biggestY)
            {
                _biggestY = _track.TrackPoints[i].y;
            }

            if (_track.TrackPoints[i].x < _smallestX)
            {
                _smallestX = _track.TrackPoints[i].x;
            }
            if (_track.TrackPoints[i].y < _smallestY)
            {
                _smallestY = _track.TrackPoints[i].y;
            }
        }
        _smallestX = Math.abs(_smallestX);
        _smallestY = Math.abs(_smallestY);

        var offset = _smallestX
        if (_biggestX > _smallestX) {
            offset = _biggestX;
        }

        //http://stackoverflow.com/questions/929103/convert-a-number-range-to-another-range-maintaining-ratio
        //new_value = ( (old_value - old_min) / (old_max - old_min) ) * (new_max - new_min) + new_min;
        if (_stage !== null) {
            if (_track !== null) {
                var centerx = jQuery(_el).width() / 2;
                var centery = jQuery(_el).height() / 2;

               // _zoomFactor = _biggestX / jQuery(_el).width();

                var x;
                var y;
                var points = [];
                _trackLayer.destroyChildren();
                _debugLayer.destroyChildren();

                if (_showDebug) {
                    var center = new Konva.Circle({
                        x: centerx,
                        y: centery,
                        radius: 10,
                        fill: 'red',
                        stroke: 'black',
                        strokeWidth: 1
                    });
                    
                    _debugLayer.add(center);
                    var text = new Konva.Text({
                        x: 0,
                        y: 0,
                        text: _track.TrackName + _track.TrackVariation + '\n\n' + _track.TrackPoints.length + ' Points\n\nLength ' + _track.TrackLength + 'M\n\nZoom' + _zoomFactor,
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
                var sc = ['#9c7800', '#6e5400', '#9c5d00', '#6e4100'];
                jQuery.each(_track.TrackPoints, function (index, point) {

                    //var rotatedPoint = rotate(point, centerx, centery, _rotation);
                    //x = rotatedPoint[0];
                    //y = rotatedPoint[1];

                    x = point.x + offset;
                    y = point.y + _smallestY;

                    x = (centerx - x) + centerx;
                  //  x = centerx + x;
                 //   y = centery + y;

                    x = x * _zoomFactor;
                    y = y * _zoomFactor;

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

    function updateCars(carData) {
        var color;
        var centerx = jQuery(_el).width() / 2;
        var centery = jQuery(_el).height() / 2;
        for (var i = 0; i < carData.CarTrackPos.length; i++) {
            var data = carData.CarTrackPos[i];
            var x = data.CarPosition.x;
            var y = data.CarPosition.y;

            //var rotatedPoint = rotate(point, centerx, centery, _rotation);
            //x = rotatedPoint[0];
            //y = rotatedPoint[1];

            x = x + _smallestX;
            y = y + _smallestY;

            x = (centerx - x) + centerx;
            //  x = centerx + x;
            //   y = centery + y;

            x = x * _zoomFactor;
            y = y * _zoomFactor;

            var car = _stage.findOne('#car' + i);

            if (car === undefined) {
                if (data.IsMe) {
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
        name: _name,
        icon: _icon,
        messages: _messages,
        labels: _labels,
        tab: 'Environment',

        element: function () {
            return _el;
        },

        init: function (element, settings) {
            return init(element, settings);
        },

        destroy: function () {
            destroy();
        },

        startEdit: function () {
            startEdit();
        },

        finishEdit: function () {
            return finishEdit();
        },

        updateUI: function (data, datatype) {
            updateUI(data, datatype);
        },

        getProperties: function () {
            return _properties;
        },

        getProperty: function (property) {
            var result;
            if (_properties[property] !== undefined) {
                result = _properties[property];
            }
            return result;
        },

        setProperty: function (property, value) {
            _properties[property] = value;
        }

    }
};
//# sourceURL=/js/widgets/trackmap.js
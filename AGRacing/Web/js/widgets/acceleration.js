var AGRacingACCELERATIONWidget = function () {
    'use strict';

    var _name = 'Acceleration';
    var _icon = '/images/widgets/gforce.png';
    var _labels = ['Acceleration','GForce'];

    var _initialised = false;
    var _el = null;
    var _stage = null;
    var _backgroundLayer = null;
    var _accelLayer = null;
    var _cx;
    var _cy;
    var _radius;
    var _indicator = null;
    var _indicatorRadius = 5;

    var _properties = {
        type: 'acceleration',
        css: {
            left: 0,
            top: 0,
            width: 200,
            height: 200
        }
    };
    var _messages = ['cardata'];
    var _scripts = [
        '/js/konva/konva.min.js'
    ];

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
        _backgroundLayer = new Konva.Layer();
        _accelLayer = new Konva.Layer();
        _stage.add(_backgroundLayer);
        _stage.add(_accelLayer);

        drawBackground();
        _initialised = true;
    }

    function drawBackground() {
        var containerSize = {
            width: jQuery(_el).width(),
            height: jQuery(_el).height()
        };
        _stage.size(containerSize);
        setDimensions();

        _backgroundLayer.destroyChildren();
        var step = _radius / 7;
        var radius = _radius;
        var stroke = 1;
        var colour = '#333';
        for (var i = 0; i < 5; i++) {

            if (i % 2 === 0) {
                stroke = 2;
                colour = '#fff';
            } else {
                stroke = 1;
                colour = '#333';
            }
            _backgroundLayer.add(new Konva.Circle({
                x: _cx,
                y: _cy,
                radius: radius,
                stroke: colour,
                strokeWidth: stroke
            }));
            radius -= step;
        }

        _backgroundLayer.add(new Konva.Line({
            points: [_cx, 0, _cx, step*4],
            stroke: '#fff',
            strokeWidth: 1,
            dash: [10, 10]
        }));

        _backgroundLayer.add(new Konva.Line({
            points: [0, _cy, step * 4, _cy],
            stroke: '#fff',
            strokeWidth: 1,
            dash: [10, 10]
        }));

        _backgroundLayer.add(new Konva.Line({
            points: [_cx, jQuery(_el).height(), _cx, jQuery(_el).height() - step * 4],
            stroke: '#fff',
            strokeWidth: 1,
            dash: [10, 10]
        }));

        _backgroundLayer.add(new Konva.Line({
            points: [jQuery(_el).width(), _cy, jQuery(_el).width() - step * 4, _cy],
            stroke: '#fff',
            strokeWidth: 1,
            dash: [10, 10]
        }));

        _backgroundLayer.add(new Konva.Line({
            points: [_cx, jQuery(_el).height() - step * 4, _cx, (step * 4)],
            stroke: '#fff',
            strokeWidth: 1
        }));

        _backgroundLayer.add(new Konva.Line({
            points: [(step * 4), _cy, jQuery(_el).width() - step * 4, _cy],
            stroke: '#fff',
            strokeWidth: 1
        }));
      
        _backgroundLayer.draw();
        updateUI(null, true);
    }

    function setDimensions() {
        var size = jQuery(_el).width();
        _cx = (0.5 + (size / 2)) | 0;
        _cy = (0.5 + (size / 2)) | 0;
        _radius = (0.5 + ((size-2) / 2)) | 0;
    }

    function startEdit() {
        AGRacingWidgets.startEdit(_el, {
            resize: function () {
                drawBackground();
            },
            resizeStop: function () {
                drawBackground();
            }
        },1);
    }

    function finishEdit() {
        AGRacingWidgets.finishEdit(_el, _properties);
        return _properties;
    }

    function updateUI(data, forceDisplay) {
        var x = 0;
        var y = 0;

        if (forceDisplay === undefined) {
            forceDisplay = false;
        }
        if (_initialised || forceDisplay) {
            if (_indicator === null) {
                _indicator = new Konva.Circle({
                    x: _cx,
                    y: _cy,
                    radius: _indicatorRadius,
                    fill: 'red',
                    stroke: 'black',
                    strokeWidth: 1
                })
                _accelLayer.add(_indicator);
            }

            if (!forceDisplay) {
                y = data.Acceleration.X * 1;
                x = data.Acceleration.Y * 1
            }
            _indicator.position({
                x: _cx - x,
                y: _cy + y
            });
            _accelLayer.draw();
        }
    }

    return {
        name: _name,
        icon: _icon,
        messages: _messages,
        labels: _labels,
        tab: 'Car',

        element: function () {
            return _el;
        },

        init: function (element, settings) {
            return init(element, settings);
        },

        destroy: function () {
            destroy();
        },

        updateUI: function (data) {
            updateUI(data);
        },

        startEdit: function () {
            startEdit();
        },

        finishEdit: function () {
            return finishEdit();
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
//# sourceURL=/js/widgets/acceleration.js
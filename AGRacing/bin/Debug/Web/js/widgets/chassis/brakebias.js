var AGRacingBRAKEBIASWidget = function () {
    'use strict';

    var _name = 'Brake Bias';
    var _icon = '/images/widgets/percent.png';
    var _labels = ['Brake Bias'];
    var _tab = 'Chassis';
    var _supports = ['iRacing'];

    var _initialised = false;
    var _el = null;
    var _elId = null;
    var _lastBrakeBias = null;

    var _stage;
    var _backgroundLayer;
    var _brakeBiasLayer;
    var _textLayer;

    var _properties = {
        type: 'brakebias',
        css: {
            left: 0,
            top: 0,
            width: 150,
            height: 80
        }
    };
    var _messages = ['cardata'];

    var _scripts = [
        '/js/konva/konva.min.js'
    ];

    function init(element) {
        _el = element;
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
        _brakeBiasLayer = new Konva.Layer();
        _backgroundLayer = new Konva.Layer();
        _textLayer = new Konva.Layer();
        _stage.add(_brakeBiasLayer);
        _stage.add(_backgroundLayer);
        _stage.add(_textLayer);

        drawBackground();


        _elId = AGRacingUI.getNextId();
        var element = jQuery('<div>')
            .css('pointer-events', 'none')
            .css('position', 'absolute')
            .css('left', '0')
            .css('top', '0')
            .css('width', '100%')
            .text('0%').attr('id', _elId);

        jQuery(_el).append(element);
        jQuery('#' + _elId).bigText();

        _initialised = true;
    }

    function drawBackground() {
        _backgroundLayer.removeChildren();

        var rect = new Konva.Rect({
            x: 0,
            y: 0,
            width: _stage.width(),
            height: _stage.height(),
            stroke: 'white',
            strokeWidth: 1
        });
        _backgroundLayer.add(rect);

        var centerLine = new Konva.Line({
            points: [_stage.width() / 2, 0, _stage.width() / 2, _stage.height()],
            stroke: 'white',
            strokeWidth: 1
        });
        _backgroundLayer.add(centerLine);

        _backgroundLayer.draw();
    }

    function resizeStage() {
        _stage.size({
            width: jQuery(_el).width(),
            height: jQuery(_el).height()
        });
        drawBackground();
    }

    function updateUI(data) {
        if (_initialised) {
            if (_lastBrakeBias !== data.Chassis.BrakeBias.toFixed(2)) {

                var brakeBias = data.Chassis.BrakeBias.toFixed(2);
                if (brakeBias === '-1.00') {
                    brakeBias = 50;
                }

                var pixelsPerPercent = jQuery(_el).width() / 100;
                var left = brakeBias * pixelsPerPercent;
                var width = (50 - brakeBias) * pixelsPerPercent;

                _brakeBiasLayer.removeChildren();

                var rect = new Konva.Rect({
                    x: left,
                    y: 0,
                    width: width,
                    height: _stage.height(),
                    fill: 'green'
                });
                _brakeBiasLayer.add(rect);
                _brakeBiasLayer.draw();

                if (data.Chassis.BrakeBias.toFixed(2) === '-1.00') {
                    jQuery('#' + _elId).text('N/A');
                } else {
                    jQuery('#' + _elId).text(brakeBias + '%');
                }

                _lastBrakeBias = data.Chassis.BrakeBias.toFixed(2);
            }
        }
    }

    function startEdit() {
        AGRacingWidgets.startEdit(_el, {
            resize: function () {
                resizeStage();
                jQuery('#' + _elId).bigText();
            },
            resizeStop: function () {
                resizeStage();
                jQuery('#' + _elId).bigText();
            }
        });
    }

    function finishEdit() {
        AGRacingWidgets.finishEdit(_el, _properties);
        return _properties;
    }

    return {
        name: _name,
        icon: _icon,
        messages: _messages,
        labels: _labels,
        tab: _tab,
        supports: _supports,

        element: function () {
            return _el;
        },

        init: function (element) {
            return init(element);
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
//# sourceURL=/js/widgets/chassis/brakebias.js
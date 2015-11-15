var AGRacingWHEELWidget = function () {
    'use strict';

    var _name = 'Wheel';
    var _icon = '/images/widgets/wheel.png';

    var _initialised = false;
    var _el = null;
    var _elWheel = null;
    var _oldWheel = null;

    var _properties = {
        type: 'wheel',
        css: {
            left: 0,
            top: 0,
            width: 300,
            height: 300
        }
    };
    var _messages = ['cardata'];


    function init(element, properties) {
        _el = element;
        _properties = properties;
        buildUI();
    }

    function destroy() {
        _initialised = false;
        jQuery(_el).remove();
    }

    function buildUI() {
        _elWheel = jQuery('<img>', { 'src': '/images/wheel.svg' }).addClass('wheel');
        jQuery(_el).append(_elWheel);
        _initialised = true;
    }


    function startEdit() {
        AGRacingWidgets.startEdit(_el, {
            resize: function () {
            },
            resizeStop: function () {
            }
        },1);
    }

    function finishEdit() {
        AGRacingWidgets.finishEdit(_el, _properties);
        return _properties;
    }

    function updateUI(data) {
        if (_initialised) {
            if (_oldWheel !== data.Wheel) {
                var rotation = 'rotate(' + (data.Wheel * 90) + 'deg)';
                _elWheel.css('-webkit-transform', rotation);
                _elWheel.css('-moz-transform', rotation);
                _elWheel.css('-o-transform', rotation);
                _elWheel.css('-ms-transform', rotation);
                _oldWheel = data.Wheel;
            }
        }
    }

    return {
        name: _name,
        icon: _icon,
        messages: _messages,
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
//# sourceURL=/js/widgets/wheel.js
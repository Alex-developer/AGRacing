var AGRacingLAPINVALIDATEDWidget = function () {
    'use strict';

    var _name = 'Invalid';
    var _icon = '/images/widgets/error.png';
    var _labels = ['Invalid Lap', 'Lap Invalidated'];
    var _tab = 'Timing';
    var _supports = ['Project Cars'];

    var _initialised = false;
    var _el = null;
    var _elId = null;
    var _lastLapInvalidated = null;

    var _indicatorEl = null;
    var _properties = {
        type: 'lapinvalidated',
        css: {
            left: 0,
            top: 0,
            width: 100,
            height: 80
        }
    };
    var _messages = ['cardata'];

    function init(element, properties) {
        if (element !== undefined) {
            _el = element;
        }
        if (properties !== undefined) {
            _properties = properties;
        }
        buildUI();
    }

    function destroy() {
        _initialised = false;
        jQuery(_el).remove();
    }

    function buildUI() {
        _elId = AGRacingUI.getNextId();
        _indicatorEl = jQuery('<span>').css({ 'pointer-events': 'none' }).text('Lap Invalidated').attr('id', _elId);

        jQuery(_el).append(_indicatorEl);
        jQuery('#' + _elId).bigText();
        _initialised = true;
    }

    function updateUI(data) {
        if (_initialised) {
            if (_lastLapInvalidated !== data.LapInvalidated) {
                if (data.LapInvalidated) {
                    _indicatorEl.css('background', 'red');
                } else {
                    _indicatorEl.css('background', 'none');
                }
                _lastLapInvalidated = data.LapInvalidated;
            }
        }
    }

    function startEdit() {
        jQuery('#' + _elId).on('blur', function () {
            jQuery('#' + _elId).bigText();
        });
        jQuery('#' + _elId).on('input', function () {
            jQuery('#' + _elId).bigText();
        });

        AGRacingWidgets.startEdit(_el, {
            resize: function () {
                jQuery('#' + _elId).bigText();
            },
            resizeStop: function () {
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

        init: function (element, properties) {
            return init(element, properties);
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
//# sourceURL=/js/widgets/lapinvalidated.js
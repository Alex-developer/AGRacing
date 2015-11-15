var AGRacingTIMELEFTWidget = function () {
    'use strict';

    var _name = 'Time Left';
    var _icon = '/images/widgets/stopwatch.png';
    var _labels = ['Time Left'];

    var _initialised = false;
    var _el = null;
    var _elId = null;
    var _lastTimeLeft = null;

    var _properties = {
        type: 'timeleft',
        css: {
            left: 0,
            top: 0,
            width: 150,
            height: 45
        }
    };
    var _messages = ['timingdata'];

    function init(element) {
        _el = element;
        buildUI();
    }

    function destroy() {
        _initialised = false;
        kendo.destroy(jQuery(_el));
        jQuery(_el).remove();
    }

    function buildUI() {
        _elId = AGRacingUI.getNextId();
        var element = jQuery('<span>').css({ 'pointer-events': 'none' }).html('--:--:--').attr('id', _elId);

        jQuery(_el).append(element);
        jQuery('#' + _elId).bigText();
        _initialised = true;
    }

    function updateUI(data) {
        if (_initialised) {
            var timeLeft = data.SessionTimeLeft.toFixed(0);
            if (_lastTimeLeft !== timeLeft) {
                jQuery('#' + _elId).html(_lastTimeLeft.toHHMMSS(false));
                _lastTimeLeft = timeLeft;
            }
        }
    }

    function startEdit() {
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
        tab: 'Timing',

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
//# sourceURL=/js/widgets/timeleft.js
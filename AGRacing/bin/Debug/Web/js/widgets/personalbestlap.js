﻿var AGRacingPERSONALBESTLAPWidget = function () {
    'use strict';

    var _name = 'Personal best Lap';
    var _icon = '/images/widgets/stopwatch.png';
    var _labels = ['Personal Best Lap'];

    var _initialised = false;
    var _el = null;
    var _elId = null;
    var _lastPersonalBest = null;

    var _properties = {
        type: 'personalbestlap',
        css: {
            left: 0,
            top: 0,
            width: 300,
            height: 50
        }
    };
    var _messages = ['timingdata'];

    function init(element) {
        _el = element;
        buildUI();
    }

    function destroy() {
        _initialised = false;
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
            if (_lastPersonalBest !== data.PersonalFastestLap) {
                if (data.PersonalFastestLap !== -1) {
                    jQuery('#' + _elId).html(data.PersonalFastestLap.toHHMMSS(true));
                } else {
                    jQuery('#' + _elId).html('--:--:--');
                }
                _lastPersonalBest = data.PersonalFastestLap;
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
//# sourceURL=/js/widgets/personalbestlap.js
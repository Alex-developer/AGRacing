﻿var AGRacingENGINESTALLEDWARNINGWidget = function () {
    'use strict';

    var _name = 'Engine Stalled';
    var _icon = '/images/widgets/damage.png';
    var _labels = ['Engine Stalled'];
    var _tab = 'Engine';
    var _supports = ['iRacing'];

    var _initialised = false;
    var _el = null;
    var _elId = null;
    var _lastEngineStalledWarning = null;

    var _properties = {
        type: 'enginestalledwarning',
        css: {
            left: 0,
            top: 0,
            width: 150,
            height: 80
        }
    };
    var _messages = ['cardata'];

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
        var element = jQuery('<span>').css({ 'pointer-events': 'none' }).text('Engine Stalled').attr('id', _elId);

        jQuery(_el).append(element);
        jQuery('#' + _elId).bigText();
        _initialised = true;
    }

    function updateUI(data) {
        if (_initialised) {
            if (_lastEngineStalledWarning !== data.Engine.EngineStalled) {
                if (data.Engine.EngineStalled) {
                    jQuery(_el).removeClass('green');
                    jQuery(_el).addClass('red');
                } else {
                    jQuery(_el).addClass('green');
                    jQuery(_el).removeClass('red');
                }
                _lastEngineStalledWarning = data.Engine.EngineStalled;
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
//# sourceURL=/js/widgets/engine/warnings/oilpressurewarning.js
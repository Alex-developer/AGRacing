﻿var AGRacingAMBIENTTEMPWidget = function () {
    'use strict';

    var _name = 'Ambient';
    var _icon = '/images/widgets/temperature.png';
    var _labels = ['Ambient Temperature', 'Ambient Temp.', 'Ambient'];
    var _tab = 'Environment';
    var _supports = ['iRacing', 'Project Cars'];

    var _initialised = false;
    var _el = null;
    var _elId = null;
    var _lastAmbientTemp = null;

    var _properties = {
        type: 'ambienttemp',
        css: {
            left: 0,
            top: 0,
            width: 100,
            height: 50
        }
    };
    var _messages = ['environmentdata'];

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
        kendo.destroy(jQuery(_el));
        jQuery(_el).remove();
    }

    function buildUI() {
        _elId = AGRacingUI.getNextId();
        var element = jQuery('<span>').css({ 'pointer-events': 'none' }).html('&nbsp;').attr('id', _elId);

        jQuery(_el).append(element);
        jQuery('#' + _elId).bigText();
        _initialised = true;
    }

    function updateUI(data) {
        if (_initialised) {
            var ambientTemp = data.AmbientTemperature;
            if (_lastAmbientTemp !== ambientTemp) {
                jQuery('#' + _elId).html(ambientTemp);
                _lastAmbientTemp = ambientTemp
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
//# sourceURL=/js/widgets/environment/ambienttemp.js
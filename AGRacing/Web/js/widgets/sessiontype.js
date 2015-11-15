﻿var AGRacingSESSIONTYPEWidget = function () {
    'use strict';

    var _name = 'Session';
    var _icon = '/images/widgets/text.png';
    var _labels = ['Session Type'];

    var _initialised = false;
    var _el = null;
    var _elId = null;
    var _lastSessionType = null;

    var _properties = {
        type: 'sessiontype',
        css: {
            left: 0,
            top: 0,
            width: 300,
            height: 300
        }
    };
    var _messages = ['environmentdata'];

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
        var element = jQuery('<span>').css({ 'pointer-events': 'none' }).text('Unknown').attr('id', _elId);

        jQuery(_el).append(element);
        jQuery('#' + _elId).bigText();
        _initialised = true;
    }

    function updateUI(data) {
        if (_initialised) {
            if (_lastSessionType !== data.Session) {
                var sessionType = AGRacingProtocol.SESSIONTYPE[data.Session];
                jQuery('#' + _elId).text(sessionType.name);
                _lastSessionType = data.Session;
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
        tab: 'Environment',

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
//# sourceURL=/js/widgets/sessiontype.js
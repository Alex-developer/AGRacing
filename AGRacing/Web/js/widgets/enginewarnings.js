var AGRacingENGINEWARNINGSWidget = function () {
    'use strict';

    var _name = 'Engine Warnings';
    var _icon = '/images/widgets/damage.png';
    var _labels = ['Gear'];
    var _tab = 'Car';
    var _supports = ['iRacing'];

    var _initialised = false;
    var _el = null;
    var _lastWarnings = 0;
    var _tableId;
    var _revLimiterId;

    var _properties = {
        type: 'enginewarnings',
        css: {
            left: 0,
            top: 0,
            width: 100,
            height: 50
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
        _tableId = AGRacingUI.getNextId();
        _revLimiterId = AGRacingUI.getNextId();
        jQuery(_el).html('<table id="' + _tableId  + '" style="width:100%;height:100%" cellpadding="0" cellspacing="0">\
            <tr>\
                <td><span class="success label" data-bit=1>Water Temp</span></td>\
                <td><span class="success label" data-bit=2>Fuel Pressure</span></td>\
                <td><span class="success label" data-bit=4>Oil Pressure</span></td>\
            </tr>\
            <tr>\
                <td><span class="success label" data-bit=8>Engine Stalled</span></td>\
                <td><span class="success label" data-bit=16>Pit Limiter</span></td>\
                <td><span id="' + _revLimiterId + '" class="success label" data-bit=32>Rev Limiter</span></td>\
            </tr>\
        </table>');
        _initialised = true;
    }

    function updateUI(data) {
        if (_initialised) {
            if (_lastWarnings !== data.EngineDamage) {

                if (data.EngineDamage & 32) {
                    jQuery('#' + _revLimiterId).removeAttr('success');
                    jQuery('#' + _revLimiterId).addAttr('alert');
                } else {
                    jQuery('#' + _revLimiterId).removeAttr('alert');
                    jQuery('#' + _revLimiterId).addAttr('success');
                }
                _lastWarnings = data.EngineDamage;
            }
        }
    }

    function startEdit() {
        AGRacingWidgets.startEdit(_el, {
            resize: function () {
            },
            resizeStop: function () {
            }
        });
    }

    function finishEdit() {
        AGRacingWidgets.finishEdit(_el, _properties);
        return _properties;
    }

    function propertyChanged(property, value) {

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
//# sourceURL=/js/widgets/enginewarnings.js
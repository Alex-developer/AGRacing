var AGRacingDAMAGEWidget = function () {
    'use strict';

    var _name = 'Damage';
    var _icon = '/images/widgets/damage.png';
    var _labels = ['Damage'];

    var _initialised = false;
    var _el = null;
    var _elId = null;
    var _lastTotalDamage = null;

    var _elAeroDamage;
    var _elEngineDamage;
    var _elSuspensionDamage;
    var _elBrakeDamage;
    var _properties = {
        type: 'damage',
        css: {
            left: 0,
            top: 0,
            width: 300,
            height: 300
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
        _elAeroDamage = jQuery('<progress>').css({
            'height': '20%',
            'width' : '100%'
        }).attr('id', _elId).attr('max', '100');

        _elId = AGRacingUI.getNextId();
        _elEngineDamage = jQuery('<progress>').css({
            'height': '20%',
            'width': '100%',
            'margin-top': '5%'
        }).attr('id', _elId).attr('max','100');

        _elId = AGRacingUI.getNextId();
        _elBrakeDamage = jQuery('<progress>').css({
            'height': '20%',
            'width': '100%',
            'margin-top': '5%'
        }).attr('id', _elId).attr('max', '100');

        _elId = AGRacingUI.getNextId();
        _elSuspensionDamage = jQuery('<progress>').css({
            'height': '20%',
            'width': '100%',
            'margin-top': '5%'
        }).attr('id', _elId).attr('max', '100');

        jQuery(_el).append(_elAeroDamage);
        jQuery(_el).append(_elEngineDamage);
        jQuery(_el).append(_elBrakeDamage);
        jQuery(_el).append(_elSuspensionDamage);
        _initialised = true;
    }

    function updateUI(data) {
        if (_initialised) {
            var aeroDamage = data.AeroDamage * 100;
            var engineDamage = data.EngineDamage * 100;

            var brakeDamage = data.BrakeDamage[0] + data.BrakeDamage[1] + data.BrakeDamage[2] + data.BrakeDamage[3];
            brakeDamage = (brakeDamage * 100) / 400;

            var suspensionDamage = data.SuspensionDamage[0] + data.SuspensionDamage[1] + data.SuspensionDamage[2] + data.SuspensionDamage[3];
            suspensionDamage = (suspensionDamage * 100) / 400;

            if (_lastTotalDamage !== (aeroDamage + engineDamage + brakeDamage + suspensionDamage)) {
                setValue(_elAeroDamage, aeroDamage);
                setValue(_elEngineDamage, engineDamage);
                setValue(_elBrakeDamage, brakeDamage);
                setValue(_elSuspensionDamage, suspensionDamage);
                _lastTotalDamage = aeroDamage + engineDamage + brakeDamage + suspensionDamage;
            }
        }
    }


    function setValue(el, value) {

        el.removeClass();
        if (value < 50) {
            el.addClass('progress-50');
        } else {
            if (value < 75) {
                el.addClass('progress-75');
            } else {
                el.addClass('progress-100');
            }
        }

        el.val(value);

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

    return {
        name: _name,
        icon: _icon,
        messages: _messages,
        labels: _labels,
        tab: 'Car',

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
//# sourceURL=/js/widgets/damage.js
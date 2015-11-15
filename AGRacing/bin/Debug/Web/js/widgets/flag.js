var AGRacingFLAGWidget = function () {
    'use strict';

    var _name = 'Flag';
    var _icon = '/images/widgets/flag.png';

    var _initialised = false;
    var _el = null;
    var _elFlag = null;
    var _lastFlag = null;

    var _properties = {
        type: 'flag',
        css: {
            left: 0,
            top: 0,
            width: 100,
            height: 100
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
        _elFlag = jQuery('<img>', { 'src': '/images/flags/none.svg' }).css({ 'pointer-events': 'none' }).addClass('flag');
        jQuery(_el).append(_elFlag);
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
            if (data.Flag !== _lastFlag) {
                _elFlag.attr('src', '/images/flags/' + AGRacingProtocol.FLAGS[data.Flag].flag);
                _lastFlag = data.Flag;
            }
        }
    }

    return {
        name: _name,
        icon: _icon,
        messages: _messages,
        tab: 'Environment',

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
//# sourceURL=/js/widgets/flag.js
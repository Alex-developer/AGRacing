var AGRacingIMAGEWidget = function () {
    'use strict';

    var _name = 'Image';
    var _icon = '/images/widgets/image.png';

    var _initialised = false;
    var _el = null;
    var _elImage = null;
    var _tab = 'Misc';
    var _supports = 'all';

    var _properties = {
        type: 'image',
        css: {
            left: 0,
            top: 0,
            width: 614,
            height: 324
        }
    };
    var _messages = [];


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
        _elImage = jQuery('<img>', { 'src': '/images/userimages/dash.png' }).css({ 'pointer-events': 'none' }).addClass('flag');
        jQuery(_el).append(_elImage);
        _initialised = true;
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
        tab: _tab,
        supports: _supports,

        element: function () {
            return _el;
        },

        init: function (element, settings) {
            return init(element, settings);
        },

        destroy: function () {
            destroy();
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
//# sourceURL=/js/widgets/misc/image.js
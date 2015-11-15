var AGRacingGROUPWidget = function () {
    'use strict';

    var _name = 'Group';
    var _icon = '/images/widgets/blank.png';

    var _initialised = false;
    var _el = null;
    var _elId = null;
    var _properties = {
        type: 'group',
        css: {
            left: 0,
            top: 0,
            width: 300,
            height: 300
        }
    };
    var _messages = [];

    function init(element, properties) {
        _el = element;
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
        jQuery(_el).css({ 'border': '1px solid #333'});
        _initialised = true;
    }

    function startEdit() {
        AGRacingWidgets.startEdit(_el, {
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
        tab: 'Misc',

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
//# sourceURL=/js/widgets/group.js
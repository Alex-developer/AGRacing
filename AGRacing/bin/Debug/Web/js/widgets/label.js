var AGRacingLABELWidget = function () {
    'use strict';

    var _name = 'Label';
    var _icon = '/images/widgets/label.png';
    var _editorField = ['text'];
    var _tab = 'Misc';
    var _supports = 'all';

    var _el = null;
    var _elId = null;
    var _properties = {
        type: 'label',
        text: 'Label',
        align: 'left',
        css: {
            left: 0,
            top: 0,
            width: 200,
            height: 45,
            'font-family': 'Lato',
            'font-weight': 'bold',
            'font-style': 'normal',
            color: 'white'
        }
    };
    var _messages = [];

    function init(element, settings) {
        _el = element;
        if (settings !== undefined) {
            _properties = settings;
        }
        buildUI();
    }

    function destroy() {
        jQuery(_el).remove();
    }

    function buildUI() {
        jQuery(_el).css('font-family', _properties.fontfamily);
        jQuery(_el).css('color', '#' + _properties.color);
        _elId = AGRacingUI.getNextId();
        var element = jQuery('<span>').css({'pointer-events': 'none'}).text(_properties.text).attr('id', _elId);

        jQuery(_el).append(element);
        jQuery('#' + _elId).bigText({horizontalAlign: _properties.align});
    }

    function startEdit() {
        AGRacingWidgets.startEdit(_el, {
            resize: function () {
                jQuery('#' + _elId).bigText({ horizontalAlign: _properties.align });
            },
            resizeStop: function () {
                jQuery('#' + _elId).bigText({ horizontalAlign: _properties.align });
            }
        });
    }

    function finishEdit(selectedWidget) {
        AGRacingWidgets.finishEdit(_el, _properties);
        return _properties;
    }

    function setEditorFields() {
        var text = jQuery(_el).text();
        jQuery('#widgettext').val(text);
    }

    function propertyChanged(property, value) {
        switch (property) {
            case 'text':
                jQuery('#' + _elId).text(value);
                jQuery('#' + _elId).bigText({ horizontalAlign: _properties.align });
                _properties.text = value;
                break;

            case 'align':
                jQuery('#' + _elId).bigText({ horizontalAlign: _properties.align });
                _properties.align = value;
                break;
        }
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

        finishEdit: function (selectedWidget) {
            return finishEdit(selectedWidget);
        },

        setEditorFields: function () {
            setEditorFields();
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
            propertyChanged(property, value);
        }

    }
};
//# sourceURL=/js/widgets/label.js
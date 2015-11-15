var AGRacingGEARWidget = function () {
    'use strict';

    var _name = 'Gear';
    var _icon = '/images/widgets/gear.png';
    var _labels = ['Gear'];

    var _initialised = false;
    var _el = null;
    var _elId = null;
    var _lastGear = null;

    var _properties = {
        type: 'gear',
        css: {
            left: 0,
            top: 0,
            width: 50,
            height: 50,
            'font-family': 'ledfont',
            'font-weight': 'bold',
            color: 'white'
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
        _el.css('font-weight', _properties.fontweight);
        _el.css('color', '#' + _properties.color);
        _elId = AGRacingUI.getNextId();
        var element = jQuery('<span>')
            .css({
                'pointer-events': 'none'
            })
            .text('N')
            .attr('id', _elId);

        jQuery(_el).append(element);
        jQuery('#' + _elId).bigText();
        _initialised = true;
    }

    function updateUI(data) {
        if (_initialised) {
            if (_lastGear !== data.Gear) {
                switch (data.Gear) {
                    case -1:
                        jQuery('#' + _elId).text('R');
                        break;

                    case 0:
                        jQuery('#' + _elId).text('N');
                        break;

                    default:
                        jQuery('#' + _elId).text(data.Gear);
                        break;
                }
                _lastGear = data.Gear;
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

    function propertyChanged(property, value) {
        switch (property) {
            case 'color':
                _properties.color = value;
                break;
        }
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
//# sourceURL=/js/widgets/gear.js
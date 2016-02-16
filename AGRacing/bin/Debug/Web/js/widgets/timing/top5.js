var AGRacingTOP5Widget = function () {
    'use strict';

    var _name = 'Top 5';
    var _icon = '/images/widgets/top5.png';
    var _labels = ['Top 5'];
    var _tab = 'Timing';
    var _supports = ['iRacing', 'Project Cars'];

    var _initialised = false;
    var _el = null;
    var _elId = null;
    var _properties = {
        type: 'top5',
        css: {
            left: 0,
            top: 0,
            width: 300,
            height: 300
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
        jQuery(_el).remove();
    }

    function buildUI() {
        _elId = AGRacingUI.getNextId();
        var html = '<div id="' + _elId  + '" class="smsall-5 lasrge-5 colsumns">\
            <h4>1&nbsp;&nbsp;<span class="position0"></span></h4>\
            <h4>2&nbsp;&nbsp;<span class="position1"></span></h4>\
            <h4>3&nbsp;&nbsp;<span class="position2"></span></h4>\
            <h4>4&nbsp;&nbsp;<span class="position3"></span></h4>\
            <h4>5&nbsp;&nbsp;<span class="position4"></span></h4>\
        </div>';
        jQuery(_el).append(html);
        _initialised = true;
    }

    function updateUI(data) {
        if (_initialised) {
            var drivers = data.CurrentSession.Drivers.DriverList;
            for (var i = 0; i < drivers.length; i++) {
                jQuery('#' + _elId + ' .position' + (drivers[i].Position - 1)).html(drivers[i].Name);
            }
        }
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
//# sourceURL=/js/widgets/timing/top5.js
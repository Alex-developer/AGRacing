var AGRacingTOP5Widget = function () {
    'use strict';

    var _name = 'Top 5';
    var _icon = '/images/widgets/top5.png';
    var _labels = ['Top 5'];

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
    var _messages = ['timingdata'];

    function init(element) {
        _el = element;
        buildUI();
    }

    function destroy() {
        _initialised = false;
        jQuery(_el).remove();
    }

    function buildUI() {
        var html = '<div class="smsall-5 lasrge-5 colsumns">\
            <h4>1&nbsp;&nbsp;<span id="position0"></span></h4>\
            <h4>2&nbsp;&nbsp;<span id="position1"></span></h4>\
            <h4>3&nbsp;&nbsp;<span id="position2"></span></h4>\
            <h4>4&nbsp;&nbsp;<span id="position3"></span></h4>\
            <h4>5&nbsp;&nbsp;<span id="position4"></span></h4>\
        </div>';
        jQuery(_el).append(html);
        _initialised = true;
    }

    function updateUI(data) {
        if (_initialised) {
            for (var i = 0; i < data.PlayerStates.length; i++) {
                jQuery('#position' + (data.PlayerStates[i].Position - 1)).html(data.PlayerStates[i].Name);
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
        tab: 'Timing',

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
//# sourceURL=/js/widgets/top5.js
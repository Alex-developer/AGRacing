var AGRacingWORLDFASTESTSECTORSWidget = function () {
    'use strict';

    var _name = 'World Fastest Sectors';
    var _icon = '/images/widgets/top5.png';
    var _labels = ['World Fastest Sectors', 'World Sectors Best'];

    var _initialised = false;
    var _el = null;
    var _elId = null;
    var _properties = {
        type: 'worldfastestsectors',
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
    }

    function updateUI(data) {
        if (!_initialised) {
            for (var i = 0; i < data.WorldFastestSectors.length; i++) {
                jQuery(_el).append('<h4>' + (i+1) + '&nbsp;&nbsp;<span class="position' +  i + '"></span></h4>');
            }
            _initialised = true;
        }
        for (i = 0; i < data.WorldFastestSectors.length; i++) {
            if (data.WorldFastestSectors[i] !== -1) {
                jQuery('#' + _el.attr('id') + ' .position' + i).html(data.WorldFastestSectors[i].toHHMMSS(true));
            } else {
                jQuery('#' + _el.attr('id') + ' .position' + i).html('--:--:--');
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
//# sourceURL=/js/widgets/worldfastestsectors.js
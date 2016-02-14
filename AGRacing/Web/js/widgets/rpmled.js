var AGRacingRPMLEDWidget = function () {
    'use strict';

    var _name = 'RPM LED';
    var _icon = '/images/widgets/ledrpm.png';
    var _labels = ['RPM'];
    var _tab = 'Car';
    var _supports = ['iRacing', 'Project Cars'];

    var _el = null;
    var _lastRPM = null;

    var _initialised = false;
    var _properties = {
        type: 'rpmled',
        css: {
            left: 0,
            top: 0,
            width: 650,
            height: 50
        }
    };
    var _numberOfCircles = 12;
    var _colours = ['#a1fe00', '#beff00', '#dffe00', '#ffff00', '#fde100', '#febe04', '#ff9f00', '#ff7d07', '#ff5d00', '#ff3f00', '#ff1d00', '#fe0005'];
    var _messages = ['cardata', 'environmentdata'];
    var _maxRPM = 0;
    var _rpmPerCircle = 0;
    var _circles = null;

    function init(element) {
        _el = element;
        buildUI();
    }

    function destroy() {
        _initialised = false;
        jQuery(_el).remove();
    }

    function buildUI() {
        _initialised = false;
        jQuery(_el).children().remove('.circle');
        jQuery(_el).css({ overflow: 'hidden' });

        var height = jQuery(_el).height();
        var width = jQuery(_el).width();
        var padding = (width - (height * _numberOfCircles)) / _numberOfCircles;

        for (var i = 0; i < _numberOfCircles; i++) {
            var div = jQuery('<div>').css({
                'width': height,
                'height': height,
                'margin-right': padding,
                'background': '#333'
            }).addClass('circle');
            jQuery(_el).append(div);
        }
        _circles = jQuery(_el).children('.circle');
        _initialised = true;
    }

    function updateUI(data, dataType) {
        if (_initialised) {
            
            switch (dataType) {
                case 'environmentdata':
                    if (data.MaxRPM > 0) {
                        _maxRPM = data.MaxRPM;
                        _rpmPerCircle = _maxRPM / _numberOfCircles;
                    }
                    break;

                case 'cardata':
                    /**
                    * Fudge for games that done have max RPM for the engine. We track the highest RPM
                    * and recalculate the RPM per circle value.
                    * TODO: What about bad downshifts where the RPM can go mental??
                    **/
                    if (data.RPM.toFixed(0) > parseInt(_maxRPM,10)) {
                        _maxRPM = data.RPM.toFixed(0);
                        _rpmPerCircle = _maxRPM / _numberOfCircles;
                    }

                    if (_maxRPM !== null) {
                        if (_lastRPM !== data.RPM.toFixed(0)) {
                            var limit = data.RPM.toFixed(0) / _rpmPerCircle;
                            jQuery.each(_circles, function (index, circle) {
                                if (index < limit) {
                                    jQuery(circle).css({ 'background': _colours[index] });
                                } else {
                                    jQuery(circle).css({ 'background': '#333' });
                                }
                            });
                            _lastRPM = data.RPM.toFixed(0);
                        }
                    }
                    break;
            }
        }
    }

    function startEdit() {
        AGRacingWidgets.startEdit(_el, {
            resize: function () {
                buildUI();
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
        tab: _tab,
        supports: _supports,

        element: function () {
            return _el;
        },

        init: function (element) {
            return init(element);
        },

        destroy: function() {
            destroy();
        },

        updateUI: function (data, dataType) {
            updateUI(data, dataType);
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
//# sourceURL=/js/widgets/rpmled.js
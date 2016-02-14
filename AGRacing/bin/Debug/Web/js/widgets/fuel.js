var AGRacingFUELWidget = function () {
    'use strict';

    var _name = 'Fuel';
    var _icon = '/images/widgets/gauge.png';
    var _labels = ['Fuel'];
    var _tab = 'Car';
    var _supports = ['iRacing', 'Project Cars'];

    var _initialised = false;
    var _el = null;
    var _lastFuel = null;
    var _elId = null;
    var _editing = false;

    var _properties = {
        type: 'fuel',
        gaugestyle: 'digital',
        units: 'metric',
        css: {
            left: 0,
            top: 0,
            width: 200,
            height: 100,
            'font-family': 'ledfont',
            'font-weight': 'bold',
            color: 'white'
        }
    };
    var _scripts = [
        'kendo/kendo.dataviz.gauge.min'
    ];
    var _messages = ['cardata'];

    function init(element) {
        _el = element;
        require(_scripts, function () {
            buildUI();
        });
    }


    function destroy(leaveElement) {
        if (leaveElement === undefined) {
            leaveElement = false;
        }
        _initialised = false;
        if (_properties.gaugestyle === 'digital') {
        } else {
            kendo.destroy(jQuery(_el));
            jQuery(jQuery(_el)).html('');
        }
        if (!leaveElement) {
            jQuery(_el).remove();
        }
        if (_editing && leaveElement === true) {
            finishEdit();
            startEdit();
        }
    }

    function buildUI() {
        if (_properties.gaugestyle === 'digital') {
            _elId = AGRacingUI.getNextId();

            jQuery(_el).css('font-family', _properties.fontfamily);
            jQuery(_el).css('color', '#' + _properties.color);
            
            var element = jQuery('<span>').css({ 'pointer-events': 'none' }).html('00.0').attr('id', _elId);
            var fuel = jQuery('<span>').html('F').css('font-family', 'widgets').css('font-size', '0.6em');

            element.append(fuel);
            jQuery(_el).append(element);
            jQuery('#' + _elId).bigText();
        } else {
            jQuery(_el).kendoRadialGauge({
                theme: "black",

                pointer: {
                    value: 0.5,
                    color: "#ea7001"
                },

                scale: {
                    startAngle: 90,
                    endAngle: 180,

                    min: 0,
                    max: 1,

                    majorUnit: 0.5,
                    majorTicks: {
                        width: 2,
                        size: 6
                    },

                    minorUnit: 0.25,
                    minorTicks: {
                        size: 3
                    },

                    ranges: [{
                        from: 0,
                        to: 0.1,
                        color: "#c20000"
                    }],

                    labels: {
                        font: "9px Arial,Helvetica,sans-serif"
                    }
                }
            });
        }

        _initialised = true;
    }

    function updateUI(data) {
        if (_initialised) {
            if (_lastFuel !== data.FuelLevel) {
                var fuel = data.FuelLevel * data.FuelCapacity;

                switch (_properties.units) {
                    case 'metric':
                        break;
                    case 'imperial':
                        fuel = fuel * 0.219969;
                        break;
                    case 'us':
                        fuel = fuel * 0.264172;
                        break;
                }

                if (_properties.gaugestyle === 'digital') {
                    jQuery('#' + _elId).html(fuel.toFixed(1));
                    var fuel = jQuery('<span>').html('F').css('font-family', 'widgets').css('font-size', '0.6em');
                    jQuery('#' + _elId).append(fuel);
                } else {
                    jQuery(_el).data('kendoRadialGauge').value(fuel.toFixed(1));
                }
                _lastFuel = data.FuelLevel;
            }
        }
    }

    function startEdit() {
        _editing = true;

        AGRacingWidgets.startEdit(_el, {
            resize: function () {
                if (_properties.gaugestyle === 'digital') {
                    jQuery('#' + _elId).bigText();
                } else {
                    jQuery(_el).data('kendoRadialGauge').resize();
                }
            },
            resizeStop: function () {
                if (_properties.gaugestyle === 'digital') {
                    jQuery('#' + _elId).bigText();
                } else {
                    jQuery(_el).data('kendoRadialGauge').resize();
                }
            }
        });

    }

    function finishEdit() {
        _editing = false;
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

        setStyle: function (gaugestyle) {
            destroy(true);
            _properties.gaugestyle = gaugestyle;
            init(_el, _properties);
        },

        setUnits : function (units) {
            _properties.units = units;
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
//# sourceURL=/js/widgets/fuel.js
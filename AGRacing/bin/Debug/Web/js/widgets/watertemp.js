var AGRacingWATERTEMPWidget = function () {
    'use strict';

    var _name = 'Water';
    var _icon = '/images/widgets/gauge.png';
    var _labels = ['Water Temperature', 'Water Temp.', 'Water'];

    var _initialised = false;
    var _el = null;
    var _lastWaterTemp = null;

    var _properties = {
        type: 'watertemp',
        css: {
            left: 0,
            top: 0,
            width: 300,
            height: 300
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

    function destroy() {
        _initialised = false;
        kendo.destroy(jQuery(_el));
        jQuery(_el).remove();
    }

    function buildUI() {
        jQuery(_el).kendoRadialGauge({
            theme: "black",

            pointer: {
                value: 0,
                color: "#ea7001"
            },

            scale: {
                startAngle: 180,
                endAngle: 270,

                min: 40,
                max: 120,

                majorUnit: 30,
                majorTicks: {
                    width: 2,
                    size: 6
                },

                minorUnit: 10,
                minorTicks: {
                    size: 3
                },

                ranges: [{
                    from: 110,
                    to: 120,
                    color: "#c20000"
                }],

                labels: {
                    font: "9px Arial,Helvetica,sans-serif"
                }
            }
        });

        _initialised = true;
    }

    function updateUI(data) {
        if (_initialised) {
            var waterTemp = data.WaterTemp.toFixed(2);
            if (_lastWaterTemp !== waterTemp) {
                jQuery(_el).data('kendoRadialGauge').value(waterTemp);
                _lastWaterTemp = waterTemp;
            }
        }
    }

    function startEdit() {
        AGRacingWidgets.startEdit(_el, {
            resize: function () {
                jQuery(_el).data('kendoRadialGauge').resize();
            },
            resizeStop: function () {
                jQuery(_el).data('kendoRadialGauge').resize();
            }
        }, 1);
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
//# sourceURL=/js/widgets/watertemp.js
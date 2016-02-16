var AGRacingOILTEMPWidget = function () {
    'use strict';

    var _name = 'Oil';
    var _icon = '/images/widgets/gauge.png';
    var _labels = ['Oil Temperature', 'Oil Temp.', 'Oil'];
    var _tab = 'Engine';
    var _supports = ['iRacing'];

    var _initialised = false;
    var _el = null;
    var _elId = null;
    var _lastOilTemp = null;
    var _editing = false;

    var _properties = {
        type: 'oiltemp',
        gaugestyle: 'digital',
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

    function init(element, properties) {
        if (element !== undefined) {
            _el = element;
        }
        if (properties !== undefined) {
            _properties = properties;
        }
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
            var element = jQuery('<span>').css({ 'pointer-events': 'none' }).html('0').attr('id', _elId);

            jQuery(_el).append(element);
            jQuery('#' + _elId).bigText({ horizontalAlign: _properties.align });
        } else {
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
        }
        _initialised = true;
    }

    function updateUI(data) {
        if (_initialised) {
            var oilTemp = data.Engine.OilTemp.toFixed(2);
            if (_lastOilTemp !== oilTemp) {
                if (_properties.gaugestyle === 'digital') {
                    jQuery('#' + _elId).html(oilTemp);
                } else {
                    jQuery(_el).data('kendoRadialGauge').value(oilTemp);
                }
                _lastOilTemp = oilTemp;
            }
        }
    }

    function startEdit() {
        _editing = true;

        AGRacingWidgets.startEdit(_el, {
            resize: function () {
                if (_properties.gaugestyle === 'digital') {
                    jQuery('#' + _elId).bigText({ horizontalAlign: _properties.align });
                } else {
                    jQuery(_el).data('kendoRadialGauge').resize();
                }
            },
            resizeStop: function () {
                if (_properties.gaugestyle === 'digital') {
                    jQuery('#' + _elId).bigText({ horizontalAlign: _properties.align });
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
            propertyChanged(property, value);
        },

        setStyle: function (gaugestyle) {
            destroy(true);
            _properties.gaugestyle = gaugestyle;
            init(_el, _properties);
        }

    }
};
//# sourceURL=/js/widgets/engine/watertemp.js
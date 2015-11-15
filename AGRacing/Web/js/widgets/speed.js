var AGRacingSPEEDWidget = function () {
    'use strict';

    var _name = 'Speed';
    var _icon = '/images/widgets/gauge.png';
    var _labels = ['Speed'];

    var _initialised = false;
    var _el = null;
    var _elId = null;
    var _lastSpeed = null;

    var _editing = false;
    var _properties = {
        type: 'speed',
        gaugestyle: 'digital',
        align: 'left',
        css: {
            left: 0,
            top: 0,
            width: 200,
            height: 100
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
        if (_editing && leaveElement) {
            finishEdit();
            startEdit();
        }
    }

    function buildUI() {
        if (_properties.gaugestyle === 'digital') {
            _elId = AGRacingUI.getNextId();
            var element = jQuery('<span>').css({ 'font-family': 'ledFont' }).html('000').attr('id', _elId);

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
                    startAngle: -60,
                    endAngle: 240,

                    min: 0,
                    max: 220,

                    majorTicks: {
                        width: 1,
                        size: 14
                    },
                    majorUnit: 20,

                    minorTicks: {
                        size: 10
                    },

                    minorUnit: 2
                }
            });
        }
        _initialised = true;
    }


    function updateUI(data) {
        if (_initialised) {
            if (_lastSpeed !== data.Speed.toFixed(2)) {
                if (_properties.gaugestyle === 'digital') {
                    jQuery('#' + _elId).html(data.Speed.toFixed(2));
                } else {
                    jQuery(_el).data('kendoRadialGauge').value(data.Speed.toFixed(2));
                }
                _lastSpeed = data.Speed.toFixed(2);
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
        tab: 'Car',

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

        setStyle: function (gaugestyle) {
            destroy(true);
            _properties.gaugestyle = gaugestyle;
            init();
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
//# sourceURL=/js/widgets/speed.js
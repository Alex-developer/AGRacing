var AGRacingTYRESWidget = function () {
    'use strict';

    var _name = 'Tyres';
    var _icon = '/images/widgets/tyres.png';
    var _labels = ['Tyre Status', 'Tyres'];

    var _initialised = false;
    var _el = null;


    var _properties = {
        type: 'tyres',
        css: {
            left: 0,
            top: 0,
            width: 300,
            height: 300
        }
    };
    var _messages = ['cardata'];
    var _scripts = [
        '/js/konva/konva.min.js'
    ];

    function init(element, properties) {
        _el = element;
        _properties = properties;
        require(_scripts, function () {
            buildUI();
        });
    }

    function destroy() {
        _initialised = false;
        jQuery(_el).remove();
    }

    function buildUI() {
        jQuery(_el).html('<table style="width:100%;height:100%" cellpadding="0" cellspacing="0">\
            <tr>\
                <td rowspan="2" width="20%" valign="bottom" style="text-align: center;"><span id="fltw" style="font-size: 1em;font-weight: bold;">0</span><img src="/images/tread1.svg" style="margin-bottom: 10px;" /><span id="fltt" style="font-size: 2em;font-weight: bold;">0</span></td>\
                <td width="20%"></td>\
                <td width="20%"></td>\
                <td rowspan="2" width="20%" valign="bottom" style="text-align: center;"><span id="frtw" style="font-size: 1em;font-weight: bold;">0</span><img src="/images/tread1.svg" style="margin-bottom: 10px;" /><span id="frtt" style="font-size: 2em;font-weight: bold;">0</span></td>\
            </tr>\
            <tr>\
                <td valign="bottom" style="text-align: center;"><span id="flbd" style="font-size: 1em;font-weight: bold;">0</span><img src="/images/caliper.svg" style="margin-bottom: 10px;" /><span id="fl" style="font-size: 2em;font-weight: bold;">0</span></td>\
                <td valign="bottom" style="text-align: center;"><span id="frbd" style="font-size: 1em;font-weight: bold;">0</span><img src="/images/caliper.svg" style="margin-bottom: 10px;" /><span id="fr"style="font-size: 2em;font-weight: bold;">0</span></td>\
            </tr>\
            <tr>\
                <td rowspan="2" valign="bottom" style="text-align: center;"><span id="rltw" style="font-size: 1em;font-weight: bold;">0</span><img src="/images/tread1.svg" style="margin-bottom: 10px;" /><span id="rltt" style="font-size: 2em;font-weight: bold;">0</span></td>\
                <td></td>\
                <td></td>\
                <td rowspan="2" valign="bottom" style="text-align: center;"><span id="rrtw" style="font-size: 1em;font-weight: bold;">0</span><img src="/images/tread1.svg" style="margin-bottom: 10px;" /><span id="rrtt" style="font-size: 2em;font-weight: bold;">0</span></td>\
            </tr>\
            <tr>\
                <td valign="bottom" style="text-align: center;"><span id="rlbd" style="font-size: 1em;font-weight: bold;">0</span><img src="/images/caliper.svg" style="margin-bottom: 10px;" valign="bottom" style="text-align: center;" /><span id="rl"style="font-size: 2em;font-weight: bold;">0</td>\
                <td valign="bottom" style="text-align: center;"><span id="rrbd" style="font-size: 1em;font-weight: bold;">0</span><img src="/images/caliper.svg" style="margin-bottom: 10px;" valign="bottom" style="text-align: center;" /><span id="rr"style="font-size: 2em;font-weight: bold;">0</td>\
            </tr>\
        </table>');
        _initialised = true;
    }

    function drawBackground() {

    }


    function startEdit() {
        AGRacingWidgets.startEdit(_el, {
            resize: function () {
                drawBackground();
            },
            resizeStop: function () {
                drawBackground();
            }
        });
    }

    function finishEdit() {
        AGRacingWidgets.finishEdit(_el, _properties);
        return _properties;
    }

    function updateUI(data) {

        setValue('#fl', data.BrakeTemp[0].toFixed(0), false);
        setValue('#fr', data.BrakeTemp[1].toFixed(0), false);
        setValue('#rl', data.BrakeTemp[2].toFixed(0), false);
        setValue('#rr', data.BrakeTemp[3].toFixed(0), false);


        setValue('#fltt', data.TyreTemp[0].toFixed(0), false);
        setValue('#frtt', data.TyreTemp[1].toFixed(0), false);
        setValue('#rltt', data.TyreTemp[2].toFixed(0), false);
        setValue('#rrtt', data.TyreTemp[3].toFixed(0), false);

        setValue('#fltw', (data.TyreWear[0] * 100).toFixed(0), true);
        setValue('#frtw', (data.TyreWear[1] * 100).toFixed(0), true);
        setValue('#rltw', (data.TyreWear[2] * 100).toFixed(0), true);
        setValue('#rrtw', (data.TyreWear[3] * 100).toFixed(0), true);

        setValue('#flbd', (data.BrakeDamage[0] * 100).toFixed(0), true);
        setValue('#frbd', (data.BrakeDamage[0] * 100).toFixed(0), true);
        setValue('#rlbd', (data.BrakeDamage[0] * 100).toFixed(0), true);
        setValue('#rrbd', (data.BrakeDamage[0] * 100).toFixed(0), true);
    }

    function setValue(el, value, showColour) {

        if (showColour) {
            if (value <= 50) {
                jQuery(el).css('colour', 'green');
            } else {
                if (value <= 75) {
                    jQuery(el).css('colour', 'orange');
                } else {
                    jQuery(el).css('colour', 'red');
                }
            }
        }
        jQuery(el).text(value);
        
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

        init: function (element, settings) {
            return init(element, settings);
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
//# sourceURL=/js/widgets/tyres.js
var AGRacingView = function () {
    'use strict';

    var _scripts = [
        '/js/widgets/timing/timingscreen.js'
    ];

    var _initialised = false;
    var _timingScreen = null;


    function init() {
        _timingScreen = new AGRacingTIMINGSCREENWidget();
        var properties = {
            type: 'timingscreen',
            css: {
                left: 0,
                top: 0,
                width: '100%',
                height: '100%'
            }
        };
        var el = jQuery('#timingpage');
        _timingScreen.init(el, properties);
    }

    function buildUI() {
        jQuery('#timings').html('');
    }


    function updateUI(message) {
        if (_timingScreen.updateUI !== undefined) {
            if (_timingScreen.messages !== undefined) {
                if (_timingScreen.messages.indexOf(message.datatype) !== -1) {
                    _timingScreen.updateUI(message.data, message.datatype);
                }
            }
        }
    }

    return {
        init: function () {
            return init();
        },

        buildUI: function () {
            buildUI();
        },

        updateUI: function (data) {
            updateUI(data);
        },

        scripts: function () {
            return _scripts;
        }

    }
}();
//# sourceURL=/js/pages/time/time.js
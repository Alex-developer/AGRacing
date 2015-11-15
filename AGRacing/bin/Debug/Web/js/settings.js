var AGRacingSettings = (function () {
    'use strict';

    var _cookieVersion = 3.0;

    var _defaultSettings = {
        dashBoards: {
            0: {
                name: 'Default',
                widgets: [
                   {
                       type: 'acceleration',
                       left: 0,
                       top: 0,
                       width: 200,
                       height: 200
                   }
                ]
            }
        }
    };

    var _settings = jQuery.extend(true, {}, _defaultSettings);

    var COOKIENAME = 'agracing';
    var COOKIEEXPIRES = 300;

    /**
    * Save all of our settings to a cookie
    */
    function saveSettings() {
        var cookieData = JSON.stringify(_settings);

        Cookies.set(COOKIENAME, cookieData, { expires: COOKIEEXPIRES });
    }


    /**
    * Load settings from a cookie if one is found
    */
    if (Cookies.get(COOKIENAME) !== null) {
        var cookieData = Cookies.get(COOKIENAME);
        var savedSettings = {};
        if (cookieData !== undefined) {
            savedSettings = JSON.parse(cookieData);
        }
        _settings = $.extend(true, _settings, savedSettings);

    }

    return {
        init: function () {
        },

        reset: function () {
            _settings = jQuery.extend(true, {}, _defaultSettings);
            saveSettings();
        },

        getDashboard: function (number) {
            return _settings.dashBoards[number];
        },

        saveDashboard: function (number, widgets) {
            _settings.dashBoards[number].widgets = widgets;
            saveSettings();
        }

    };
})();
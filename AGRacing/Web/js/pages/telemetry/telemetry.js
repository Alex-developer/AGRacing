var AGRacingView = function () {
    'use strict';

    var _initialised = false;
    var _dataReader = {
        carData: 0,
        timingData: 0,
        environmentData: 0
    };

    function init() {
        var deferred = new jQuery.Deferred();

        deferred.resolve();

        return deferred.promise();
    }

    function buildUI() {

    }

    function updateUI(message) {

    }


    return {
        init: function () {
            return init();
        },

        initDataReader: function () {
            return _dataReader;
        },

        buildUI: function () {
            buildUI();
        },

        updateUI: function (data) {
            updateUI(data);
        }

    }
}();
//# sourceURL=/js/pages/telemetry/telemetry.js
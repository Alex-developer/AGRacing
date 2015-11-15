var AGRacingView = function () {
    'use strict';

    var _initialised = false;

    function init() {
        var deferred = new jQuery.Deferred();

        deferred.resolve();

        return deferred.promise();
    }

    function buildUI() {

        _initialised = true;
    }

    function updateUI(data) {
        if (_initialised) {
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
        }

    }
}();
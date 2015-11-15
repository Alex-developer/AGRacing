var AGRacingView = function () {
    'use strict';

    var _initialised = false;

    var _scripts = [
        '/js/widgets.js',
        '/js/pages/dash/editor.js',
        '/js/colourpicker/js/colpick.js',
        '/js/dashboards.js'
    ];

    function init() {
        loadAllWidgets().done(function () {
            AGRacingDashBoards.readDashBoards().done(function () {
                buildDashTree();
                displayDashPage();
                AGRacingDashEditor.init();
                _initialised = true;
            });
        });
    }

    function loadAllWidgets() {
        return AGRacingWidgets.loadAllWidgets();
    }

    function buildDashTree() {
        jQuery('#dashtreepages').html('');
        jQuery.each(AGRacingDashBoards.getDashBoards(), function (index, dashBoard) {
            var dashBoardTreeHTML = '<h3>' + dashBoard.name + '</h3>';
            jQuery('#dashtreepages').append(dashBoardTreeHTML);
        });
    }

    function displayDashPage() {
        jQuery('#dashpage').html('');
        var activeDashBoard = AGRacingDashBoards.getActiveDashBoard();
        jQuery.each(activeDashBoard.widgets, function (widgetName, settings) {
            AGRacingWidgets.createWidget(settings.type, settings);
        });
    }

    function updateUI(message) {
        if (_initialised) {        
            jQuery.each(AGRacingWidgets.getWidgets(), function (index, widget) {
                if (widget.updateUI !== undefined) {
                    if (widget.messages !== undefined) {
                        if (widget.messages.indexOf(message.datatype) !== -1) {
                            widget.updateUI(message.data, message.datatype);
                        }
                    }
                }
            });
        }
    }

    function destroy() {
        AGRacingDashEditor.destroy();
    }

    function connected() {
    }

    function notConnected() {

    }

    return {
        init: function () {
            return init();
        },

        destroy: function() {
            destroy();
        },

        scripts: function () {
            return _scripts;
        },

        buildUI: function() {
            buildUI();
        },

        updateUI: function (message) {
            updateUI(message);
        },

        connected: function () {
            connected();
        },

        notConnected: function () {
            notConnected();
        }
    }
}();
//# sourceURL=/js/pages/dash/dash.js
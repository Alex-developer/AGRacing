var AGRacingDashBoards = function () {
    'use strict';

    var _localStorageCookie = 'agracing';
    var _localStorageTime = 365;
    var _localStorage = true;
    var _activeDashPage = 0;

    var _defaultDashboards = {
        0: {
            name: 'Default',
            widgets: [
                {
                    type: 'acceleration',
                    css: {
                        left: 0,
                        top: 0,
                        width: 200,
                        height: 200
                    }
                },
                {
                    type: 'rpm',
                    gaugestyle: 'digital',
                    css: {
                        left: 300,
                        top: 100,
                        width: 300,
                        height: 100,
                        'font-family': 'ledfont',
                        'font-weight': 'bold',
                        color: 'white'
                    }
                },
                {
                    type: 'label',
                    text: 'Label',
                    css: {
                        left: 50,
                        top: 200,
                        width: 200,
                        height: 45,
                        'font-family': 'Lato',
                        'font-weight': 'bold',
                        color: 'white'
                    }
                }
            ]
        }
    };

    var _dashBoards = _defaultDashboards;

    function readDashBoards() {
        var deferred = new jQuery.Deferred();
        if (_localStorage) {
            if (Cookies.get(_localStorageCookie) !== null) {
                var cookieData = Cookies.get(_localStorageCookie);
                if (cookieData !== undefined) {
                    _dashBoards = JSON.parse(cookieData);
                }
            } else {
                _dashBoards = _defaultDashboards;
            }
            console.log(JSON.stringify(_dashBoards));
            deferred.resolve();
        } else {
            jQuery.ajax({
                url: _dataURI + 'LoadDashBoards?nonce=' + (new Date).getTime(),
                dataType: 'json'
            }).done(function (data) {
                _dashBoards = data
                deferred.resolve();
            }).fail(function (xhr, stats) {
                deferred.resolve();
            });
        }
        return deferred.promise();
    }

    function saveDashBoards() {
        var deferred = new jQuery.Deferred();
        if (_localStorage) {
            var cookieData = JSON.stringify(_dashBoards);
            Cookies.set(_localStorageCookie, cookieData, { expires: _localStorageTime });
        } else {
            jQuery.ajax({
                url: _dataURI + 'SaveDashBoards?nonce=' + (new Date).getTime(),
                method: 'post',
                data: JSON.stringify(_dashBoards)
            }).done(function (data) {
                deferred.resolve();
            }).fail(function (xhr, stats) {
                deferred.resolve();
            });
        }
        return deferred.promise();
    }

    return {
        getActiveDashBoard : function() {
            return _dashBoards[_activeDashPage];
        },

        getDashBoards: function() {
            return _dashBoards;
        },

        readDashBoards: function () {
            return readDashBoards();
        },

        saveDashBoards: function () {
            return saveDashBoards();
        },

        updateDashPage: function (widgets) {
            _dashBoards[_activeDashPage].widgets = widgets;
        }
    }
}();
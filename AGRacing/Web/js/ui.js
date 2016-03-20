var AGRacingUI = function () {
    'use strict';
    
    var _pages = [
            'home',
            'dash',
            'time',
            'track',
            'telemetry'
        ];
    var _currentPage = 1;
    var _id = 0;
    var _selectedWidget = null;
    var _pageName = '';
    var _gridSize = 5;

    function initUI() {
        jQuery(document).foundation({
            offcanvas : {
                open_method: 'overlap_single', 
                close_on_click : false
            }
        });

        var hash = location.hash.substring(location.hash.indexOf('#') + 1);
        if (hash !== '') {
            for (var i = 0; i < _pages.length; i++) {
                if (_pages[i] === hash) {
                    _currentPage = i;
                    loadPage(hash);
                    break;
                }
            }
        } else {
            loadPage(_pages[_currentPage]);
        }

        jQuery(document).on('click', '.loadpage', function (e) {
            var page = jQuery(this).data('page');
            for (var i = 0; i < _pages.length; i++) {
                if (_pages[i] === page) {
                    _currentPage = i;
                    loadPage(page);
                    break;
                }
            }
        });

        jQuery(window).resize(function () {
            if (AGRacingView.resize !== undefined) {
                AGRacingView.resize();
            }
        });

        require.config({
            paths: {
                page: '/ja/pages',
                kendo: '/js/kendo/js',
                widget: '/js/widgets'
            }
        });

    } 

    function loadPage(page) {
        AGRacing.stopDataReader();
        jQuery('body').append('<span id="overlay"><span>Loading</span></span>');

        var _pageHTML = '/js/pages/' + page + '/' + page + '.html';

        if (typeof AGRacingView !== 'undefined') {
            if (AGRacingView.destroy !== undefined) {
                AGRacingView.destroy();
            }
        }
        jQuery.ajax({
            url: _pageHTML,
            cache: false
        }).done(function (html) {
            jQuery('#content').html(html);

            var leftHTML = '/js/pages/' + page + '/left.html';
            jQuery.ajax({
                url: leftHTML,
                cache: false
            }).done(function (html) {
                jQuery('#leftmenu').html(html);
            }).error(function (e) {
                jQuery('#leftmenu').html('');
            }).always(function (e) {
                var _rightHTML = '/js/pages/' + page + '/right.html';
                jQuery.ajax({
                    url: _rightHTML,
                    cache: false
                }).done(function (html) {
                    jQuery('#rightmenu').html(html);
                }).error(function (e) {
                    jQuery('#rightmenu').html('');
                }).always(function (e) {
                    var _controllerJS = '/js/pages/' + page + '/' + page + '.js';
                    jQuery.getScript(_controllerJS).done(function (e) {

                        var config;
                        if (AGRacingView.initDataReader !== undefined) {
                            config = AGRacingView.initDataReader();
                        }

                        if (AGRacingView.scripts !== undefined) {
                            var scripts = AGRacingView.scripts();
                            require(scripts, function () {
                                AGRacingView.init();
                                AGRacing.startDataReader(config);
                            });
                        } else {
                            AGRacingView.init();
                            AGRacing.startDataReader(config);
                        }
                        location.hash = page;
                    }).error(function (e) {
                        debugger;
                    }).always(function (e) {
                        jQuery('#overlay').remove();
                        _pageName = capitaliseFirstLetter(page);
                        jQuery('#pagetitle').text('AG Racing Dashboard - ' + _pageName);
                        jQuery(document).foundation();
                    });
                });
            });
        });
    }

    function notConnected() {
        if (jQuery('#overlay').length === 0) {
           jQuery('body').append('<span id="overlay"><span>Waiting For Game ...</span></span>');
            if (AGRacingView.notConnected !== undefined) {
                AGRacingView.notConnected();
            }
        }
    }

    function connected(gameInfo) {
        jQuery('#overlay').remove();
        jQuery('#pagetitle').text('AG Racing Dashboard (' + gameInfo.GameName + ') - ' + _pageName);
        if (AGRacingView.connected !== undefined) {
            AGRacingView.connected(gameInfo);
        }
    }

    function capitaliseFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function getNextId() {
        _id++;

        return 'ag_' + _id;
    }

    function drawGrid(el) {
        var height = el.height();
        var width = el.width();
        var ratioW = Math.floor(width / _gridSize);
        var ratioH = Math.floor(height / _gridSize);

        jQuery('.gridlines').remove();

        for (var i = 0; i <= ratioW; i++) { // vertical grid lines
            jQuery('<div />').css({
                'top': 0,
                'left': i * _gridSize,
                'width': 1,
                'height': height
            })
              .addClass('gridlines')
              .appendTo(el);
        }

        for (i = 0; i <= ratioH; i++) { // horizontal grid lines
            jQuery('<div />').css({
                'top': i * _gridSize,
                'left': 0,
                'width': width,
                'height': 1
            })
              .addClass('gridlines')
              .appendTo(el);
        }

        jQuery('.gridlines').show();
    }

    function deleteGrid(el) {
        jQuery('.gridlines').remove();
    }

    return {
        gridSize: _gridSize,

        init: function () {
            initUI();
        },
        
        loadPage: function(page) {
            loadPage(page);
        },

        notConnected: function() {
            notConnected();
        },

        connected: function (gameInfo) {
            connected(gameInfo);
        },

        getNextId: function () {
            return getNextId();
        },

        drawGrid: function (el, size) {
            drawGrid(el, size);
        },

        deleteGrid: function (el) {
            deleteGrid(el);
        }
        
    }
}();
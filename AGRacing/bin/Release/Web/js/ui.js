var AGRacingUI = function () {
    'use strict';
    
    var _pages = [
            'home',
            'dash',
            'time',
            'track',
            'auto',
            'settings'
    ];
    var _currentPage = 0;

    function initUI() {
        jQuery(document).foundation({
            offcanvas : {
                open_method: 'overlap_single', 
                close_on_click : false
            }
        });

        loadPage(_pages[_currentPage]);

        jQuery('#content').hammer().bind('swipeleft', function (e) {
            _currentPage -= 1;
            if (_currentPage < 0) {
                _currentPage = _pages.length - 1;
            }
            loadPage(_pages[_currentPage]);
        });
        jQuery('#content').hammer().bind('swiperight', function (e) {
            _currentPage += 1;
            if (_currentPage === _pages.length) {
                _currentPage = 0;
            }
            loadPage(_pages[_currentPage]);
        });

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
    } 

    function loadPage(page) {
        AGRacing.stopDataReader();
        jQuery('body').append('<span id="overlay"><span>Loading</span></span>');

        var _pageHTML = '/js/pages/' + page + '/' + page + '.html';

        jQuery.ajax({
            url: _pageHTML,
            cache: false
        }).done(function (html) {
            jQuery('#content').html(html);

            var _controllerJS = '/js/pages/' + page + '/' + page + '.js';
            jQuery.getScript(_controllerJS).done(function (e) {
                AGRacingView.init().done(function (e) {
                    AGRacingView.buildUI();
                    AGRacing.startDataReader();
                });
            }).always(function (e) {
                jQuery('#overlay').remove();
            });
        });
    }

    function notConnected() {
        if (jQuery('#overlay').length === 0) {
            jQuery('body').append('<span id="overlay"><span>Waiting For Game ...</span></span>');
        }
    }

    function connected() {
        jQuery('#overlay').remove();
    }

    return {
        init: function () {
            initUI();
        },
        
        loadPage: function(page) {
            loadPage(page);
        },

        notConnected: function() {
            notConnected();
        },

        connected : function() {
            connected();
        }
        
    }
}();
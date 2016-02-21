var AGRacingDashEditor = function () {
    'use strict';

    var _editing = false;

    function init() {
        buildTopMenu();
        buildToolbox();
        buildToolbar();
        addListeners();
    }
    
    function buildTopMenu() {
        var editorMenu = '<ul>\
                            <li>\
                                <a href="#" class="item editorcontrol" id="edit">\
                                    <img src="/images/edit.png" width="32" />\
                                </a>\
                            </li>\
                            <li>\
                                <a href="#" class="item editorcontrol whenediting disabled" id="delete">\
                                    <img src="/images/delete.png" width="32" />\
                                </a>\
                            </li>\
                            <li>\
                                <a href="#" class="item editorcontrol whenediting disabled" id="load">\
                                    <img src="/images/open.png" width="32" />\
                                </a>\
                            </li>\
                            <li>\
                                <a href="#" class="item editorcontrol whenediting disabled" id="save">\
                                    <img src="/images/save.png" width="32" />\
                                </a>\
                            </li>\
                        </ul>';
        jQuery('#rightheader').html(editorMenu);

        jQuery('.right-off-canvas-toggle').hide();
    }

    function addListeners() {
        jQuery('#rightheader').on('click', '.editorcontrol', function (e) {
            var action = jQuery(this).attr('id');

            switch (action) {
                case 'edit':
                    if (!_editing) {
                        _editing = true;
                        startEditor();
                    }
                    break;
                case 'delete':
                    AGRacingWidgets.deleteSelectedWidget();
                    break;
                case 'load':
                    break;
                case 'save':
                    if (_editing) {
                        _editing = false;
                        saveWidgets();
                        stopEditor();
                    }
                    break;

            }
        });

        jQuery('#dashpage').on('click', '.agselectable', function (e) {
            if (_editing) {
                e.preventDefault();
                e.stopPropagation();

                var selectedId = jQuery(this).attr('id');
                var selectedWidget = AGRacingWidgets.setSelected(selectedId);

                jQuery('.editorfield').attr('disabled', 'disabled');

                jQuery.each(selectedWidget.getProperties().css, function (property, value) {
                    jQuery('#widget' + property).removeAttr('disabled');
                    jQuery('#widget' + property).val(jQuery(selectedWidget.element()).css(property));
                });

                if (selectedWidget.getProperties().gaugestyle !== undefined) {
                    jQuery('.gaugestyle').removeAttr('disabled');
                    if (selectedWidget.getProperties().gaugestyle === 'digital') {
                        jQuery('#styledigital').attr('selected','selected');
                        jQuery('#stylegauge').removeAttr('selected');
                    } else {
                        jQuery('#styledigital').removeAttr('selected');
                        jQuery('#stylegauge').attr('selected', 'selected');
                    }
                }

                if (selectedWidget.getProperties().units !== undefined) {
                    jQuery('.units').removeAttr('disabled');

                    switch (selectedWidget.getProperties().units) {
                        case 'metric':
                            jQuery('#metric').attr('selected', 'selected');
                            jQuery('#imperial').removeAttr('selected');
                            jQuery('#us').removeAttr('selected');
                            break;
                        case 'imperial':
                            jQuery('#metric').removeAttr('selected');
                            jQuery('#imperial').attr('selected', 'selected');
                            jQuery('#us').removeAttr('selected');
                            break;
                        case 'us':
                            jQuery('#metric').removeAttr('selected');
                            jQuery('#imperial').removeAttr('selected');
                            jQuery('#us').attr('selected', 'selected');
                            break;
                    }
                }

                if (selectedWidget.getProperties().text !== undefined) {
                    jQuery('#widgetphrase').removeAttr('disabled');
                    jQuery('#widgettext').removeAttr('disabled');
                }

                if (selectedWidget.getProperties().align !== undefined) {                 
                    jQuery('#widgetalign').removeAttr('disabled');
                }
                updateTools();
            }
        });

        jQuery('#rightmenu').on('click', 'input[name=widgetstyle]', function () {
            var selectedWidget = AGRacingWidgets.getSelected();
            if (selectedWidget.setStyle !== undefined) {
                var option = jQuery("input[name=widgetstyle]:checked");
                var style = option.data('style');
                selectedWidget.setStyle(style);
            }
        });

        jQuery('#rightmenu').on('click', 'input[name=widgetunits]', function () {
            var selectedWidget = AGRacingWidgets.getSelected();
            if (selectedWidget.setUnits !== undefined) {
                var option = jQuery("input[name=widgetunits]:checked");
                var units = option.data('units');
                selectedWidget.setUnits(units);
            }
        });
        

        jQuery(document).on('click', '#content', function (e) {
            if (_editing) {
                AGRacingWidgets.clearSelected();
            }
        });

        jQuery('#widgetcolor').colpick({
            layout: 'hex',
            submit: 0,
            colorScheme: 'dark',
            onChange: function (hsb, hex, rgb, el, bySetColor) {
                jQuery(el).css('border-color', '#' + hex);
                if (!bySetColor) $(el).val(hex);
                jQuery('#widgetcolor').trigger('change');
            }
        }).keyup(function () {
            jQuery(this).colpickSetColor(this.value);
        });

        jQuery(document).on('change keyup click', '.editorfield', function (e) {
            var selectedWidget = AGRacingWidgets.getSelected();
            if (selectedWidget !== null) {
                e.preventDefault();
                e.stopPropagation();
                var property = jQuery(this).data('property');
                var css = jQuery(this).data('css');
                var unit = jQuery(this).data('unit');
                var cssprefix = jQuery(this).data('cssprefix');
                var properties = selectedWidget.getProperties();
                var value = jQuery(this).val();
                var off = jQuery(this).data('off');

                if (value === '') {
                    value = jQuery(this).data('val');
                }

                if (unit === undefined) {
                    unit = '';
                }

                if (cssprefix === undefined) {
                    cssprefix = '';
                }

                if (properties.css[property] !== undefined) {

                    if (off !== undefined) {
                        if (properties.css[property] === value) {
                            value = off;
                        }
                    }

                    properties.css[property] = value;
                    if (css !== undefined) {
                        selectedWidget.element().css(css, cssprefix + value + unit);
                    }
                }
                if (selectedWidget.setProperty !== undefined) {
                    selectedWidget.setProperty(property, value);
                }

                updateTools();
            }
        });

        jQuery('#rightmenu').on('click', '.addwidget', function (e) {
            var widget = jQuery(this).data('widget');

            var newWidget = AGRacingWidgets.createWidget(widget);

            if (_editing) {
                newWidget.controller.startEdit();
            }
            newWidget.element.trigger('click');
            
        });

        jQuery(document).keyup(function (e) {
            if (e.keyCode === 27) {
                stopEditor();
            }

            if (e.keyCode === 46) {
                AGRacingWidgets.deleteSelectedWidget();
            }
        });
    }

    function updateTools(selectedWidget) {
        if (selectedWidget === undefined) {
            selectedWidget = AGRacingWidgets.getSelected();
        }

        if (selectedWidget.getProperties().align !== undefined) {
            var elClass = '.agalign' + selectedWidget.getProperties().align;
            jQuery('.agalign').removeClass('active');
            jQuery(elClass).addClass('active');
        }

        jQuery('.agbold').removeClass('active');
        if (selectedWidget.getProperties().css['font-weight'] !== undefined) {
            if (selectedWidget.getProperties().css['font-weight'] === 'bold') {
                jQuery('.agbold').addClass('active');
            }
        }

        jQuery('.agitalic').removeClass('active');
        if (selectedWidget.getProperties().css['font-style'] !== undefined) {
            if (selectedWidget.getProperties().css['font-style'] === 'italic') {
                jQuery('.agitalic').addClass('active');
            }
        }
    }

    function buildToolbox() {
        var html = '';
        var counter = 0;
        var rawLabels = [];
        var labels = [];
        var tabs = {};

        // Build a list of required tabs from all of the loaded widgets
        jQuery.each(AGRacingWidgets.getAvailableWidgets(), function (index, widget) {
            var widgetController = new window[widget.widgetClass]();
            var widgetTab = widgetController.tab;
            if (tabs[widgetTab] === undefined) {
                tabs[widgetTab] = {};
                tabs[widgetTab]['widgets'] = [];
            }
            tabs[widgetTab]['widgets'].push(widgetController);
        });

        // Build the tab headers
        var tabsEl = jQuery('<ul>').addClass('tabs').attr('data-tab', '');
        var first = true;
        jQuery.each(tabs, function (tabName, tabData) {
            var tabLiEl = jQuery('<li>').addClass('tab-title');
            if (first) {
                tabLiEl.addClass('active');
                first = false;
            }
            var tabAEl = jQuery('<a>').attr('href', '#toolbox' + tabName).text(tabName);
            tabLiEl.append(tabAEl);
            tabsEl.append(tabLiEl);
        });
        jQuery('#widgets').append(tabsEl);

        //Build the tab pages
        first = true;
        var tabsDiv = jQuery('<div>').addClass('tabs-content');
        jQuery.each(tabs, function (tabName, tabData) {
            var tabDiv = jQuery('<div>').attr('id', 'toolbox' + tabName).addClass('content');
            if (first) {
                tabDiv.addClass('active');
                first = false;
            }

            counter = 0
            html = '';
            jQuery.each(tabData.widgets, function (index, widgetController) {
                if (widgetController.labels !== undefined) {
                    rawLabels = rawLabels.concat(widgetController.labels);
                }
                if (counter === 0) {
                    html += '<div class="icon-bar four-up">';
                }

                html += '<a href="#" class="item addwidget" data-widget="' + widgetController.getProperties().type + '" id="' + widgetController.getProperties().type + 'widget">';
                html += '<img src="' + widgetController.icon + '" width="128" />';
                html += '<label>' + widgetController.name + '</label>';
                html += '</a>';

                counter++;
                if (counter === 4) {
                    counter = 0;
                    html += '</div>'
                }
            });
            if (counter > 0) {
                if (counter < 4) {
                    for (var i = counter; i < 4; i++) {
                        html += '<a href="#" class="item">';
                        html += '<img src="/images/blank.png" width="128" />';
                        html += '<label></label>';
                        html += '</a>';
                    }
                }
                html += '</div>';
            }
            tabDiv.append(html);

            jQuery(tabsDiv).append(tabDiv);
        });
        jQuery('#widgets').append(tabsDiv);

        jQuery(document).foundation();

        jQuery.each(rawLabels, function (i, el) {
            if (jQuery.inArray(el, labels) === -1) {
                labels.push(el);
                jQuery('#widgetphrase')
                       .append(jQuery('<option></option>')
                       .text(el));
            }
        });
    }

    function setToolboxState(gameInfo) {
        var gameName = gameInfo.GameName;

        jQuery.each(AGRacingWidgets.getAvailableWidgets(), function (index, widget) {
            var widgetController = new window[widget.widgetClass]();
            var id = '#' + widgetController.getProperties().type + 'widget';

            if (widgetController.supports !== undefined) {
                var supported = false;
                if (widgetController.supports === 'all') {
                    supported = true;
                } else {
                    if (widgetController.supports.indexOf(gameName) !== -1) {
                        supported = true;
                    }
                }
                if (supported) {
                    jQuery(id).removeClass('disabled');
                } else {
                    jQuery(id).addClass('disabled');
                }
            } else {
                jQuery(id).addClass('disabled');
            }
        });

    }

    function startEditor() {
        jQuery('#rightheader .editorcontrol').removeClass('disabled');
        AGRacingWidgets.startEditing();
        updateGrid();
        jQuery('.right-off-canvas-toggle').show();

        jQuery('#toolbar-panel').show();
        _editing = true;
    }

    function stopEditor() {
        jQuery('#toolbar-panel').hide();
        jQuery('#rightheader .whenediting').addClass('disabled');
        AGRacingWidgets.stopEditing();
        AGRacingUI.deleteGrid(jQuery('#content'));
        jQuery('.right-off-canvas-toggle').hide();
        _editing = false;
    }

    function saveWidgets() {
        var page = [];

        jQuery.each(AGRacingWidgets.getWidgets(), function (index, widget) {
            var settings = widget.getProperties();
            var element = widget.element();
            jQuery.each(widget.getProperties().css, function (property, value) {
                settings['css'][property] = jQuery(element).css(property);
            });
            jQuery.each(widget.getProperties(), function (property, value) {
                if (property !== 'css') {
                    settings[property] = widget.getProperty(property);
                }
            });

            page.push(settings);
        });
        AGRacingDashBoards.updateDashPage(page);
        AGRacingDashBoards.saveDashBoards();
    }

    function updateGrid() {
        if (jQuery('#gridswitch').is(":checked")) {
            AGRacingUI.drawGrid(jQuery('#content'), 10);
        } else {
            AGRacingUI.deleteGrid(jQuery('#content'));
        }
    }

    function destroy() {
        jQuery('#rightheader').html('');
        jQuery('.right-off-canvas-toggle').show();
        jQuery('#widgetcolor').colpickDestroy();
    }

    function buildToolbar() {
        jQuery('#agtoolbar').draggable();
        jQuery('#agtoolbar').hide();
    }

    return {
        init: function () {
            init();
        },

        destroy: function () {
            destroy();
        },

        setToolboxState: function (gameInfo) {
            setToolboxState(gameInfo);
        }
    }

}();
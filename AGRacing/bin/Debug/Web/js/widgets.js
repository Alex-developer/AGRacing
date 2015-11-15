var AGRacingWidgets = function () {
    'use strict';
    var _availableWidgets = [];
    var _widgets = [];
    var _selectedWidget = null;
    var _editing = false;

    function loadAllWidgets() {
        var deferred = new $.Deferred();

        var widgetList = '/js/widgets/widgets';
        jQuery.ajax({
            url: widgetList,
            cache: false
        }).done(function (widgetList) {
            var lines = widgetList.split('\n');
            for (var i = 0; i < lines.length; i++) {
                _availableWidgets.push(lines[i].replace('\r', ''));
            }
        }).error(function (e) {
            _availableWidgets = [];
        }).always(function (e) {
            var requiredWidgets = [];
            jQuery.each(_availableWidgets, function (index, widget) {
                requiredWidgets.push('widget/' + widget);
            });

            require(requiredWidgets, function () {
                deferred.resolve();
            });
        });

        return deferred.promise();
    }

    function createWidget(widgetName, settings) {

        var widgetClass = 'AGRacing' + widgetName.toUpperCase() + 'Widget';
        var widgetController = new window[widgetClass]();

        if (settings === undefined) {
            settings = widgetController.getProperties();
        }
        settings.css['position'] = 'absolute';
        settings.css['zindex'] = 100;

        var element = jQuery('<div>').css(settings.css)
            .addClass('widget agselectable')
            .attr('id', AGRacingUI.getNextId())
        jQuery('#dashpage').append(element);


        element.data('type', widgetController.name);
        widgetController.init(element, settings);
        _widgets.push(widgetController);
        return {
            controller: widgetController,
            element: element
        };
    }

    function startEditing() {
        jQuery.each(_widgets, function (index, widget) {
            if (widget.startEdit !== undefined) {
                widget.startEdit();
            }
        });
        _editing = true;
    }

    function stopEditing() {
        jQuery.each(_widgets, function (index, widget) {
            if (widget.finishEdit !== undefined) {
                widget.finishEdit();
            }
        });

        if (_selectedWidget !== null) {
            jQuery(_selectedWidget.element()).removeClass('selected');
        }
        _editing = false;
    }

    function setSelected(selectedId) {
        _selectedWidget = null;
        jQuery('.agselectable').removeClass('selected');
        jQuery.each(_widgets, function (index, widget) {
            if (widget.element().attr('id') === selectedId) {
                _selectedWidget = widget;
                jQuery(widget.element()).addClass('selected');
            }
        });
        jQuery('#agtoolbar').show();
        return _selectedWidget;
    }

    function clearSelected() {
        var lastSelected = _selectedWidget;
        jQuery('.agselectable').removeClass('selected');
        _selectedWidget = null;

        jQuery('#agtoolbar').hide();
        return lastSelected;
    }

    function startEdit(el, callbacks, aspectRatio) {
        jQuery(el).addClass('border');

        jQuery(el).draggable({
            grid: [10, 10],
            cancel: 'span',
            start: function (event, ui) {
                var posEl = jQuery(el).find('.position');
                if (posEl.length === 0) {
                    posEl = jQuery('<div>').css({
                        top: -20,
                        left: 0,
                        'min-width': '100%',
                        height: 20,
                        position: 'absolute'
                    }).addClass('position');
                    jQuery(el).append(posEl);
                }
                jQuery(posEl).show();
                if (jQuery.isFunction(callbacks.dragStart)) {
                    callbacks.dragStart();
                }
            },
            drag: function (event, ui) {
                var p = jQuery(this).position();
                var type = jQuery(this).data('type');
                var posEl = jQuery(el).find('.position');
                jQuery(posEl).text(p.left + ', ' + p.top + ' - ' + type);

                if (jQuery.isFunction(callbacks.drag)) {
                    callbacks.drag();
                }

                updateEditorFields(el);
            },
            stop: function (event, ui) {
                var posEl = jQuery(el).find('.position');
                jQuery(posEl).hide();
                if (jQuery.isFunction(callbacks.dragStop)) {
                    callbacks.dragStop();
                }
                updateEditorFields(el);
            }
        });

        var aspectRationValue = false;
        if (typeof aspectRatio !== undefined) {
            aspectRationValue = aspectRatio;
        }

        jQuery(el).resizable({
            aspectRatio: aspectRationValue,
            start: function (event, ui) {
                if (jQuery.isFunction(callbacks.resizeStart)) {
                    callbacks.resizeStart();
                }
            },
            resize: function (event, ui) {
                if (jQuery.isFunction(callbacks.resize)) {
                    callbacks.resize();
                }
                updateEditorFields(el);
            },
            stop: function (event, ui) {
                if (ui.element.attr('id') === el.attr('id')) {
                    if (jQuery.isFunction(callbacks.resizeStop)) {
                        callbacks.resizeStop();
                    }
                    updateEditorFields(el);
                }
            }
        });
    }

    function clearEditorFields() {
        jQuery('.editorfield').val('');
    }

    function updateEditorFields(el) {
        var p = jQuery(el).position();
        jQuery('#widgetx').val(p.left);
        jQuery('#widgety').val(p.top);
        jQuery('#widgetwidth').val(jQuery(el).width());
        jQuery('#widgetheight').val(jQuery(el).height());
        if (_selectedWidget !== null) {
            if (_selectedWidget.setEditorFields !== undefined) { // Function check?
                _selectedWidget.setEditorFields();
            }
        }
    }

    function finishEdit(el, properties) {
        var position = jQuery(el).position();
        properties.css.left = position.left;
        properties.css.top = position.top;
        properties.css.width = jQuery(el).width();
        properties.css.height = jQuery(el).height();

        jQuery(el).removeClass('border');
        jQuery(el).draggable('destroy');
        jQuery(el).resizable('destroy');
    }

    function deleteSelectedWidget() {
        if (_selectedWidget !== null) {
            if (_selectedWidget.destroy !== undefined) {
                _selectedWidget.destroy();
                for (var i = 0; i < _widgets.length; i++) {
                    if (_selectedWidget.element().attr('id') === _widgets[i].element().attr('id')) {
                        _widgets.splice(i, 1);
                        break;
                    }
                }
            }
        }
    }

    return {
        editing: function() {
            return _editing;
        },

        getAvailableWidgets: function() {
            return _availableWidgets;
        },

        getWidgets: function() {
            return _widgets;
        },

        loadAllWidgets: function () {
            return loadAllWidgets();
        },

        createWidget: function (widgetName, settings) {
            return createWidget(widgetName, settings);
        },

        startEditing: function () {
            startEditing();
        },

        stopEditing: function () {
            stopEditing();
        },

        setSelected: function (selectedId) {
            return setSelected(selectedId);
        },

        clearSelected : function() {
            return clearSelected();
        },

        getSelected: function() {
            return _selectedWidget;
        },

        startEdit: function (el, callbacks, aspectRatio) {
            startEdit(el, callbacks, aspectRatio)
        },

        widgetSelected: function (widget) {
            _selectedWidget = widget;
            var el = widget.element();
            clearEditorFields();
            updateEditorFields(el);
        },

        finishEdit: function (el, properties) {
            finishEdit(el, properties);
        },

        deleteSelectedWidget: function () {
            deleteSelectedWidget();
        }

    }

}();
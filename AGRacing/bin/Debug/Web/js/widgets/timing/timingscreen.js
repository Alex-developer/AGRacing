var AGRacingTIMINGSCREENWidget = function () {
    'use strict';

    var _name = 'TimingScreen';
    var _icon = '/images/widgets/stopwatch.png';
    var _labels = ['Timing Screen'];
    var _tab = 'Timing';
    var _supports = ['iRacing', 'Project Cars'];

    var _initialised = false;
    var _el = null;
    var _elId = null;
    var _timingEl = null;
    var _lastDriverCount = 0;

    var _properties = {
        type: 'timingscreen',
        css: {
            left: 0,
            top: 0,
            width: 300,
            height: 50
        }
    };
    var _messages = ['environmentdata'];

    function init(element, properties) {
        if (element !== undefined) {
            _el = element;
        }
        if (properties !== undefined) {
            _properties = properties;
        }
    }

    function destroy() {
        _initialised = false;
        jQuery(_el).remove();
    }

    function buildUI(drivers) {
        _elId = AGRacingUI.getNextId();

        var html = '<div class="row">';
        html += '<div class="small-1 large-1 columns">Pos</div>';
        html += '<div class="small-3 large-3 columns">Driver</div>';
        html += '<div class="small-2 large-2 columns">Lap</div>';
        html += '<div class="small-2 large-2 columns">Lap</div>';
        html += '<div class="small-2 large-2 columns">Best</div>';
        html += '<div class="small-2 large-2 columns">Gap</div>';
        html += '</div>';

        for (var i=0; i < drivers.length; i++) {
            html += '<div class="row">';
            html += '<div class="small-1 large-1 columns pos' + i + '">' + (i + 1) + '</div>';
            html += '<div class="small-3 large-3 columns driver' + i + '"></div>';
            html += '<div class="small-2 large-2 columns laps' + i + '"></div>';
            html += '<div class="small-2 large-2 columns laptime' + i + '"></div>';
            html += '<div class="small-2 large-2 columns best' + i + '"></div>';
            html += '<div class="small-2 large-2 columns gap' + i + '"></div>';
            html += '</div>';
        };

        jQuery(_timingEl).remove();
        _timingEl = jQuery('<div>').html(html).attr('id', _elId);
        jQuery(_el).css('overflow-y','scroll').css('overflow-x','hidden');
        jQuery(_el).append(_timingEl);

        _initialised = true;
    }

    function updateUI(data) {
        var drivers = data.CurrentSession.Drivers.DriverList;

      //  if (!_initialised || (_lastDriverCount !== drivers.length)) {
            buildUI(drivers);
     //       _lastDriverCount = drivers.length;
     //   }

            var lastDriver = null;
            for (var i = 0; i < drivers.length; i++) {
                var position = i + 1;
                for (var j = 0; j < drivers.length; j++) {
                    if (drivers[j].Position === position) {

                        jQuery('#' + _elId + ' .driver' + i).html(drivers[j].Name);
                        jQuery('#' + _elId + ' .laps' + i).html(drivers[j].LapsComplete);
                        jQuery('#' + _elId + ' .laptime' + i).html(drivers[j].LastLapTime);
                        jQuery('#' + _elId + ' .best' + i).html(drivers[j].BestLapTime);
                        var gap = '';
                        if (i > 0) {
                            gap = calculateGap(drivers[lastDriver].BestLapTime, drivers[j].BestLapTime);
                            jQuery('#' + _elId + ' .gap' + i).html(gap);
                        }
                        lastDriver = j;
                        break;
                    }
                }
        }
    }


    function calculateGap(pos1, pos2) {

        var pos1Seconds = ConvertTimeToSeconds(pos1);
        var pos2Seconds = ConvertTimeToSeconds(pos2);
        var timeGap = pos2Seconds - pos1Seconds;
        return toMMSSTH(timeGap);
    }

    function ConvertTimeToSeconds(time) {
        var timeBits = time.split(':');

        var seconds = parseInt(timeBits[0], 10) * 60 + parseInt(timeBits[1], 10) + parseFloat('.' + timeBits[2]);

        return seconds;
    }

    function toMMSSTH(value) {
        var time = '--:--:---';

        if (value !== -1) {
            var time = value;
            var sec_num = parseInt(value, 10); // don't forget the second param
            var hours = Math.floor(sec_num / 3600);
            var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
            var seconds = sec_num - (hours * 3600) - (minutes * 60);

            if (hours < 10) {
                hours = "0" + hours;
            }
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            if (seconds < 10) {
                seconds = "0" + seconds;
            }

            var rem = time - sec_num;
            rem = Math.ceil(((rem < 1.0) ? rem : (rem % Math.floor(rem))) * 1000);
            time = minutes + ':' + seconds + ':' + rem;
        }
        return time;
    }

    function startEdit() {
        AGRacingWidgets.startEdit(_el, {
            resize: function () {
            },
            resizeStop: function () {
            }
        });
    }

    function finishEdit() {
        AGRacingWidgets.finishEdit(_el, _properties);
        return _properties;
    }

    return {
        name: _name,
        icon: _icon,
        messages: _messages,
        labels: _labels,
        tab: _tab,
        supports: _supports,

        element: function () {
            return _el;
        },

        init: function (element, properties) {
            return init(element, properties);
        },

        destroy: function () {
            destroy();
        },

        updateUI: function (data) {
            updateUI(data);
        },

        startEdit: function () {
            startEdit();
        },

        finishEdit: function () {
            return finishEdit();
        },

        getProperties: function () {
            return _properties;
        },

        getProperty: function (property) {
            var result;
            if (_properties[property] !== undefined) {
                result = _properties[property];
            }
            return result;
        },

        setProperty: function (property, value) {
            _properties[property] = value;
        }

    }
};
//# sourceURL=/js/widgets/timing/timingscreen.js
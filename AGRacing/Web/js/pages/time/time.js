var AGRacingView = function () {
    'use strict';

    var _initialised = false;
    var _dataReader = {
        allData: 0,
        carData: 0,
        timingData: 250,
        environmentData: 1000
    };

    function init() {
        var deferred = new jQuery.Deferred();

        deferred.resolve();

        return deferred.promise();
    }

    function buildUI() {
        jQuery('#timings').html('');
    }

    function updateUI(message) {
        switch (message.datatype) {
            case 'cardata':
                break;

            case 'timingdata':
                if (!_initialised) {
                    buildTimingUI(message.data);
                }
                updateTimings(message.data);
                break;
        }
    }

    function buildTimingUI(data) {
        var html = '';
        jQuery.each(data, function (index, driver) {
            html += '<div class="row">';
            html += '<div class="small-1 large-1 columns" id="pos' + index + '">' + (index+1) + '</div>';
            html += '<div class="small-3 large-3 columns" id="driver' + index + '"></div>';
            html += '<div class="small-1 large-1 columns" id="laps' + index + '"></div>';
            html += '<div class="small-1 large-1 columns" id="s1' + index + '"></div>';
            html += '<div class="small-1 large-1 columns" id="s2' + index + '"></div>';
            html += '<div class="small-1 large-1 columns" id="s3' + index + '"></div>';
            html += '<div class="small-1 large-1 columns" id="laptime' + index + '"></div>';
            html += '<div class="small-1 large-1 columns" id="best' + index + '"></div>';
            html += '<div class="small-1 large-1 columns" id="gap' + index + '"></div>';
            html += '<div class="small-1 large-1 columns" id="status' + index + '"></div>';
            html += '</div>';
        });
        jQuery('#timings').html(html);
        _initialised = true;
    }

    function findLap(driver, lapNumber) {
        var lap = null;
        var laps = driver.Laps.length;
        for (var i=laps-1; i>=0; i--) {
            if (driver.Laps[i].LapNumber === lapNumber) {
                lap = driver.Laps[i];
                break;
            }
        }
        return lap;
    }

    function updateTimings(data) {
        data.sort(compare);
        jQuery.each(data, function (index, driver) {
            jQuery('#driver' + index).text(driver.Name);
            jQuery('#laps' + index).text(driver.LapNumber);

            if (driver.LapNumber > 0) {
                var currentLap = findLap(driver, driver.LapNumber);
                if (currentLap !== null) {
                    var lastLap = null;
                    if (currentLap.LapTime === 0) {
                        if (driver.LapNumber > 1) {
                            lastLap = findLap(driver, driver.LapNumber-1);
                        }
                    } else {
                        lastLap = currentLap;
                    }

                    if (lastLap !== null) {
                        if (lastLap.LapTime !== 0) {
                            var time = (lastLap.LapTime / 1000).toFixed(3);
                            jQuery('#laptime' + index).text(time);
                        } else {
                            jQuery('#laptime' + index).text('--:--:--');
                        }
                    }

                    jQuery('#s1' + index).text('--:--:--');
                    jQuery('#s2' + index).text('--:--:--');
                    jQuery('#s3' + index).text('--:--:--');
                    for (var i=0; i < currentLap.Sectors.length-1; i++) {
                        var sector = currentLap.Sectors[i];
                        if (sector.SectorTime !== 0) {
                            var time = (sector.SectorTime / 1000).toFixed(3);
                            jQuery('#s' + sector.SectorNumber + index).text(time);
                        } else {
                            jQuery('#s' + sector.SectorNumber + index).text('--:--:--');
                        }
                    }
                } else {
                    jQuery('#slaptime' + index).text('--:--:--');
                    jQuery('#s1' + index).text('--:--:--');
                    jQuery('#s2' + index).text('--:--:--');
                    jQuery('#s3' + index).text('--:--:--');
                }
            }

            if (driver.FastestLap !== 0) {
                time = (driver.FastestLapTime / 1000).toFixed(3);
                jQuery('#best' + index).text(time);
            } else {
                jQuery('#best' + index).text('--:--:--');
            }

            if (driver.OnTrack) {
                jQuery('#status' + index).text('Track');
            } else {
                jQuery('#status' + index).text('Pits');
            }
        });
    }
    function compare(a, b) {
        if (a.Position < b.Position)
            return -1;
        if (a.Position > b.Position)
            return 1;
        return 0;
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
//# sourceURL=/js/pages/time/time.js
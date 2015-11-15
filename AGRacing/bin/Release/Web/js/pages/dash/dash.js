var AGRacingView = function () {
    'use strict';
    
    var _scripts = [
        '/js/kendo/js/kendo.all.min.js'
    ];
    var _speedGauge;
    var _rpmGauge;
    var _initialised = false;

    function init() {
        var deferred = new jQuery.Deferred();
        
        var deferreds = [];
        for (var i = 0; i < _scripts.length; i++) {
            
            deferreds.push(
                jQuery.getScript(_scripts[i]).done(function (e) { })
            );
        }
        jQuery.when.apply(null, deferreds).done(function () {
            deferred.resolve();
        });

        return deferred.promise();
    }

    function buildUI() {
        jQuery('#rpm').kendoRadialGauge({
            theme: "black",

            pointer: {
                value: 0,
                color: '#ea7001'
            },

            scale: {
                startAngle: -60,
                endAngle: 240,

                min: 0,
                max: 15,

                majorUnit: 1,
                majorTicks: {
                    width: 1,
                    size: 7
                },

                minorUnit: 0.2,
                minorTicks: {
                    size: 5
                },

                labels: {
                    font: "14px Arial,Helvetica,sans-serif"
                }
            }
        });

        $('#mph').kendoRadialGauge({
            theme: "black",

            pointer: {
                value: 0,
                color: "#ea7001"
            },

            scale: {
                startAngle: -60,
                endAngle: 240,

                min: 0,
                max: 220,

                majorTicks: {
                    width: 1,
                    size: 14
                },
                majorUnit: 20,

                minorTicks: {
                    size: 10
                },

                minorUnit: 2
            }
        });

        $("#fuel").kendoRadialGauge({
            theme: "black",

            pointer: {
                value: 0.5,
                color: "#ea7001"
            },

            scale: {
                startAngle: 90,
                endAngle: 180,

                min: 0,
                max: 1,

                majorUnit: 0.5,
                majorTicks: {
                    width: 2,
                    size: 6
                },

                minorUnit: 0.25,
                minorTicks: {
                    size: 3
                },

                ranges: [{
                    from: 0,
                    to: 0.1,
                    color: "#c20000"
                }],

                labels: {
                    font: "9px Arial,Helvetica,sans-serif"
                }
            }
        });

        $("#water-temprature").kendoRadialGauge({
            theme: "black",

            pointer: {
                value: 0,
                color: "#ea7001"
            },

            scale: {
                startAngle: 180,
                endAngle: 270,

                min: 60,
                max: 120,

                majorUnit: 30,
                majorTicks: {
                    width: 2,
                    size: 6
                },

                minorUnit: 10,
                minorTicks: {
                    size: 3
                },

                ranges: [{
                    from: 110,
                    to: 120,
                    color: "#c20000"
                }],

                labels: {
                    font: "9px Arial,Helvetica,sans-serif"
                }
            }
        });

        _initialised = true;
    }

    function compare(a, b) {
        if (a.Position < b.Position)
            return -1;
        if (a.Position > b.Position)
            return 1;
        return 0;
    }

    function updateUI(message) {
        if (_initialised) {
            switch (message.datatype) {
                case 'cardata':
                    jQuery('#rpm').data("kendoRadialGauge").value(message.data.RPM.toFixed(0) / 1000);
                    jQuery('#mph').data("kendoRadialGauge").value(message.data.Speed.toFixed(0));

                    jQuery('#water-temprature').data("kendoRadialGauge").value(message.data.WaterTemp);
                    jQuery('#fuel').data("kendoRadialGauge").value(message.data.Fuel);

                    switch (message.data.Gear) {
                        case -1:
                            jQuery('#gear').html('R');
                            break;

                        case 0:
                            jQuery('#gear').html('N');
                            break;

                        default:
                            jQuery('#gear').html(message.data.Gear);
                            break;
                    }
                    break;

                case 'timingdata':

                    for (var i=0; i<message.data.length; i++) {
                        if (message.data[i].IsMe) {
                            var data = message.data[i];
                            if (data.NumberOfLaps !== 0) {
                                jQuery('#lapsinevent').html(data.NumberOfLaps);
                            } else {
                                jQuery('#lapsinevent').html('-');
                            }
                            jQuery('#currentlap').html(data.LapNumber);

                            jQuery('#currentposition').html(data.Position);
                            jQuery('#numberofplayers').html(message.data.length);

                            jQuery('#playername').html(data.Name);
                            jQuery('#carname').html(data.Car);
                            jQuery('#cartype').html(data.CarType);

                            break;
                        }
                    }
                    for (i = 0; i < message.data.length; i++) {
                        jQuery('#position' + (message.data[i].Position-1)).html(message.data[i].Name);
                    }
                    break;

                case 'environmentdata':   
                    jQuery('#trackname').html(message.data.TrackName);
                    jQuery('#trackvarient').html(message.data.TrackVarient);

                    jQuery('#tracktemp').html(message.data.TrackTemperature);
                    jQuery('#ambienttemp').html(message.data.AmbientTemperature);
                    break;

            }
        }
        /*
        if (_initialised) {


            jQuery('#carname').html(data.C);
            jQuery('#trackname').html(data.T);

            var pi = data.PAI;
            jQuery('#playername').html(data.PI[pi].PN);

            jQuery('#currentposition').html(data.PI[pi].PP);
            jQuery('#numberofplayers').html(data.NP);
            
            jQuery('#lapsinevent').html(data.LIE);
            jQuery('#currentlap').html(data.PI[pi].CL);
            
            data.PI.sort(compare);

            for (var i = 0; i < 5; i++) {
                if (i < data.NP) {
                    jQuery('#position' + i).html(data.PI[i].PN);
                }
            }
        }*/
    }
    return {
        init: function () {
            return init();
        },

        buildUI: function() {
            buildUI();
        },

        updateUI: function (message) {
            updateUI(message);
        }

    }
}();

//# sourceURL=/js/pages/dash/dash.js
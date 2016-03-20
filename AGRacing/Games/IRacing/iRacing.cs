using System;
using System.Linq;
using AGRacing.GameData.Telemetry;
using iRacingSdkWrapper;
using iRacingSdkWrapper.Bitfields;
using AGRacing.GameData.Telemetry.Sessions.SessionDrivers;
using AGRacing.Hardware;

namespace AGRacing.Games.IRacing
{
    class IRacing : GameBase
    {
        private readonly string gameName = "iRacing";
        private readonly byte gameCode = 1;
        private SdkWrapper wrapper;
        private TelemetryInfo telemetryInfo;
        private SessionInfo sessionInfo;

        private TelemetryData telemetry;

        private bool _mustUpdateSessionData;
        private bool _mustReloadDrivers = false;
        private AGHardware _hardware;

        #region Getters and Setters
        #endregion

        public override string GameName()
        {
            return gameName;
        }

        public override byte GameCode()
        {
            return gameCode;
        }

        public override bool IsEventDriven()
        {
            return true;
        }

        public IRacing()
        {
            wrapper = new SdkWrapper();
           // wrapper.TelemetryUpdateFrequency = 4;
            wrapper.TelemetryUpdated += OnTelemetryUpdated;
            wrapper.SessionInfoUpdated += OnSessionInfoUpdated;

            _hardware = new AGHardware();
        }

        public override void StartGameReader(TelemetryData telemetry)
        {
            this.telemetry = telemetry;
            wrapper.Start();
        }

        public override void StopReader()
        {
            wrapper.Stop();
        }

        private void ResetSession()
        {
            telemetry.Sessions.AddSession(telemetryInfo.SessionNum.Value);

            // Need to re-load all drivers when session info updates
            _mustReloadDrivers = true;
        }

        private void OnSessionInfoUpdated(object sender, SdkWrapper.SessionInfoUpdatedEventArgs e)
        {
            sessionInfo = e.SessionInfo;

            // Stop if we don't have a session number yet
            if (telemetry.Sessions.CurrentSession.SessionNum == null) return;

            if (_mustUpdateSessionData)
            {
                UpdateSessionInformation();
            }

          //  if (_mustReloadDrivers)
          //  {
                UpdateDrivers(sessionInfo);
          //  }
        }
        
        private void OnTelemetryUpdated(object sender, SdkWrapper.TelemetryUpdatedEventArgs e)
        {
            // Grab a copy of the session info
            telemetryInfo = e.TelemetryInfo;

            ReadData();

            // Deal with the session changing
            if (telemetry.Sessions.CurrentSession == null || (telemetry.Sessions.CurrentSession.SessionNum != telemetryInfo.SessionNum.Value))
            {
                _mustUpdateSessionData = true;

                // Session changed, reset session info
                this.ResetSession();
            }

        }

        private void UpdateSessionInformation()
        {

            var weekend = sessionInfo["WeekendInfo"];
            telemetry.Sessions.TrackName = getYAMLValue(weekend["TrackDisplayName"]);
            telemetry.Sessions.TrackVarient = getYAMLValue(weekend["TrackConfigName"]);
            telemetry.Sessions.TrackTemperature = ConvertUnits(wrapper.GetTelemetryValue<float>("TrackTempCrew").Value);
            telemetry.Sessions.AmbientTemperature = ConvertUnits(wrapper.GetTelemetryValue<float>("AirTemp").Value);

            var session = sessionInfo["SessionInfo"]["Sessions"]["SessionNum", telemetry.Sessions.CurrentSession.SessionNum];
            telemetry.Sessions.CurrentSession.SessionType = session["SessionType"].GetValue();

            telemetry.Sessions.CurrentSession.Laps = getYAMLValue(session["SessionLaps"]);
            telemetry.Sessions.CurrentSession.SessionTime = getYAMLValue(session["SessionTime"]);

            var tt = 56;
        }

        private string getYAMLValue(YamlQuery query)
        {
            string result;
            if (!query.TryGetValue(out result))
            {
                result = "Unknown";
            }
            return result;
        }

        private string ConvertUnits(float value) {
            int unit = wrapper.GetTelemetryValue<int>("DisplayUnits").Value;
            string result = value.ToString("0.00") + " &deg;C";

            // English
            if (unit == 0)
            {
                value = value * 9 / 5 + 32;
                result = value.ToString("0.00") + " &deg;F";
            }
            else
            {
                if (unit == 1)
                {

                }
            }

            return result;
        }

        public override void ReadData()
        {
            if (telemetryInfo != null && sessionInfo != null)
            {
                GameDataValid = true;
                
                telemetry.CarState.Engine.RPM = telemetryInfo.RPM.Value;
                telemetry.CarState.Speed = (float)(telemetryInfo.Speed.Value * 2.23693629);
                telemetry.CarState.Gear = telemetryInfo.Gear.Value;

                telemetry.CarState.Engine.WaterTemp = telemetryInfo.WaterTemp.Value;
                telemetry.CarState.Engine.OilTemp = telemetryInfo.OilTemp.Value;

                telemetry.CarState.FuelLevel = telemetryInfo.FuelLevelPct.Value;
                if (telemetryInfo.FuelLevelPct.Value != 0)
                {
                    telemetry.CarState.FuelCapacity = (100 / (telemetryInfo.FuelLevelPct.Value * 100)) * telemetryInfo.FuelLevel.Value;
                }
                else
                {
                    telemetry.CarState.FuelCapacity = 0;
                }
                telemetry.CarState.Throttle = telemetryInfo.Throttle.Value;
                telemetry.CarState.Brake = telemetryInfo.Brake.Value;

                telemetry.CarState.Wheel = RadianToDegree(telemetryInfo.SteeringWheelAngle.Value);

                telemetry.CarState.Acceleration.X = telemetryInfo.VelocityX.Value;
                telemetry.CarState.Acceleration.Y = telemetryInfo.VelocityY.Value;

                telemetry.CarState.Engine.WaterTempWarning = telemetryInfo.EngineWarnings.Value.Contains(EngineWarnings.WaterTemperatureWarning);
                telemetry.CarState.Engine.FuelPressureWarning = telemetryInfo.EngineWarnings.Value.Contains(EngineWarnings.FuelPressureWarning);
                telemetry.CarState.Engine.OilPressureWarning = telemetryInfo.EngineWarnings.Value.Contains(EngineWarnings.OilPressureWarning);
                telemetry.CarState.Engine.EngineStalled = telemetryInfo.EngineWarnings.Value.Contains(EngineWarnings.EngineStalled);
                telemetry.CarState.Engine.RevLimiterActive = telemetryInfo.EngineWarnings.Value.Contains(EngineWarnings.RevLimiterActive);
                telemetry.CarState.Engine.ShiftIndicatorPercentage = telemetryInfo.ShiftIndicatorPct.Value;

                TimeSpan time = TimeSpan.FromSeconds(telemetryInfo.SessionTimeRemain.Value);
                telemetry.Sessions.CurrentSession.SessionTimeRemaining = time.ToString(@"hh\:mm\:ss");

                try
                {
                    float brakeBias = wrapper.GetTelemetryValue<float>("dcBrakeBias").Value;
                    telemetry.CarState.Chassis.BrakeBias = brakeBias;
                }
                catch (ArgumentException)
                {
                    telemetry.CarState.Chassis.BrakeBias = -1;
                }

                try 
                {
                    float throttleMap = wrapper.GetTelemetryValue<float>("dcThrottleShape").Value;
                    telemetry.CarState.Engine.ThrottleMap = throttleMap;
                }
                catch (ArgumentException)
                {
                    telemetry.CarState.Engine.ThrottleMap = -1;
                }

                try
                {
                    float abs = wrapper.GetTelemetryValue<float>("dcABS").Value;
                    telemetry.CarState.Chassis.ABS = abs;
                }
                catch (ArgumentException)
                {
                    telemetry.CarState.Chassis.ABS = -1;
                }
                
                string currentLapTime = wrapper.GetTelemetryValue<float>("LapCurrentLapTime").Value.ToString();

                telemetry.CarState.CurrentLapTime = GetBestLApTime(currentLapTime);

                if (!_hardware.PortOpen())
                {
                 //   _hardware.Start();
                }

               // _hardware.SendData(telemetry);
            }
        }

        private string GetBestLApTime(string bestLapTimeString)
        {
            string bestTime;


            if (bestLapTimeString != "0")
            {
                float bestLapTime = float.Parse(bestLapTimeString);
                TimeSpan time = TimeSpan.FromSeconds(bestLapTime);
                bestTime = time.ToString(@"mm\:ss\:fff");
            }
            else
            {
                bestTime = "00:00:000";
            }
            return bestTime;
        }

        private float RadianToDegree(double angle)
        {
            return (float)(angle * (180.0 / Math.PI));
        }

        #region Driver methods
        private Car NewDriver(SessionInfo sessionInfo, int index)
        {

            YamlQuery query = sessionInfo["DriverInfo"]["Drivers"]["CarIdx", index];

            string name;
            if (!query["UserName"].TryGetValue(out name))
            {
                // Driver not found
                return null;
            }

            Car car = new Car() { id = index };
            car.Name = name;

            car = UpdateDriver(car, index);
            return car;
        }

        private Car UpdateDriver(Car car, int index)
        {
            YamlQuery query = sessionInfo["DriverInfo"]["Drivers"]["CarIdx", index];
            query = sessionInfo["DriverInfo"]["Drivers"]["CarIdx", index];
            car.CarName = query["CarPath"].GetValue();


            string position;
            if (!sessionInfo["SessionInfo"]["Sessions"]["SessionNum", telemetry.Sessions.CurrentSession.SessionNum]["ResultsPositions"]["CarIdx", index]["Position"].TryGetValue(out position))
            {
                position = "-1";
            }
            car.Position = Int32.Parse(position);

            string bestlaptime;
            if (!sessionInfo["SessionInfo"]["Sessions"]["SessionNum", telemetry.Sessions.CurrentSession.SessionNum]["ResultsPositions"]["CarIdx", index]["FastestTime"].TryGetValue(out bestlaptime))
            {
                bestlaptime = "0";
            }
            car.BestLapTime = GetBestLApTime(bestlaptime);

            string time;
            if (!sessionInfo["SessionInfo"]["Sessions"]["SessionNum", telemetry.Sessions.CurrentSession.SessionNum]["ResultsPositions"]["CarIdx", index]["LastLapTime"].TryGetValue(out time))
            {
                time = "0";
            }
            car.Time = GetBestLApTime(time);

            string lapsComplete;
            if (!sessionInfo["SessionInfo"]["Sessions"]["SessionNum", telemetry.Sessions.CurrentSession.SessionNum]["ResultsPositions"]["CarIdx", index]["LapsComplete"].TryGetValue(out lapsComplete))
            {
                lapsComplete = "0";
            }
            car.LapsComplete = lapsComplete;

            return car;
        }

        public void UpdateDrivers(SessionInfo sessionInfo, bool reloadDrivers = false)
        {
            if (reloadDrivers)
            {
                telemetry.Sessions.CurrentSession.Drivers.ResetDrivers();
            }

            for (int i = 0; i < 70; i++)
            {
                // Find existing driver in list
                var driver = telemetry.Sessions.CurrentSession.Drivers.DriverList.SingleOrDefault(d => d.id == i);
                if (driver == null)
                {
                    driver = NewDriver(sessionInfo, i);

                    // If no driver found, end of list reached
                    if (driver == null) break;

                    driver.IsCurrentDriver = false;

                    // Add to list
                    telemetry.Sessions.CurrentSession.Drivers.DriverList.Add(driver);
                }
                else
                {
                    UpdateDriver(driver, i);
                    // Update and check if driver swap occurred
                    /**          var oldId = driver.CustId;
                              var oldName = driver.Name;
                              driver.ParseDynamicSessionInfo(info);

                              if (oldId != driver.CustId)
                              {
                                  var e = new DriverSwapRaceEvent();
                                  e.Driver = driver;
                                  e.PreviousDriverId = oldId;
                                  e.PreviousDriverName = oldName;
                                  e.CurrentDriverId = driver.Id;
                                  e.CurrentDriverName = driver.Name;
                                  e.SessionTime = _telemetry.SessionTime.Value;
                                  e.Lap = driver.Live.Lap;

                                  this.OnRaceEvent(e);
                              }**/
                }

                if (wrapper.DriverId == driver.id)
                {
                    driver.IsCurrentDriver = true;

                    string lastLapTime = wrapper.GetTelemetryValue<float>("LapLastLapTime").Value.ToString();
                    driver.LastLapTime =  GetBestLApTime(lastLapTime);
                    
                }

            }
            var tt = 56;
        }
        #endregion
    }
}

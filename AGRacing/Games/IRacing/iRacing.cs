using System;
using System.Linq;
using AGRacing.GameData.GameState;
using iRacingSdkWrapper;
using iRacingSdkWrapper.Bitfields;

namespace AGRacing.Games.IRacing
{
    class IRacing : GameBase
    {
        private readonly string gameName = "iRacing";
        private SdkWrapper wrapper;
        private TelemetryInfo TelemetryInfo;
        private SessionInfo SessionInfo;

        private GameState gameState;

        public override string GameName()
        {
            return gameName;
        }

        public IRacing()
        {
            wrapper = new SdkWrapper();
            wrapper.TelemetryUpdateFrequency = 4;
            wrapper.TelemetryUpdated += OnTelemetryUpdated;
            wrapper.SessionInfoUpdated += OnSessionInfoUpdated;
        }

        public override void StartGameReader(GameState gameState)
        {
            this.gameState = gameState;
            ResetSession();
            wrapper.Start();
        }

        public override void StopReader()
        {
            wrapper.Stop();
        }

        private void ResetSession()
        {
            gameState.Reset(0,0);
            gameState.Timing.WorldFastestSectors = null;
            gameState.Timing.PersonalFastestSectors = new float[3];
            gameState.Timing.FastestSectors = new float[3];
        }

        private void OnSessionInfoUpdated(object sender, SdkWrapper.SessionInfoUpdatedEventArgs e)
        {
            SessionInfo = e.SessionInfo;
        }
        private void OnTelemetryUpdated(object sender, SdkWrapper.TelemetryUpdatedEventArgs e)
        {
            TelemetryInfo = e.TelemetryInfo;
        }

        public override void ReadData()
        {
            if (TelemetryInfo != null)
            {
                GameDataValid = true;

                gameState.Environment.FPS = Math.Floor(TelemetryInfo.FPS.Value);
                gameState.Environment.AmbientTemperature = TelemetryInfo.AirTemp.Value;
                gameState.Environment.TrackTemperature = TelemetryInfo.TrackTemp.Value;
                
                gameState.CarState.RPM = TelemetryInfo.RPM.Value;
                gameState.CarState.Speed = TelemetryInfo.Speed.Value;
                gameState.CarState.Gear = TelemetryInfo.Gear.Value;

                gameState.CarState.WaterTemp = TelemetryInfo.WaterTemp.Value;

                gameState.CarState.FuelLevel = TelemetryInfo.FuelLevelPct.Value;
                gameState.CarState.FuelCapacity = (100 / (TelemetryInfo.FuelLevelPct.Value * 100)) * TelemetryInfo.FuelLevel.Value;
                gameState.CarState.Throttle = TelemetryInfo.Throttle.Value;
                gameState.CarState.Brake = TelemetryInfo.Brake.Value;

                gameState.CarState.Wheel = RadianToDegree(TelemetryInfo.SteeringWheelAngle.Value);

                gameState.CarState.Acceleration.X = TelemetryInfo.VelocityX.Value;
                gameState.CarState.Acceleration.Y = TelemetryInfo.VelocityY.Value;

                gameState.Timing.PersonalFastestLap = GetBestLApTime(TelemetryInfo.LapBestLapTime.Value);
                gameState.CarState.CurrentLapTime = GetBestLApTime(TelemetryInfo.LapCurrentLapTime.Value);

                gameState.CarState.EngineDamage =  (float)TelemetryInfo.EngineWarnings.Value.Value;

                var tt = 56;

            }
        }

        private string GetBestLApTime(float bestLapTime)
        {
            string bestTime;

            if (bestLapTime != 0)
            {
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

    }
}

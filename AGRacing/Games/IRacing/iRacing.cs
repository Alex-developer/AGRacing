using System;
using System.Linq;
using AGRacing.GameData.GameState;
using iRacingSdkWrapper;

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
            wrapper.TelemetryUpdated += OnTelemetryUpdated;
            wrapper.SessionInfoUpdated += OnSessionInfoUpdated;
        }

        public override void StartGameReader(GameState gameState)
        {
            this.gameState = gameState;
            wrapper.Start();
        }

        public override void StopReader()
        {
            wrapper.Stop();
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

                gameState.CarState.RPM = TelemetryInfo.RPM.Value;
                gameState.CarState.Gear = TelemetryInfo.Gear.Value;
                var tt = 56;
            }
        }
    }
}

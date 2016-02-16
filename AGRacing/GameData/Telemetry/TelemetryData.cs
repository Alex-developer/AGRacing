using System;
using System.Collections.Generic;
using System.Linq;
using AGRacing.GameData.Telemetry.Sessions;
using AGRacing.Games;
using AGRacing.GameData.GameState.Car;

namespace AGRacing.GameData.Telemetry
{
    public class TelemetryData
    {
        public bool Connected { get; set; }
        public GameBase Game { get; set; }
        public EventSessions Sessions { get; set; }
        public CarData CarState { get; set; }

        public TelemetryData()
        {
            Reset();
        }

        public void Reset()
        {
            CarState = new CarData();
            Sessions = new EventSessions();
        }
    }
}

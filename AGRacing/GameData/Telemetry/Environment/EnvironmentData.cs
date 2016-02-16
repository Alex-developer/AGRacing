using System;
using System.Linq;

namespace AGRacing.GameData.GameState.Environment
{
    public class EnvironmentData
    {
        public string TrackName { get; set; }
        public string TrackVarient { get; set; }
        public string SessionType { get; set; }

        
        public float AmbientTemperature { get; set; }
        public float TrackTemperature { get; set; }
        public double FPS { get; set;  } 
        public int Drivers { get; set; }
        public int Position { get; set; }
        public RaceState RaceState { get; set; }
        public float MaxRPM { get; set; }
        public string CarName { get; set; }
        public string CarClass { get; set; }
    }
}

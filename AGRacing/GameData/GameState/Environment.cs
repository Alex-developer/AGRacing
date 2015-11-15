using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AGRacing.GameData.GameState
{
    public class Environment
    {
        public string TrackName { get; set; }
        public string TrackVarient { get; set; }
        public float AmbientTemperature { get; set; }
        public float TrackTemperature { get; set; }
        public int Drivers { get; set; }
        public int Position { get; set; }
        public SessionType Session { get; set; }
        public RaceState RaceState { get; set; }
        public float MaxRPM { get; set; }
        public string CarName { get; set; }
        public string CarClass { get; set; }
    }
}

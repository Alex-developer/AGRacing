using System;
using System.Collections.Generic;
using System.Linq;

namespace AGRacing.GameData.GameState
{
    public class Timing
    {
        public List<PlayerState> PlayerStates { get; set; }
        public float SessionTimeLeft { get; set; }
        public float SplitAhead { get; set; }
        public float SplitBehind { get; set; }
        public float Split { get; set; }
        public float PersonalFastestLap { get; set; }
        public float WorldlFastestLap { get; set; }
        public float[] CurrentSectors { get; set; }
        public float[] FastestSectors { get; set; }
        public float[] PersonalFastestSectors { get; set; }
        public float[] WorldFastestSectors { get; set; }

        public Timing()
        {
            PlayerStates = new List<PlayerState>();
        }

    }
}

using System;
using System.Linq;
using AGRacing.GameData.TrackData;

namespace AGRacing.GameData.GameState
{
    public class TrackPos
    {
        public string Name { get; set; }
        public int LapNumber { get; set; }
        public int Position { get; set; }
        public TrackPoint CarPosition { get; set; }
        public double FastestLapTime { get; set; }
        public bool IsMe { get; set; }

        public TrackPos()
        {
            CarPosition = new TrackPoint();
        }
    }
}

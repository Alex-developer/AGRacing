using System;
using System.Linq;


namespace AGRacing.GameData.Telemetry.Sessions.SessionDrivers
{
    public class Car
    {
        public int id { get; set; }

        public bool IsCurrentDriver { get; set; }
        public string Name { get; set; }
        public string CarName { get; set; }

        public int Position { get; set; }

        public string BestLapTime { get; set; }
        public string LastLapTime { get; set; }
        public string Time { get; set; }
        public string LapsComplete { get; set; }

    }
}

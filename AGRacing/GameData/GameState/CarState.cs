using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AGRacing.GameData.TrackData;

namespace AGRacing.GameData.GameState
{
    public class CarState
    {
        public int Gear { get; set; }
        public float Speed { get; set; }
        public float RPM { get; set; }
        public float RPMPercent { get; set; }
        public float FuelLevel { get; set; }
        public float FuelCapacity { get; set; }
        public float WaterTemp { get; set; }
        public float OilTemp { get; set; }
        public float[] TyreTemp { get; set; }
        public float[] TyreWear { get; set; }
        public float[] BrakeTemp { get; set; }
        public TrackPoint CarPosition { get; set; }
        public string CurrentLapTime { get; set; }
        public List<TrackPos> CarTrackPos { get; set; }
        public float Throttle { get; set; }
        public float Brake { get; set; }
        public float Wheel { get; set; }
        public Acceleration Acceleration { get; set; }
        public bool LapInvalidated { get; set; }
        public float AeroDamage { get; set; }
        public float EngineDamage { get; set; }
        public float[] BrakeDamage { get; set; }
        public float[] SuspensionDamage { get; set; }
        public Flags Flag { get; set; }
        public FlagReason FlagReason { get; set; }

        public CarState()
        {
            CarPosition = new TrackPoint();
            CarTrackPos = new List<TrackPos>();
            Acceleration = new Acceleration();
        }

    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AGRacing.GameData.GameState;
using AGRacing.GameData.GameState.Car;
using AGRacing.GameData.Telemetry.Car;

namespace AGRacing.GameData.GameState.Car
{
    public class CarData
    {
        public int Gear { get; set; }
        public float Speed { get; set; }
        public float FuelLevel { get; set; }
        public float FuelCapacity { get; set; }
        public float[] TyreTemp { get; set; }
        public float[] TyreWear { get; set; }
        public float[] BrakeTemp { get; set; }
        public float Throttle { get; set; }
        public float Brake { get; set; }
        public float Wheel { get; set; }

        public Acceleration Acceleration { get; set; }

        public bool LapInvalidated { get; set; }

        public float AeroDamage { get; set; }
        public float[] BrakeDamage { get; set; }
        public float[] SuspensionDamage { get; set; }
        public AGRacing.GameData.GameState.Flags Flag { get; set; }

        public AGRacing.GameData.GameState.FlagReason FlagReason { get; set; }

        public int PitSpeedLimiterActive { get; set; }

        public Engine Engine { get; set; }
        public Chassis Chassis { get; set; }

        public string CurrentLapTime { get; set; }

        public CarData()
        {
            Acceleration = new AGRacing.GameData.GameState.Acceleration();
            Engine = new AGRacing.GameData.GameState.Car.Engine();
            Chassis = new Chassis();
        }

    }
}
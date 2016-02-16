using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AGRacing.GameData.GameState.Car
{
    public class Engine
    {
        public float RPM { get; set; }
        public float RPMPercent { get; set; }
        public float WaterTemp { get; set; }
        public float OilTemp { get; set; }
        public bool WaterTempWarning { get; set; }
        public bool FuelPressureWarning { get; set; }
        public bool OilPressureWarning { get; set; }
        public bool EngineStalled { get; set; }
        public bool RevLimiterActive { get; set; }
    }
}

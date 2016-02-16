using System;
using System.Collections.Generic;
using System.Linq;
using iRacingSdkWrapper;

namespace AGRacing.GameData.Telemetry.Sessions.SessionDrivers
{
    public class Cars
    {
        private readonly List<Car> _drivers;
        public List<Car> DriverList { get { return _drivers; } }

        public Cars()
        {
            _drivers = new List<Car>();
        }

        public void ResetDrivers()
        {
            _drivers.Clear();
        }

    }
}

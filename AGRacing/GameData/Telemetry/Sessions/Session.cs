using System;
using System.Linq;
using AGRacing.GameData.Telemetry.Sessions.SessionDrivers;

namespace AGRacing.GameData.Telemetry.Sessions
{
    public class Session
    {
        public string SessionType { get; set; }
        public int SessionNum { get; set; }
        private readonly Cars _drivers;

        public Session() {
            _drivers = new Cars();
        }

        #region Getters and Setters
        public Cars Drivers
        {
            get
            {
                return _drivers;
            }
        }
        #endregion


    }
}

/**
public enum AC_SESSION_TYPE
{
    AC_UNKNOWN = -1,
    AC_PRACTICE = 0,
    AC_QUALIFY = 1,
    AC_RACE = 2,
    AC_HOTLAP = 3,
    AC_TIME_ATTACK = 4,
    AC_DRIFT = 5,
    AC_DRAG = 6
}

enum Session
{
    Unavailable = -1,
    Practice = 0,
    Qualify = 1,
    Race = 2,
};
**/
using System;
using System.Linq;

namespace AGRacing.GameData.GameState
{
    public enum FlagReason
    {
        FlagReasonNone = 0,
        FlagReasonSoloCrash,
        FlagReasonVehicleCrash,
        FlagReasonVehicleObstruction,
        FlagReasonMax
    };
}

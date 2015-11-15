using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AGRacing.GameData.GameState
{
    public enum RaceState
    {
        RacestateInvalid = 0,
        RacestateNotStarted,
        RacestateRacing,
        RacestateFinished,
        RacestateDisqualified,
        RacestateRetired,
        RacestateDnf,
        RacestateMax
    }
}

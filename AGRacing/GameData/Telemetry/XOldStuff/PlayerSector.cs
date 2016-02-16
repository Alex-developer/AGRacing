using System;
using System.Linq;
using System.Diagnostics;
using System.Web.Script.Serialization;

namespace AGRacing.GameData.GameState
{
    public class PlayerSector
    {
        public int SectorNumber { get; set; }

        public long SectorTime { get; set; }

        [ScriptIgnore]
        public Stopwatch SectorTimer = new Stopwatch();

        public PlayerSector()
        {
            SectorTimer.Start();
        }

        public void CompleteSector()
        {
            SectorTimer.Stop();
            SectorTime = SectorTimer.ElapsedMilliseconds;
        }
    }
}
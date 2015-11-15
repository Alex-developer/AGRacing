using System;
using System.Collections.Generic;
using System.Linq;
using System.Diagnostics;
using System.Web.Script.Serialization;

namespace AGRacing.GameData.GameState
{
    public class PlayerLap
    {
        public int LapNumber { get; set; }
        public int CurrentSectorNumber { get; set; }
        public bool Valid { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public long LapTime { get; set; }
        public List<PlayerSector> Sectors { get; set; }

        [ScriptIgnore]
        public Stopwatch LapTimer = new Stopwatch();
        
        private PlayerSector CurrentSector;
        
        public PlayerLap(int currentSector, int currentLap) {

            Sectors = new List<PlayerSector>();

            LapNumber = currentLap;
            LapTimer.Start();
            CurrentSector = new PlayerSector();
            CurrentSector.SectorNumber = currentSector;
            Sectors.Add(CurrentSector);
        }

        public void RestartLap()
        {
            LapTimer.Restart();
            Sectors = new List<PlayerSector>();
            CurrentSector = new PlayerSector();
            CurrentSector.SectorNumber = 1;
            Sectors.Add(CurrentSector);
        }

        public double CompleteLap() {
            LapTimer.Stop();
            LapTime = LapTimer.ElapsedMilliseconds;
            CurrentSector.CompleteSector();
            return LapTime;
        }

        public void Update(int currentSector)
        {
            if (currentSector != CurrentSector.SectorNumber)
            {
                CurrentSector.CompleteSector();
                CurrentSector = new PlayerSector();
                CurrentSector.SectorNumber = currentSector;
                Sectors.Add(CurrentSector);
            }
        }
    }
}

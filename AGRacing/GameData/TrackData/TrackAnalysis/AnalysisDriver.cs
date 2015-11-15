using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AGRacing.GameData.TrackData.TrackAnalysis
{
    public class AnalysisDriver
    {
        public string Name { get; set; }
        public List<AnalysisLap> AnalysisLaps { get; set; }

        public AnalysisDriver()
        {
            AnalysisLaps = new List<AnalysisLap>();
        }

        public void AddTrackPoint(int currentlap, float lapDistance, int sector, float x, float y, float z)
        {
            AnalysisLap lap = AnalysisLaps.Find(stuff => stuff.Lap == currentlap);
            if (lap == null)
            {
                lap = new AnalysisLap() { Lap = currentlap };
                AnalysisLaps.Add(lap);
            }
            lap.AddPoint(x, y, z, lapDistance, sector);
        }
    }
}

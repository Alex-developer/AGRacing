using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;

namespace AGRacing.GameData.TrackData.TrackAnalysis
{
    public class AnalysisLap
    {
        public int Lap { get; set; }
        public int TotalPoints { get; set; }
        public float LapDistance { get; set; }

        [ScriptIgnore]
        public List<TrackPoint> TrackPointsTemp {get; set;}

        public List<TrackPoint> TrackPoints {get; set;}

        public AnalysisLap()
        {
            TrackPointsTemp = new List<TrackPoint>();
            TotalPoints = TrackPointsTemp.Count;
        }

        public void AddPoint(float x, float y, float z, float lapDistance, int sector)
        {
            TrackPointsTemp.Add(new TrackPoint() { x = x, y = y, z = z, d=lapDistance,s=sector });
            TotalPoints = TrackPointsTemp.Count;
            LapDistance = lapDistance;
        }
    }
}
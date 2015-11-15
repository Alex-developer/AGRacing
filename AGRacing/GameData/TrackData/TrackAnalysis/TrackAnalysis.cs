using System;
using System.Collections.Generic;
using System.Linq;
using System.Drawing;

namespace AGRacing.GameData.TrackData.TrackAnalysis
{
    public class TrackAnalysis
    {
        public List<AnalysisDriver> AnalysisDrivers { get; set; }
        public TrackBounds TrackBounds { get; set; }
        public string TrackName { get; set; }
        public string TrackVariation { get; set; }
        public float TrackLength { get; set; }
        public TrackAnalysis()
        {
            AnalysisDrivers = new List<AnalysisDriver>();
            TrackBounds = new TrackBounds(0, 0, 0, 0);
        }

        public void UpdateDriver(string name, int lap, float lapDistance, int sector, float x, float y, float z)
        {
            if (lap != 1)
            {
                AnalysisDriver driver = AnalysisDrivers.Find(stuff => stuff.Name == name);
                if (driver == null)
                {
                    driver = new AnalysisDriver() { Name = name };
                    AnalysisDrivers.Add(driver);
                }
                driver.AddTrackPoint(lap, lapDistance, sector, x, y, z);
                if (x < TrackBounds.X)
                {
                    TrackBounds.X = x;
                }
                if (y < TrackBounds.Y)
                {
                    TrackBounds.Y = y;
                }
            }
        }
    }
}

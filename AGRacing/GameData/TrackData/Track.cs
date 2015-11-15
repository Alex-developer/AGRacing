using System;
using System.Collections.Generic;
using System.Linq;
using System.Drawing;

namespace AGRacing.GameData.TrackData
{
    [Serializable]
    public class Track
    {
        public List<TrackPoint> TrackPoints { get; set; }
        public TrackBounds TrackBounds { get; set; }
        public string TrackName { get; set; }
        public string TrackVariation { get; set; }
        public float TrackLength { get; set; }
        public Track()
        {
            TrackPoints = new List<TrackPoint>();
            TrackBounds = new TrackBounds(0, 0, 0, 0);
        }
    }
}

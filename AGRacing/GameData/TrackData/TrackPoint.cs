using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AGRacing.GameData.TrackData
{
    [Serializable]
    public class TrackPoint
    {
        public float x { get; set; }
        public float y { get; set; }
        public float z { get; set; }
        public float d { get; set; }
        public int s { get; set; }

    }
}

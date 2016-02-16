using System;
using System.Collections.Generic;
using System.Linq;
using AGRacing.GameData.TrackData;

namespace AGRacing.GameData.GameState
{
    public class PlayerState
    {
        public string Name { get; set; }

        public int LapNumber { get; set; }

        public int NumberOfLaps { get; set; }

        public int SectorNumber { get; set; }

        public int Position { get; set; }

        public string Car { get; set; }

        public string CarType { get; set; }

        public bool OnTrack { get; set; }

        public List<PlayerLap> Laps { get; set; }

        public int FastestLap { get; set; }

        public float FastestLapTime { get; set; }
        public float LastLapTime { get; set; }
        public float CurrentLapTime { get; set; }

        public TrackPoint CarPosition { get; set; }

        public bool IsMe { get; set; }

        public float TrackLength { get; set; }

        private float lastLapDistance = -1;

        public PlayerState()
        {
            FastestLapTime = -1;
            Laps = new List<PlayerLap>();
            CarPosition = new TrackPoint();
        }

        public void UpdateLap(int currentLap, int currentSector, int position, int numberOfLaps, bool onTrack, float lapDistance, float x, float y, float z)
        {

            if (Laps.Count == 0)
            {
                Laps.Add(new PlayerLap(currentSector, currentLap));
            }
            PlayerLap lastLap = Laps.Last();

            if (currentLap == 1)
            {
                if (lapDistance < lastLapDistance)
                {
                    lastLap.RestartLap();
                }
            }

            Position = position;
            LapNumber = currentLap;

            CarPosition.x = x;
            CarPosition.y = y;
            CarPosition.z = z;

            NumberOfLaps = numberOfLaps;
            OnTrack = onTrack;

                
            if (currentLap > lastLap.LapNumber)
            {
                double lastLapTime = lastLap.CompleteLap();
                Laps.Add(new PlayerLap(currentSector, currentLap));

                if ((lastLapTime < FastestLapTime) || FastestLapTime == -1)
                {
                    FastestLapTime = (float)lastLapTime;
                    FastestLap = lastLap.LapNumber;
                }
            }
            lastLap.Update(currentSector);

            lastLapDistance = lapDistance;
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using AGRacing.Games;
using AGRacing.GameData.TrackData.TrackAnalysis;

namespace AGRacing.GameData.GameState
{
    public class GameState
    {
        public bool Connected { get; set; }
        public GameBase Game { get; set; }
        public CarState CarState { get; set; }
        public Environment Environment { get; set; }
        public Timing Timing { get; set; }
        public TrackAnalysis TrackAnalysis { get; set; }

        public GameState()
        {
            CarState = new CarState();
            Environment = new Environment();
        }

        public void Reset(int totalDrivers, int playerPos)
        {
            CarState = new CarState();
            Timing = new Timing();

            for (int i = 0; i < totalDrivers; i++)
            {
                AddDriver(i, playerPos);
            }

        }

        public void AddDriver(int pos, int playerPos)
        {
                PlayerState playerState = new PlayerState(){ IsMe = false};
                if (pos == playerPos)
                {
                    playerState.IsMe = true;
                }
                Timing.PlayerStates.Add(playerState);

                TrackPos trackPos = new TrackPos();
                CarState.CarTrackPos.Add(trackPos);
        }

    }
}

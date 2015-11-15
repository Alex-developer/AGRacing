using System;
using System.Linq;

namespace AGRacing.GameData
{
    public class GameExecutableData {

        public struct GameInfo
        {
            public string[] Processes;    
            public string[] Classes;
        }

        private readonly GameInfo gameData;

        public GameExecutableData() {
            gameData = new GameInfo();
            gameData.Processes = new string[] { "pCARS", "pCARS64", "pCARS2Gld", "AssettoCorsa", "iRacingSim", "iRacingSim64" };
            gameData.Classes = new string[] {"ProjectCars", "ProjectCars", "ProjectCars", "AssettoCorsa", "IRacing", "IRacing"};
        }

        public GameInfo GetGameData()
        {
          return gameData;
        }
    }
}

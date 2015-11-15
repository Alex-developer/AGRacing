using System;
using System.Linq;
using System.IO;
using AGRacing.GameData.GameState;
using AGRacing.GameData.TrackData;


namespace AGRacing.Games
{
    public class GameBase
    {
        public bool GameDataValid { get; set; }
        public virtual string GameName()
        {
            return "";    
        }

        public virtual void StartGameReader(GameState gameState)
        {
        }
        public virtual void SaveTelemetry()
        {
        }

        public virtual void StopReader()
        {
        }
        public virtual void ReadData()
        {
        }

        public virtual void AnalyseRecordingForTracks()
        {

        }
        public virtual Track BuildTrackData(string driverName, int lap)
        {
            return new Track();
        }
        public virtual void SaveTrack(string driverName, int lap)
        {

        }

        public virtual void StartRecording()
        {

        }
        public virtual void StopRecording()
        {

        }

        public virtual Track LoadTrack()
        {
            return new Track();
        }
    
    }
}
using System;
using System.Linq;
using System.IO;
using AGRacing.GameData.Telemetry;
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

        public virtual byte GameCode()
        {
            return 0;
        }

        public virtual void StartGameReader(TelemetryData gameState)
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

        public virtual bool IsEventDriven()
        {
            return false;
        }
    
    }
}
using System;
using System.Linq;
using System.IO;
using AGRacing.ProjectCars.GameData;
using AGRacing.GameData.GameState;

namespace AGRacing.Games.ProjectCars.DataReaders
{
    class DataReaderBase
    {
        protected FileStream stream;
        protected bool recording = false;
        private readonly string recordingPath = Directory.GetCurrentDirectory() + "\\Tracks\\Project Cars\\Recordings\\telemetry.dat";

        public virtual void InitialiseReader()
        {  
        }

        public virtual void InitialiseReader(string fileName)
        {  
        }

        public virtual void StartReader()
        {  
        }

        public virtual ProjectCarsApi ReadPacket()
        {
            return new ProjectCarsApi();
        }

        public virtual ProjectCarsApi ReadPacket(GameState gameState)
        {
            return new ProjectCarsApi();
        }

        public virtual void StopReader()
        {  
        }

        #region Data Recording
        
        public void StartRecording()
        {
            stream = new FileStream(recordingPath, FileMode.Create);
            recording = true;
        }
        
        public void StopRecording()
        {
            recording = false;
            stream.Close();
        }
    
        #endregion

    }
}

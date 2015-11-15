using System;
using System.Linq;
using System.Runtime.InteropServices;
using System.IO;
using AGRacing.ProjectCars.GameData;
using AGRacing.GameData.GameState;

namespace AGRacing.Games.ProjectCars.DataReaders
{
    class FileReader : DataReaderBase
    {
        private readonly int sharedMemorySize = Marshal.SizeOf(typeof(ProjectCarsApi));
        private FileStream fileStream;
        byte[] bytes;
        private ProjectCarsApi gameData = new ProjectCarsApi();

        public FileReader(string fileName)
        {
            fileStream = new FileStream(fileName, FileMode.Open);
            bytes = new byte[sharedMemorySize];
        }

        public override void InitialiseReader()
        {
        }

        public override void StartReader()
        {
        }

        public override ProjectCarsApi ReadPacket(GameState gameState)
        {

            int bytesRead = fileStream.Read(bytes, 0, sharedMemorySize);

            var alloc = GCHandle.Alloc(bytes, GCHandleType.Pinned);
            gameData = (ProjectCarsApi)Marshal.PtrToStructure(alloc.AddrOfPinnedObject(), typeof(ProjectCarsApi));
            alloc.Free();

            return gameData;
        }

        public override void StopReader()
        {
            fileStream.Close();
        }

    }
}

using System;
using System.Linq;
using System.IO;
using System.IO.MemoryMappedFiles;
using System.Runtime.InteropServices;
using AGRacing.ProjectCars.GameData;
using AGRacing.GameData.GameState;

namespace AGRacing.Games.ProjectCars.DataReaders
{
    class GameReader : DataReaderBase
    {
        private MemoryMappedFile mappedFile;
        private MemoryMappedViewStream memoryMappedViewStream;
        private ProjectCarsApi gameData = new ProjectCarsApi();
        private readonly int sharedMemorySize = Marshal.SizeOf(typeof(ProjectCarsApi));
        private BinaryReader reader;

        private int counter = 0;

        public override void InitialiseReader()
        {
            mappedFile = MemoryMappedFile.OpenExisting("$pcars$");
        }

        public override void StartReader()
        {
        }

        public override ProjectCarsApi ReadPacket(GameState gameState)
        {
            ProjectCarsApi gameData = ReadBuffer(mappedFile, gameState);

            return gameData;
        }

        public override void StopReader()
        {
        }

        private ProjectCarsApi ReadBuffer(MemoryMappedFile mappedFile, GameState gameState)
        {
            memoryMappedViewStream = mappedFile.CreateViewStream();
            reader = new BinaryReader(memoryMappedViewStream);
            var bytes = reader.ReadBytes(sharedMemorySize);
            reader.Close();
            memoryMappedViewStream.Close();

            if (bytes.Length == sharedMemorySize)
            {
                if (recording)
                {
                    counter++;
                    if (counter > 100)
                    {
                        counter = 0;
                        stream.Write(bytes, 0, bytes.Length);
                    }
                }

                var alloc = GCHandle.Alloc(bytes, GCHandleType.Pinned);
                gameData = (ProjectCarsApi)Marshal.PtrToStructure(alloc.AddrOfPinnedObject(), typeof(ProjectCarsApi));
                alloc.Free();
            }

            return gameData;
        }
    }
}
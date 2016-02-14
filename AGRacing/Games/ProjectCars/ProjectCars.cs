using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Text;
using System.Runtime.InteropServices;
using System.Diagnostics;
using System.Runtime.Serialization.Formatters.Binary;
using AGRacing.ProjectCars.GameData;
using AGRacing.Games.ProjectCars.DataReaders;
using AGRacing.GameData.GameState;
using AGRacing.GameData.TrackData;
using AGRacing.GameData.TrackData.TrackAnalysis;

namespace AGRacing.Games.ProjectCars
{
    class ProjectCars : GameBase
    {
        private GameState gameState;
        private readonly string gameName = "Project Cars";
        private SessionType currentSessionType = SessionType.SessionInvalid;
        private int playerPos;
        public List<ProjectCarsApi> telemetry = new List<ProjectCarsApi>();
        private readonly bool testMode = false;
        private DataReaderBase gameReader;
        private ProjectCarsApi gameData;

        private Stopwatch PacketTimer = new Stopwatch();
        private int PacketCount = 0;
        private readonly string recordingPath = Directory.GetCurrentDirectory() + "\\Tracks\\Project Cars\\Recordings\\telemetry.dat";
        private readonly string trackPath = Directory.GetCurrentDirectory() + "\\Tracks\\Project Cars";

        private int LastNumberOfParticipants = 0;

        public override string GameName()
        {
            return gameName;
        }

        public override void StartGameReader(GameState gameState)
        {
            this.gameState = gameState;
            GameDataValid = false;

            if (testMode)
            {
                gameReader = new FileReader("c:\\temp\\oulton.dat");
            }
            else 
            {
                gameReader = new GameReader();
            }
            gameReader.InitialiseReader();
            PacketTimer.Start();
            PacketCount = 0;
        }

        private void ResetSession(ProjectCarsApi gameData)
        {
            currentSessionType = (SessionType)gameData.MSessionState;
            playerPos = gameData.MViewedParticipantIndex;

            int totalDrivers = gameData.MNumParticipants;
            gameState.Reset(totalDrivers, playerPos);

            for (int i = 0; i < totalDrivers; i++)
            {
                AddDriver(i,playerPos);
            }
            gameState.Timing.WorldFastestSectors = null;
            gameState.Timing.PersonalFastestSectors = new float[3];
            gameState.Timing.FastestSectors = new float[3];
        }

        private void AddDriver(int pos, int playerPos)
        {
            PlayerState p;
            try
            {
                p = gameState.Timing.PlayerStates[pos];
            }
            catch (Exception ex)
            {
                gameState.AddDriver(pos, playerPos);
                p = gameState.Timing.PlayerStates[pos];
            }
            p.Name = gameData.MParticipantInfo[pos].mName.Value;
            p.LapNumber = gameData.MParticipantInfo[pos].mCurrentLap;
            p.SectorNumber = gameData.MParticipantInfo[pos].mCurrentSector;
            p.Position = gameData.MParticipantInfo[pos].mRacePosition;
            p.Car = gameData.MCarName.Value;
            p.CarType = gameData.MCarClassName.Value;
            p.TrackLength = gameData.MTrackLength;
        }

        public override void ReadData()
        {
            gameData = gameReader.ReadPacket(gameState);
 
            if (gameData.MSessionState != 0)
            {
                GameDataValid = true;

                if (currentSessionType != (SessionType)gameData.MSessionState)
                {
                    ResetSession(gameData);
                }

                PacketCount++;
                if (PacketTimer.ElapsedMilliseconds > 1000)
                {
                    //     Console.WriteLine(PacketCount);
                    PacketCount = 0;
                    PacketTimer.Restart();
                }
                /**
                 * Environment
                 **/
                gameState.Environment.TrackName = gameData.MTrackLocation.Value;
                gameState.Environment.TrackVarient = gameData.MTrackVariation.Value;
                gameState.Environment.TrackTemperature = gameData.MTrackTemperature;
                gameState.Environment.AmbientTemperature = gameData.MAmbientTemperature;
                gameState.Environment.Drivers = gameData.MNumParticipants;
                gameState.Environment.Position = gameData.MParticipantInfo[gameData.MViewedParticipantIndex].mRacePosition;
                gameState.Environment.Session = (SessionType)gameData.MSessionState;
                gameState.Environment.RaceState = (RaceState)gameData.MRaceState;
                gameState.Environment.MaxRPM = gameData.MMaxRpm;
                gameState.Environment.CarName = gameData.MCarName.Value;
                gameState.Environment.CarClass = gameData.MCarClassName.Value;

                /**
                 * Car State
                 **/
                gameState.CarState.RPM = gameData.MRpm;
                gameState.CarState.Speed = (float)(gameData.MSpeed * 2.23693629); // MPH
                gameState.CarState.Gear = gameData.MGear;
                gameState.CarState.FuelLevel = gameData.MFuelLevel;
                gameState.CarState.FuelCapacity = gameData.MFuelCapacity;
                gameState.CarState.OilTemp = gameData.MOilTempCelsius;
                gameState.CarState.WaterTemp = gameData.MWaterTempCelsius;
                gameState.CarState.TyreTemp = gameData.MTyreTemp;
                gameState.CarState.TyreWear = gameData.MTyreWear;
                gameState.CarState.BrakeTemp = gameData.MBrakeTempCelsius;
               // gameState.CarState.CurrentLapTime = gameData.MCurrentTime;
                gameState.CarState.Throttle = gameData.MThrottle;
                gameState.CarState.Brake = gameData.MBrake;
                gameState.CarState.Wheel = gameData.MSteering;
                gameState.CarState.LapInvalidated = gameData.MLapInvalidated;
                gameState.CarState.AeroDamage = gameData.MAeroDamage;
                gameState.CarState.EngineDamage = gameData.MEngineDamage;
                gameState.CarState.SuspensionDamage = gameData.MSuspensionDamage;
                gameState.CarState.BrakeDamage = gameData.MBrakeDamage;
                gameState.CarState.Flag = (Flags)gameData.MHighestFlagColour;
                gameState.CarState.FlagReason = (FlagReason)gameData.MHighestFlagReason;

                gameState.CarState.Acceleration.X = gameData.MWorldAcceleration[0];
                gameState.CarState.Acceleration.Y = gameData.MWorldAcceleration[2];
                gameState.CarState.Acceleration.Z = gameData.MWorldAcceleration[1];

                int me = gameData.MViewedParticipantIndex;
                if (me >= 0)
                {
                    gameState.CarState.CarPosition.x = gameData.MParticipantInfo[me].mWorldPosition[0];
                    gameState.CarState.CarPosition.y = gameData.MParticipantInfo[me].mWorldPosition[2];
                    gameState.CarState.CarPosition.z = gameData.MParticipantInfo[me].mWorldPosition[1];
                }

                if (gameData.MNumParticipants < LastNumberOfParticipants)
                {
                    for (int i=LastNumberOfParticipants; i < gameData.MNumParticipants; i++) {
                        AddDriver(i, me);
                    }
                }

                /**
                 * Positions and timings
                 **/
                gameState.Timing.SessionTimeLeft = gameData.MEventTimeRemaining;
                for (int i = 0; i < gameData.MNumParticipants; i++)
                {
                    int currentLap = gameData.MParticipantInfo[i].mCurrentLap;
                    int numberOfLaps = gameData.MLapsInEvent;
                    int currentSector = gameData.MParticipantInfo[i].mCurrentSector;
                    int position = gameData.MParticipantInfo[i].mRacePosition;
                    bool onTrack = false;
                    if (gameData.MParticipantInfo[i].mCurrentLapDistance > 0)
                    {
                        onTrack = true;
                    }
                    float x = gameData.MParticipantInfo[i].mWorldPosition[0];
                    float y = gameData.MParticipantInfo[i].mWorldPosition[2];
                    float z = gameData.MParticipantInfo[i].mWorldPosition[1];
                    float lapDistance = gameData.MParticipantInfo[i].mCurrentLapDistance;
                    gameState.Timing.PlayerStates[i].UpdateLap(currentLap, currentSector, position, numberOfLaps, onTrack, lapDistance, x, y, z);

                    gameState.Timing.PlayerStates[me].FastestLapTime = gameData.MBestLapTime;
                    gameState.Timing.PlayerStates[me].LastLapTime = gameData.MLastLapTime;
                    gameState.Timing.PlayerStates[me].CurrentLapTime = gameData.MCurrentTime;
                    
                    TrackPos trackPos = gameState.CarState.CarTrackPos[i];
                    trackPos.CarPosition.x = x;
                    trackPos.CarPosition.y = y;
                    trackPos.CarPosition.z = z;
                    trackPos.Position = position;
                    trackPos.Name = gameData.MParticipantInfo[i].mName.Value;
                    trackPos.FastestLapTime = gameState.Timing.PlayerStates[i].FastestLapTime;
                }
                gameState.Timing.Split = gameData.MSplitTime;
                gameState.Timing.SplitAhead = gameData.MSplitTimeAhead;
                gameState.Timing.SplitBehind = gameData.MSplitTimeBehind;
                //gameState.Timing.PersonalFastestLap = gameData.MPersonalFastestLapTime;
                gameState.Timing.WorldlFastestLap = gameData.MWorldFastestLapTime;

                if (gameState.Timing.WorldFastestSectors == null)
                {
                    gameState.Timing.WorldFastestSectors = new float[3];
                    gameState.Timing.WorldFastestSectors[0] = gameData.MWorldFastestSector1Time;
                    gameState.Timing.WorldFastestSectors[1] = gameData.MWorldFastestSector2Time;
                    gameState.Timing.WorldFastestSectors[2] = gameData.MWorldFastestSector3Time;
                }
                gameState.Timing.PersonalFastestSectors[0] = gameData.MPersonalFastestSector1Time;
                gameState.Timing.PersonalFastestSectors[1] = gameData.MPersonalFastestSector2Time;
                gameState.Timing.PersonalFastestSectors[2] = gameData.MPersonalFastestSector3Time;
                gameState.Timing.FastestSectors[0] = gameData.MFastestSector1Time;
                gameState.Timing.FastestSectors[1] = gameData.MFastestSector2Time;
                gameState.Timing.FastestSectors[2] = gameData.MFastestSector3Time;
            }
            else
            {
                GameDataValid = false;
                currentSessionType = SessionType.SessionInvalid;
            }

            LastNumberOfParticipants = gameData.MNumParticipants;
        }

        #region Data Recording
        
        public override void StartRecording()
        {
            gameReader.StartRecording();
        }
        
        public override void StopRecording()
        {
            gameReader.StopRecording();
        }
        
        #endregion
        
        #region Track Builder
        
        public override void AnalyseRecordingForTracks()
        {
            TrackAnalysis trackAnalysis = new TrackAnalysis();
            int sharedMemorySize = Marshal.SizeOf(typeof(ProjectCarsApi));
            FileStream fileStream = new FileStream(recordingPath, FileMode.Open);
            byte[] bytes = new byte[sharedMemorySize];
            
            int bytesRead = -1;
            int hack = 0;
            
            while (bytesRead != 0)
            {
                bytesRead = fileStream.Read(bytes, 0, sharedMemorySize);
                hack++;
                if (hack > 0)
                {
                    hack = 0;
                    var alloc = GCHandle.Alloc(bytes, GCHandleType.Pinned);
                    ProjectCarsApi gamePacket = (ProjectCarsApi)Marshal.PtrToStructure(alloc.AddrOfPinnedObject(), typeof(ProjectCarsApi));
                    alloc.Free();
                    if (gamePacket.MVersion > 0)
                    {
                        trackAnalysis.TrackName = gamePacket.MTrackLocation.Value;
                        trackAnalysis.TrackVariation = gamePacket.MTrackVariation.Value;
                        trackAnalysis.TrackLength = gamePacket.MTrackLength;
                        
                        int nTotalDrivers = gamePacket.MNumParticipants;
                        for (int i = 0; i < nTotalDrivers; i++)
                        {
                            float x = gamePacket.MParticipantInfo[i].mWorldPosition[0];
                            float y = gamePacket.MParticipantInfo[i].mWorldPosition[2];
                            float z = gamePacket.MParticipantInfo[i].mWorldPosition[1];
                            int lapNumber = gamePacket.MParticipantInfo[i].mCurrentLap;
                            float lapDistance = gamePacket.MParticipantInfo[i].mCurrentLapDistance;
                            int sector = gamePacket.MParticipantInfo[i].mCurrentSector;
                            ;
                            trackAnalysis.UpdateDriver(gamePacket.MParticipantInfo[i].mName.Value, lapNumber, lapDistance, sector, x, y, z);
                        }
                    }
                }
            }
            
            /*    float trackLength = trackAnalysis.TrackLength;
            for (int i = 0; i < trackAnalysis.AnalysisDrivers.Count; i++)
            {
            for (int j = 0; j < trackAnalysis.AnalysisDrivers[i].AnalysisLaps.Count; j++)
            {
            float distanceTravelled = trackAnalysis.AnalysisDrivers[i].AnalysisLaps[j].LapDistance;
            float percentageComplete = (distanceTravelled / trackLength) * 100;
            if (percentageComplete < 99)
            {
            trackAnalysis.AnalysisDrivers[i].AnalysisLaps.RemoveAt(j);
            }
            }
            }*/
            gameState.TrackAnalysis = trackAnalysis;
        }
        
        public override Track BuildTrackData(string driverName, int lapNumber)
        {
            Track track = new Track();
            track.TrackLength = gameState.TrackAnalysis.TrackLength;
            track.TrackName = gameState.TrackAnalysis.TrackName;
            track.TrackVariation = gameState.TrackAnalysis.TrackVariation;
            AnalysisDriver driver = gameState.TrackAnalysis.AnalysisDrivers.Find(stuff => stuff.Name == driverName);
            if (driver != null)
            {
                AnalysisLap lap = driver.AnalysisLaps.Find(stuff => stuff.Lap == lapNumber);
                int totalTrackPoints = lap.TotalPoints;
                track.TrackPoints = lap.TrackPointsTemp;
            }
            return track;
        }
        
        public override void SaveTrack(string driverName, int lapNumber)
        {
            Track trackData = BuildTrackData(driverName, lapNumber);
            string fileName = trackPath + "\\" + trackData.TrackName + " " + trackData.TrackVariation + ".track";
            Stream stream = File.Open(fileName, FileMode.Create);
            BinaryFormatter bFormatter = new BinaryFormatter();
            bFormatter.Serialize(stream, trackData);
            stream.Close();
            exportSVG(trackData);
        }
        
        public void exportSVG(Track trackData)
        {
            string fileName = trackPath + "\\" + trackData.TrackName + " " + trackData.TrackVariation + ".svg";
            float smallestX = 0;
            float smallestY = 0;

            for (int i = 0; i < trackData.TrackPoints.Count; i++)
            {
                if (trackData.TrackPoints[i].x < smallestX)
                {
                    smallestX = trackData.TrackPoints[i].x;
                }
                if (trackData.TrackPoints[i].y < smallestY)
                {
                    smallestY = trackData.TrackPoints[i].y;
                }
            }
            smallestX = Math.Abs(smallestX);
            smallestY = Math.Abs(smallestY);

            string svg = "<?xml version=\"1.0\" standalone=\"yes\"?>";
            svg += "<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">";
            svg += "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\">";
            
            svg += "<polyline points=\"";
            for (int i = 0; i < trackData.TrackPoints.Count; i++)
            {
                svg += (trackData.TrackPoints[i].x + smallestX) + "," + (trackData.TrackPoints[i].y + smallestY) + " ";
            }
            svg += "\" style=\"fill:none;stroke:red;stroke-width:4\" />";
            svg += "</svg>";
            byte[] content = Encoding.UTF8.GetBytes(svg);

            if (File.Exists(fileName))
            {
                File.Delete(fileName);
            }
            using (FileStream fs = File.Create(fileName)) 
            {
                fs.Write(content, 0, content.Length);
            }
        }
        
        public override Track LoadTrack()
        {
            Track track = null;
            
            string trackName = gameState.Environment.TrackName;
            string trackVariation = gameState.Environment.TrackVarient;
            
            try
            {
                string fileName = trackPath + "\\" + trackName + " " + trackVariation + ".track";
                Stream stream = File.Open(fileName, FileMode.Open);
                BinaryFormatter bFormatter = new BinaryFormatter();
                track = (Track)bFormatter.Deserialize(stream);
                stream.Close();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }

            return track;
        }
        
        #endregion
    }
}
using System;
using System.Linq;
using System.IO;
using System.Text;
using System.Collections.Generic;
using System.Web;
using AGRacing.WebServices;
using WebSocketSharp;
using AGRacing.GameData.Telemetry;
using AGRacing.GameData.TrackData;
using AGRacing.GameData.TrackData.TrackAnalysis;
using AGRacing.GameData.GameState.Car;
using AGRacing.GameData.Telemetry;
using AGRacing.GameData.Telemetry.Sessions;

namespace AGRacing.WebServices.Services
{
    public static class DataHandler
    {
        private static bool DataValid(TelemetryData gameState)
        {
            bool dataValid = false;

            if (gameState.Connected && gameState.Game.GameDataValid)
            {
                dataValid = true;
            }
            return dataValid;
        }

        public static String Files(TelemetryData gameState)
        {
            return "";
        }

        public static GameInfo Connected(TelemetryData gameState)
        {
            GameInfo gameInformation = new GameInfo();
            gameInformation.Connected = false;

            if (DataValid(gameState))
            {
                gameInformation.Connected = true;
                gameInformation.GameName = gameState.Game.GameName();
            }
            return gameInformation;
        }



        public static CarData CarState(TelemetryData gameState)
        {
            CarData result = null;

            if (DataValid(gameState))
            {
                result = gameState.CarState;
            }
            return result;
        }

        public static EventSessions Sessions(TelemetryData gameState)
        {
            EventSessions result = null;

            if (DataValid(gameState))
            {
                result = gameState.Sessions;
            }
            return result;
        }

    /**    public static Timing Timing(TelemetryData gameState)
        {
            Timing result = null;

            if (DataValid(gameState))
            {
          //      result = gameState.Timing;
            }
            return result;
        }
**/
        public static bool StartRecording(TelemetryData gameState)
        {
            bool result = true;

            if (DataValid(gameState))
            {
                gameState.Game.StartRecording();
            }
            return result;
        }

        public static bool StopRecording(TelemetryData gameState)
        {
            bool result = true;

            if (DataValid(gameState))
            {
                gameState.Game.StopRecording();
            }
            return result;
        }

        public static TrackAnalysis AnalyseRecording(TelemetryData gameState, List<string> urlBits)
        {
            TrackAnalysis result = null;

            if (DataValid(gameState))
            {
                gameState.Game.AnalyseRecordingForTracks();
            //    result = gameState.TrackAnalysis;
            }
            return result;
        }

        public static Track LoadAnalysedTrack(TelemetryData gameState, List<string> urlBits)
        {
            Track track = null;

            if (urlBits.Count == 3)
            {
                string name = HttpUtility.UrlDecode(urlBits[1]);
                int lap = Int32.Parse(urlBits[2]);
                track = gameState.Game.BuildTrackData(name, lap);
            }
            return track;
        }

        public static void SaveTrack(TelemetryData gameState, List<string> urlBits)
        {
            if (urlBits.Count == 3)
            {
                string name = HttpUtility.UrlDecode(urlBits[1]);
                int lap = Int32.Parse(urlBits[2]);

                gameState.Game.SaveTrack(name, lap);
            }

        }

        public static Track LoadTrack(TelemetryData gameState)
        {
            Track track = gameState.Game.LoadTrack();

            return track;
        }

        public static List<String> ListDashPages(TelemetryData gameState)
        {
            List<String> dashPages = new List<String>();

            if (DataValid(gameState))
            {
                string pagesPath = Directory.GetCurrentDirectory() + "\\Pages\\" + gameState.Game.GameName();
                string[] dashPagesList = Directory.GetFiles(pagesPath, "*.page");
                foreach (string path in dashPagesList)
                {
                    dashPages.Add(Path.GetFileName(path).Replace(".page", ""));
                }
            }
            return dashPages;
        }

        public static string LoadPage(TelemetryData gameState, List<string> urlBits)
        {
            string dashPage = "";
            string fileName = Directory.GetCurrentDirectory() + "\\Pages\\" + gameState.Game.GameName() + "\\" + urlBits[1] + ".page";
            try
            {
                dashPage = File.ReadAllText(fileName);
            }
            catch (Exception ex)
            {
            }
            return dashPage;
        }

        public static string SavePage(TelemetryData gameState, List<string> urlBits, string data)
        {
            if (DataValid(gameState))
            {
                string fileName = urlBits[1] + ".page";
                string pagePath = Directory.GetCurrentDirectory() + "\\Pages\\" + gameState.Game.GameName() + "\\" + fileName;
                byte[] content = Encoding.UTF8.GetBytes(data);

                if (File.Exists(pagePath))
                {
                    File.Delete(fileName);
                }
                using (FileStream fs = File.Create(pagePath)) 
                {
                    fs.Write(content, 0, content.Length);
                }
            }
            return "";
        }
    }
}
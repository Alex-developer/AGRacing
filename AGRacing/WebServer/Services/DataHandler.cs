using System;
using System.Linq;
using System.IO;
using System.Text;
using System.Collections.Generic;
using System.Web;
using AGRacing.GameData.GameState;
using AGRacing.GameData.TrackData;
using AGRacing.GameData.TrackData.TrackAnalysis;

namespace AGRacing.WebServices.Services
{
    public static class DataHandler
    {
        private static bool DataValid(GameState gameState)
        {
            bool dataValid = false;

            if (gameState.Connected && gameState.Game.GameDataValid)
            {
                dataValid = true;
            }
            return dataValid;
        }

        public static bool Connected(GameState gameState)
        {
            bool connected = false;

            if (DataValid(gameState))
            {
                connected = true;
            }
            return connected;
        }

        public static GameState AllData(GameState gameState)
        {
            GameState result = null;

            if (DataValid(gameState))
            {
                result = gameState;
            }
            return result;
        }

        public static List<TrackPos> CarPos(GameState gameState)
        {
            List<TrackPos> trackPos = null;

            if (DataValid(gameState))
            {
                //      trackPos = gameState.TrackPos;
            }
            return trackPos;
        }

        public static CarState CarState(GameState gameState)
        {
            CarState result = null;

            if (DataValid(gameState))
            {
                result = gameState.CarState;
            }
            return result;
        }

        public static AGRacing.GameData.GameState.Environment Environment(GameState gameState)
        {
            AGRacing.GameData.GameState.Environment result = null;

            if (DataValid(gameState))
            {
                result = gameState.Environment;
            }
            return result;
        }

        public static Timing Timing(GameState gameState)
        {
            Timing result = null;

            if (DataValid(gameState))
            {
                result = gameState.Timing;
            }
            return result;
        }

        public static bool StartRecording(GameState gameState)
        {
            bool result = true;

            if (DataValid(gameState))
            {
                gameState.Game.StartRecording();
            }
            return result;
        }

        public static bool StopRecording(GameState gameState)
        {
            bool result = true;

            if (DataValid(gameState))
            {
                gameState.Game.StopRecording();
            }
            return result;
        }

        public static TrackAnalysis AnalyseRecording(GameState gameState, List<string> urlBits)
        {
            TrackAnalysis result = null;

            if (DataValid(gameState))
            {
                gameState.Game.AnalyseRecordingForTracks();
                result = gameState.TrackAnalysis;
            }
            return result;
        }

        public static Track LoadAnalysedTrack(GameState gameState, List<string> urlBits)
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

        public static void SaveTrack(GameState gameState, List<string> urlBits)
        {
            if (urlBits.Count == 3)
            {
                string name = HttpUtility.UrlDecode(urlBits[1]);
                int lap = Int32.Parse(urlBits[2]);

                gameState.Game.SaveTrack(name, lap);
            }

        }

        public static Track LoadTrack(GameState gameState)
        {
            Track track = gameState.Game.LoadTrack();

            return track;
        }

        public static List<String> ListDashPages(GameState gameState)
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

        public static string LoadPage(GameState gameState, List<string> urlBits)
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

        public static string SavePage(GameState gameState, List<string> urlBits, string data)
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
using System;
using System.Linq;
using WebSocketSharp;
using AGRacing.GameData.GameState;
using AGRacing.GameData.TrackData;
using System.Web.Script.Serialization;

namespace AGRacing.WebServices.Services
{
    public class RecordingService : BaseService
    {
        
        public RecordingService(GameState gameState) : base(gameState)
        {
        }

        protected override void OnMessage(MessageEventArgs e)
        {
            dynamic request = new JavaScriptSerializer().Deserialize(e.Data, typeof(object));

            switch ((string)request.action)
            {
                case "start":
                   json = new JavaScriptSerializer().Serialize(true);
                   GameState.Game.StartRecording();
                    break;

                case "stop":
                    GameState.Game.StopRecording();
                    json = new JavaScriptSerializer().Serialize(true);
                    break;

                case "analyse":
                    GameState.Game.AnalyseRecordingForTracks();
                    json = new JavaScriptSerializer().Serialize(GameState.TrackAnalysis);
                    break;

                case "loadanalysedtrack":
                    Track track = GameState.Game.BuildTrackData(request.name, request.lap);
                    json = new JavaScriptSerializer().Serialize(track);
                    break;

            }

            Send(json);
        }
    }
}
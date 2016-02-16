using System;
using System.Linq;
using WebSocketSharp;
using AGRacing.GameData.Telemetry;
using AGRacing.GameData.TrackData;
using System.Web.Script.Serialization;

namespace AGRacing.WebServices.Services
{
    public class TrackService : BaseService
    {
        public TrackService(TelemetryData gameState)
            : base(gameState)
        {
        }

        protected override void OnMessage(MessageEventArgs e)
        {
            dynamic request = new JavaScriptSerializer().Deserialize(e.Data, typeof(object));

            switch ((string)request.action)
            {
                case "save":
                    Telemetry.Game.SaveTrack(request.name, request.lap);
                    json = new JavaScriptSerializer().Serialize(true);
                    break;
                case "load":
                    Track track = Telemetry.Game.LoadTrack();
                    json = new JavaScriptSerializer().Serialize(track);
                    break;
            }

            Send(json);
        }
    }
}
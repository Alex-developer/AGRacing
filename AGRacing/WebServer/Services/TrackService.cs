using System;
using System.Linq;
using WebSocketSharp;
using AGRacing.GameData.GameState;
using AGRacing.GameData.TrackData;
using System.Web.Script.Serialization;

namespace AGRacing.WebServices.Services
{
    public class TrackService : BaseService
    {
        public TrackService(GameState gameState) : base(gameState)
        {
        }

        protected override void OnMessage(MessageEventArgs e)
        {
            dynamic request = new JavaScriptSerializer().Deserialize(e.Data, typeof(object));

            switch ((string)request.action)
            {
                case "save":
                    GameState.Game.SaveTrack(request.name, request.lap);
                    json = new JavaScriptSerializer().Serialize(true);
                    break;
                case "load":
                    Track track = GameState.Game.LoadTrack();
                    json = new JavaScriptSerializer().Serialize(track);
                    break;
            }

            Send(json);
        }
    }
}
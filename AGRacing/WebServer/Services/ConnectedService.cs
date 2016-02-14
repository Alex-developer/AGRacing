using System;
using System.Linq;
using WebSocketSharp;
using AGRacing.GameData.GameState;
using AGRacing.WebServices;
using System.Web.Script.Serialization;

namespace AGRacing.WebServices.Services
{
    public class ConnectedService : BaseService
    {

        public ConnectedService(GameState gameState) : base(gameState)
        {
        }

        protected override void OnMessage(MessageEventArgs e)
        {
            GameInfo result = DataHandler.Connected(GameState);
            json = new JavaScriptSerializer().Serialize(result);
            Send(json);
        }
    }
}
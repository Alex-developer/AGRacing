using System;
using System.Linq;
using WebSocketSharp;
using AGRacing.GameData.GameState;
using System.Web.Script.Serialization;

namespace AGRacing.WebServices.Services
{
    public class AllDataService : BaseService
    {
        
        public AllDataService(GameState gameState) : base(gameState)
        {
        }

        protected override void OnMessage(MessageEventArgs e)
        {
            GameState result = DataHandler.AllData(GameState);
            json = new JavaScriptSerializer().Serialize(result);
            Send(json);
        }
    }
}
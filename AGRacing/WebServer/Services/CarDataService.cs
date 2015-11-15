using System;
using System.Linq;
using WebSocketSharp;
using AGRacing.GameData.GameState;
using System.Web.Script.Serialization;

namespace AGRacing.WebServices.Services
{
    public class CarDataService : BaseService
    {
        
        public CarDataService(GameState gameState) : base(gameState)
        {
        }

        protected override void OnMessage(MessageEventArgs e)
        {
            CarState result = DataHandler.CarState(GameState);
            json = new JavaScriptSerializer().Serialize(result);
            Send(json);
        }
    }
}
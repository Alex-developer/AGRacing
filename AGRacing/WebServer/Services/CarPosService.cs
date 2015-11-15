using System;
using System.Linq;
using System.Collections.Generic;
using WebSocketSharp;
using AGRacing.GameData.GameState;
using System.Web.Script.Serialization;

namespace AGRacing.WebServices.Services
{
    public class CarPosService : BaseService
    {
        public CarPosService(GameState gameState) : base(gameState)
        {
        }
        
        protected override void OnMessage(MessageEventArgs e)
        {
            List<TrackPos> result = DataHandler.CarPos(GameState);
            json = new JavaScriptSerializer().Serialize(result);
            Send(json);
        }
    }
}
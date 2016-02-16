using System;
using System.Linq;
using WebSocketSharp;
using AGRacing.GameData.Telemetry;
using AGRacing.GameData.GameState.Car;
using System.Web.Script.Serialization;

namespace AGRacing.WebServices.Services
{
    public class CarDataService : BaseService
    {

        public CarDataService(TelemetryData gameState)
            : base(gameState)
        {
        }

        protected override void OnMessage(MessageEventArgs e)
        {
            CarData result = DataHandler.CarState(Telemetry);
            json = new JavaScriptSerializer().Serialize(result);
            Send(json);
        }
    }
}
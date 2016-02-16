using System;
using System.Linq;
using WebSocketSharp;
using AGRacing.GameData.Telemetry;
using AGRacing.WebServices;
using System.Web.Script.Serialization;

namespace AGRacing.WebServices.Services
{
    public class ConnectedService : BaseService
    {

        public ConnectedService(TelemetryData gameState)
            : base(gameState)
        {
        }

        protected override void OnMessage(MessageEventArgs e)
        {
            GameInfo result = DataHandler.Connected(Telemetry);
            json = new JavaScriptSerializer().Serialize(result);
            Send(json);
        }
    }
}
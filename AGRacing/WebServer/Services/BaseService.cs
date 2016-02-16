using System;
using System.Linq;
using WebSocketSharp;
using WebSocketSharp.Server;
using AGRacing.GameData.Telemetry;
using System.Web.Script.Serialization;

namespace AGRacing.WebServices.Services
{
    public class BaseService : WebSocketBehavior
    {
        protected TelemetryData Telemetry { get; set; }
        protected string json;

        public BaseService(TelemetryData gameState)
        {
            Telemetry = gameState;
        }
    }
}
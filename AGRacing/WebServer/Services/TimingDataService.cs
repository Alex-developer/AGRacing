using System;
using System.Linq;
using System.Collections.Generic;
using WebSocketSharp;
using AGRacing.GameData.Telemetry;
using System.Web.Script.Serialization;

namespace AGRacing.WebServices.Services
{
    public class TimingDataService : BaseService
    {

        public TimingDataService(TelemetryData gameState)
            : base(gameState)
        {
        }
        
        protected override void OnMessage(MessageEventArgs e)
        {
          //  Timing result = DataHandler.Timing(TelemetryData);
          //  json = new JavaScriptSerializer().Serialize(result);
         //   Send(json);
        }
    }
}
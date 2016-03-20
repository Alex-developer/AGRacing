using System;
using System.Linq;
using WebSocketSharp;
using AGRacing.GameData.Telemetry;
using AGRacing.GameData.GameState.Car;
using System.Web.Script.Serialization;

namespace AGRacing.WebServices.Services
{
    class FileService : BaseService
    {

        public FileService(TelemetryData gameState)
            : base(gameState)
        {
        }

        protected override void OnMessage(MessageEventArgs e)
        {
            String result = DataHandler.Files(Telemetry);
        }

    }
}

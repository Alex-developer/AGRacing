using System.Linq;
using WebSocketSharp;
using AGRacing.GameData.Telemetry;
using AGRacing.GameData.Telemetry.Sessions;
using System.Web.Script.Serialization;

namespace AGRacing.WebServices.Services
{
    public class SessionDataService : BaseService
    {

        public SessionDataService(TelemetryData gameState)
            : base(gameState)
        {
        }

        protected override void OnMessage(MessageEventArgs e)
        {
            EventSessions result = DataHandler.Sessions(Telemetry);
            json = new JavaScriptSerializer().Serialize(result);
            Send(json);
        }
    }
}
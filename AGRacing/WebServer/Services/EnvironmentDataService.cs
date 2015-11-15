using System.Linq;
using WebSocketSharp;
using AGRacing.GameData.GameState;
using System.Web.Script.Serialization;

namespace AGRacing.WebServices.Services
{
    public class EnvironmentDataService : BaseService
    {
        
        public EnvironmentDataService(GameState gameState) : base(gameState)
        {
        }

        protected override void OnMessage(MessageEventArgs e)
        {
            Environment result = DataHandler.Environment(GameState);
            json = new JavaScriptSerializer().Serialize(result);
            Send(json);
        }
    }
}
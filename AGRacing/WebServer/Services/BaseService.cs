using System;
using System.Linq;
using WebSocketSharp;
using WebSocketSharp.Server;
using AGRacing.GameData.GameState;
using System.Web.Script.Serialization;

namespace AGRacing.WebServices.Services
{
    public class BaseService : WebSocketBehavior
    {
        protected GameState GameState {get; set;}
        protected string json;

        public BaseService(GameState gameState)
        {
            GameState = gameState;
        }
    }
}
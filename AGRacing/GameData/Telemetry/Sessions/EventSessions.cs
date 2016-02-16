using System;
using System.Collections.Generic;
using System.Linq;

namespace AGRacing.GameData.Telemetry.Sessions
{
    public class EventSessions
    {

        public List<Session> Sessions { get; set; }

        public string TrackName { get; set; }
        public string TrackVarient { get; set; }
        public string TrackTemperature { get; set; }
        public string AmbientTemperature { get; set; }

        private Session _currentSession;

        #region Getters and Setters
        public Session CurrentSession
        {
            get {
                return _currentSession; 
            }
        }
        #endregion

        #region Constructor
        public EventSessions()
        {
            Sessions = new List<Session>();
        }
        #endregion

        #region Session methods
        public bool AddSession(int sessionNumber)
        {
            _currentSession = new Session() { SessionNum = sessionNumber };
            Sessions.Add(_currentSession);

            return true;
        }
        #endregion


    }
}

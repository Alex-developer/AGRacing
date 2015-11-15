using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.IO;
using System.Threading;
using System.Windows.Forms;
using System.Web.Script.Serialization;
using AGRacing.GameData.GameState;
using AGRacing.GameData.TrackData;
using AGRacing.WebServices.Services;
using WebSocketSharp.Server;

namespace AGRacing.WebServices
{
    class WebServer
    {
        private readonly string[] indexFiles =
        {
            "index.html",
            "index.htm",
            "default.html",
            "default.htm"
        };
    
        private static readonly Object lockObject = new Object();

        private static readonly IDictionary<string, string> mimeTypeMappings = new Dictionary<string, string>(StringComparer.InvariantCultureIgnoreCase)
        {
            #region extension to MIME type list
            
            { ".asf", "video/x-ms-asf" },
            { ".asx", "video/x-ms-asf" },
            { ".avi", "video/x-msvideo" },
            { ".bin", "application/octet-stream" },
            { ".cco", "application/x-cocoa" },
            { ".crt", "application/x-x509-ca-cert" },
            { ".css", "text/css" },
            { ".deb", "application/octet-stream" },
            { ".der", "application/x-x509-ca-cert" },
            { ".dll", "application/octet-stream" },
            { ".dmg", "application/octet-stream" },
            { ".ear", "application/java-archive" },
            { ".eot", "application/octet-stream" },
            { ".exe", "application/octet-stream" },
            { ".flv", "video/x-flv" },
            { ".gif", "image/gif" },
            { ".hqx", "application/mac-binhex40" },
            { ".htc", "text/x-component" },
            { ".htm", "text/html" },
            { ".html", "text/html" },
            { ".ico", "image/x-icon" },
            { ".img", "application/octet-stream" },
            { ".iso", "application/octet-stream" },
            { ".jar", "application/java-archive" },
            { ".jardiff", "application/x-java-archive-diff" },
            { ".jng", "image/x-jng" },
            { ".jnlp", "application/x-java-jnlp-file" },
            { ".jpeg", "image/jpeg" },
            { ".jpg", "image/jpeg" },
            { ".js", "application/x-javascript" },
            { ".mml", "text/mathml" },
            { ".mng", "video/x-mng" },
            { ".mov", "video/quicktime" },
            { ".mp3", "audio/mpeg" },
            { ".mpeg", "video/mpeg" },
            { ".mpg", "video/mpeg" },
            { ".msi", "application/octet-stream" },
            { ".msm", "application/octet-stream" },
            { ".msp", "application/octet-stream" },
            { ".pdb", "application/x-pilot" },
            { ".pdf", "application/pdf" },
            { ".pem", "application/x-x509-ca-cert" },
            { ".pl", "application/x-perl" },
            { ".pm", "application/x-perl" },
            { ".png", "image/png" },
            { ".prc", "application/x-pilot" },
            { ".ra", "audio/x-realaudio" },
            { ".rar", "application/x-rar-compressed" },
            { ".rpm", "application/x-redhat-package-manager" },
            { ".rss", "text/xml" },
            { ".run", "application/x-makeself" },
            { ".sea", "application/x-sea" },
            { ".shtml", "text/html" },
            { ".sit", "application/x-stuffit" },
            { ".swf", "application/x-shockwave-flash" },
            { ".svg", "image/svg+xml" },
            { ".tcl", "application/x-tcl" },
            { ".tk", "application/x-tcl" },
            { ".txt", "text/plain" },
            { ".war", "application/java-archive" },
            { ".wbmp", "image/vnd.wap.wbmp" },
            { ".wmv", "video/x-ms-wmv" },
            { ".xml", "text/xml" },
            { ".xpi", "application/x-xpinstall" },
            { ".zip", "application/zip" },
        
            #endregion
        };
        //   private Thread _serverThread;
        private string rootDirectory;
        private HttpListener listener;
        private int port;
        private IPAddress ipAddress;
        private GameState gameState;

        private WebSocketSharp.Server.HttpServer sd;

        public int Port
        {
            get
            {
                return port;
            }
            private set
            {
            }
        }
        
        /// <summary>
        /// Construct server with given port.
        /// </summary>
        /// <param name="path">Directory path to serve.</param>
        /// <param name="port">Port of the server.</param>
        public WebServer(string path, int port, GameState gameState, IPAddress ipAddress)
        {
            this.Initialize(path, port, gameState, ipAddress);
        }
        
        private void Initialize(string path, int port, GameState gameState, IPAddress ipAddress)
        {
            this.gameState = gameState;
            this.rootDirectory = path;
            this.port = port;
            this.ipAddress = ipAddress;

            sd = new WebSocketSharp.Server.HttpServer(port);
            sd.RootPath = path + "\\";
            sd.AddWebSocketService<ConnectedService>("/Connected", () => new ConnectedService(gameState));
            sd.AddWebSocketService<CarDataService>("/Car", () => new CarDataService(gameState));
            sd.AddWebSocketService<CarPosService>("/CarPos", () => new CarPosService(gameState));
            sd.AddWebSocketService<TimingDataService>("/Timing", () => new TimingDataService(gameState));
            sd.AddWebSocketService<EnvironmentDataService>("/Environment", () => new EnvironmentDataService(gameState));
            sd.AddWebSocketService<RecordingService>("/Recording", () => new RecordingService(gameState));
            sd.Start();

            sd.OnPost += (sender, e) =>
            {
                lock (lockObject)
                {
                    var request = e.Request;
                    var response = e.Response;
                    string[] rawUrlArray = request.RawUrl.Split('?');
                    string rawUrl = rawUrlArray[0];

                    List<string> urlBits = rawUrl.Split('/').ToList().Where(s => !string.IsNullOrWhiteSpace(s)).ToList();

                    bool haveResult = false;
                    dynamic result = null;
                    switch (urlBits[0])
                    {
                        case "SavePage":
                            var oSR = new StreamReader(request.InputStream);
                            string data = oSR.ReadToEnd();
                            result = DataHandler.SavePage(gameState, urlBits, data);
                            haveResult = true;
                            break;
                    }
                }
            };

            sd.OnGet += (sender, e) =>
            {

                lock (lockObject)
                {
                    var request = e.Request;
                    var response = e.Response;

                    string[] rawUrlArray = request.RawUrl.Split('?');
                    string rawUrl = rawUrlArray[0];

                    path = rawUrl;

                    if (string.IsNullOrEmpty(path) || path == "/")
                    {
                        foreach (string indexFile in indexFiles)
                        {
                            if (File.Exists(Path.Combine(rootDirectory, indexFile)))
                            {
                                path = indexFile;
                                break;
                            }
                        }
                    }

                    string mime;
                    response.ContentType = mimeTypeMappings.TryGetValue(Path.GetExtension(path), out mime) ? mime : "application/octet-stream";
                    response.ContentEncoding = Encoding.UTF8;

                    byte[] content = sd.GetFile(path);

                    if (content == null)
                    {
                        List<string> urlBits = rawUrl.Split('/').ToList().Where(s => !string.IsNullOrWhiteSpace(s)).ToList();

                        bool haveResult = false;
                        dynamic result = null;
                        switch (urlBits[0])
                        {
                            case "Connected":
                                result = DataHandler.Connected(gameState);
                                haveResult = true;
                                break;
                            case "Car":
                                result = DataHandler.CarState(gameState);
                                haveResult = true;
                                break;
                            case "CarPos":
                                result = DataHandler.CarPos(gameState);
                                haveResult = true;
                                break;
                            case "Environment":
                                result = DataHandler.Environment(gameState);
                                haveResult = true;
                                break;
                            case "Timing":
                                result = DataHandler.Timing(gameState);
                                haveResult = true;
                                break;
                            case "StartRecording":
                                result = DataHandler.StartRecording(gameState);
                                haveResult = true;
                                break;
                            case "StopRecording":
                                result = DataHandler.StopRecording(gameState);
                                haveResult = true;
                                break;
                            case "AnalyseRecording":
                                result = DataHandler.AnalyseRecording(gameState, urlBits);
                                haveResult = true;
                                break;
                            case "LoadAnalysedTrack":
                                result = DataHandler.LoadAnalysedTrack(gameState, urlBits);
                                haveResult = true;
                                break;
                            case "SaveTrack":
                                result = true;
                                DataHandler.SaveTrack(gameState, urlBits);
                                haveResult = true;
                                break;
                            case "LoadTrack":
                                result = DataHandler.LoadTrack(gameState);
                                haveResult = true;
                                break;
                            case "ListPages":
                                result = DataHandler.ListDashPages(gameState);
                                haveResult = true;
                                break;
                            case "LoadPage":
                                result = DataHandler.LoadPage(gameState, urlBits);
                                haveResult = true;
                                break;
                        }

                        if (haveResult)
                        {
                            response.ContentType = "application/json";
                            string json = new JavaScriptSerializer().Serialize(result);
                            content = Encoding.UTF8.GetBytes(json);
                        }
                        else
                        {
                            response.StatusCode = (int)HttpStatusCode.NotFound;
                            return;
                        }
                    }
                    response.AddHeader("cache-control", "no-store, must-revalidate, private");
                    response.AddHeader("Pragma", "no-cache");

                    response.ContentLength64 = content.Length;

                    System.IO.Stream output = response.OutputStream;
                    output.Write(content, 0, content.Length);
                }
            };
        }

        private void process(HttpServer sender, HttpRequestEventArgs e)
        {

        }

        private void processRequest()
        {

        }

        public void Stop()
        {
            sd.Stop();
        }
    }
}
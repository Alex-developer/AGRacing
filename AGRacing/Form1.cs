using System;
using System.Drawing;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Windows.Forms;
using System.Threading;
using System.IO;
using System.Diagnostics;
using AGRacing.WebServices;
using AGRacing.Games;
using AGRacing.GameData;
using AGRacing.Monitoring;
using AGRacing.GameData.Telemetry;
using System.Runtime.InteropServices;

namespace AGRacing
{
    public partial class FormMain : Form
    {
        private Thread gameMonitorThread;
        private Thread gameReaderThread;
        private GameExecutableData gameData;
        private bool monitoringForGames = true;
        private TelemetryData gameState;
        private WebServer httpServer;
        private IPAddress ipAddress;
        private int webServerPort = Properties.Settings.Default.WebServerPort;
        private bool webServerRunning = false;
        private string webServerPath = Directory.GetCurrentDirectory() + "\\Web";

        delegate void SetTextCallback(Label label, string text);

        public FormMain()
        {
            InitializeComponent();

            gameData = new GameExecutableData();
            gameState = new TelemetryData() { Connected = false };

            ipAddress = GetLocalIpAddress();

            UpdateUserInterface();

            StartWebServer();

            StartGameMonitorThread();

            UpdateUserInterface();
        }
        
        #region User Interface
        
        private void UpdateUserInterface()
        {
            lblIPAddress.Text = ipAddress.ToString();
            txtPort.Text = webServerPort.ToString();
            
            if (webServerRunning)
            {
                lblWebServerStatus.Text = "Running";
                lblWebServerStatus.ForeColor = System.Drawing.Color.White;
                lblWebServerStatus.BackColor = System.Drawing.Color.Green;
            }
            else
            {
                lblWebServerStatus.Text = "Stopped";
                lblWebServerStatus.ForeColor = System.Drawing.Color.Black;
                lblWebServerStatus.BackColor = System.Drawing.Color.Red;
            }
            
            if (gameMonitorThread != null)
            {
                lblProcessMonitor.Text = "Running";
            }
            else
            {
                lblProcessMonitor.Text = "Stopped";
            }
            
            if (gameReaderThread != null)
            {
                UpdateLabel(lblDataReader, "Running");
            }
            else
            {
                UpdateLabel(lblDataReader, "Stopped");
            }
        }
        
        private void UpdateLabel(Label label, string text)
        {
            if (label.InvokeRequired)
            { 
                SetTextCallback d = new SetTextCallback(UpdateLabel);
                this.Invoke(d, new object[] { label, text });
            }
            else
            {
                label.Text = text;
            }
        }
        
        #endregion
        
        #region Web Server
        
        private void StartWebServer()
        {
            if (httpServer != null)
            {
                httpServer.Stop();
            }
            UpdateUserInterface();
            webServerRunning = false;
            if (CheckPortIsFree(webServerPort))
            {
                httpServer = new WebServer(webServerPath, webServerPort, gameState, ipAddress);
                webServerRunning = true;
            }
            UpdateUserInterface();
        }
        
        private bool CheckPortIsFree(int port)
        {
            bool portAvailable = true;
            try
            {
                TcpListener tcpListener = new TcpListener(ipAddress, port);
                tcpListener.Start();
                tcpListener.Stop();
                tcpListener = null;
            }
            catch (SocketException ex)
            {
                Console.WriteLine(ex.ToString());
                portAvailable = false;
            }
            
            return portAvailable;
        }
        
        #endregion
        
        private void StartGameMonitorThread()
        {
            monitoringForGames = true;
            gameMonitorThread = new Thread(new ThreadStart(GameMonitorThread));
            gameMonitorThread.Start();
            SetGameStatusLabel("Waiting ...");
            UpdateUserInterface();
        }
        
        private void StopGameMonitorThread()
        {
            monitoringForGames = false;
            gameMonitorThread.Abort();
            UpdateUserInterface();
        }
        
        private void GameMonitorThread()
        {
            ProcessMonitor processMonitor = new ProcessMonitor(gameData);
            while (monitoringForGames)
            {
                gameState.Game = processMonitor.CheckForProcesses();
                if (gameState.Game != null)
                {
                    SetGameStatusLabel(String.Format("Connected to {0}", gameState.Game.GameName()));
                    processMonitor.SetOnProcessExited((object sender, EventArgs e) => StopGameReaderThread());
                    StartGameReaderThread();
                    StopGameMonitorThread();
                    return;
                }
                Thread.Sleep(1000);
            }
        }
        
        #region Game Reader
        
        public void StartGameReaderThread()
        {
            gameReaderThread = new Thread(() => GameReaderThread(gameState));
            gameReaderThread.Start();
            UpdateUserInterface();
        }
        
        public void StopGameReaderThread(bool restartMOnitor = true)
        {
            gameState.Connected = false;
            if (gameReaderThread != null)
            {
                gameReaderThread.Abort();
            }
            if (restartMOnitor)
            {
                StartGameMonitorThread();
            }
            UpdateUserInterface();
        }

        private void GameReaderThread(TelemetryData gameState)
        {
            bool fileFound = false;
            
            while (!fileFound)
            {
                try
                {
                    gameState.Game.StartGameReader(gameState);
                    fileFound = true;
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.ToString());
                }
            }
            gameState.Connected = true;
            while (true)
            {
                gameState.Game.ReadData();
                Thread.Sleep(1);
            }
        }
        
        private void NoOperation(long durationTicks)
        {
            Stopwatch sw = new Stopwatch();
            
            sw.Start();
            
            while (sw.ElapsedTicks < durationTicks)
            {
            }
        }
        
        #endregion
        
        #region Helper Stuff
        
        public void SetGameStatusLabel(string message)
        {
            gameConnectionState.Text = message;
        }
        
        #endregion
        
        private void Form1_FormClosed(object sender, FormClosedEventArgs e)
        {
            ShutDown();
        }
        
        private void ShutDown()
        {
            if (httpServer != null)
            {
                httpServer.Stop();
            }
            StopGameReaderThread(false);
            StopGameMonitorThread();
            Properties.Settings.Default.WebServerPort = webServerPort;
            Properties.Settings.Default.Save();
        }
        
        private IPAddress GetLocalIpAddress()
        {
            IPHostEntry host;
            IPAddress localIP = null;

            host = Dns.GetHostEntry(Dns.GetHostName());
            foreach (IPAddress ip in host.AddressList)
            {
                if (ip.AddressFamily == AddressFamily.InterNetwork && ip.ToString() != "192.168.56.1")
                {
                    localIP = ip;
                    break;
                }
            }
            return localIP;
        }
        
        private void btnExit_Click(object sender, EventArgs e)
        {
            this.Close();
        }
        
        private void btnWebServerRestart_Click(object sender, EventArgs e)
        {
            StartWebServer();
        }
        
        private void txtPort_TextChanged(object sender, EventArgs e)
        {
            try
            {
                webServerPort = Convert.ToInt32(txtPort.Text);
            }
            catch (FormatException ex)
            {
                Console.WriteLine(ex.ToString());
                txtPort.Text = "";
            }
        }
    }
}
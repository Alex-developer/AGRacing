using System;
using System.Reflection;
using System.Linq;
using System.Diagnostics;
using System.Windows.Forms;
using AGRacing.Games;
using AGRacing.GameData;

namespace AGRacing.Monitoring
{
    public class ProcessMonitor
    {
        private Process[] runningProcess;
        private readonly GameExecutableData gameData;

        public ProcessMonitor(GameExecutableData gameData)
        {
            this.gameData = gameData;
        }

        public GameBase CheckForProcesses()
        {
            GameBase gameClass = (GameBase)null;
            try
            {
                for (int index = 0; index < gameData.GetGameData().Processes.Length; ++index)
                {
                    Process[] processesByName = Process.GetProcessesByName(gameData.GetGameData().Processes[index]);
                    if (processesByName.Length > 0)
                    {
                        string className = gameData.GetGameData().Classes[index];
                        var type = string.Format("AGRacing.Games.{0}.{0}", className);
                        gameClass = Assembly.GetExecutingAssembly().CreateInstance(type) as GameBase;
                        this.runningProcess = processesByName;
                        break;
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Unable to list system processes", "Fatal Error");
                Application.Exit();
            }

            return gameClass;
        }

        public void SetOnProcessExited(EventHandler e)
        {
            try
            {
                this.runningProcess[0].EnableRaisingEvents = true;
                this.runningProcess[0].Exited += e;
            }
            catch (Exception ex)
            {
                MessageBox.Show("Unable to list system processes", "Fatal Error");
                Application.Exit();
            }
        }
    }
}
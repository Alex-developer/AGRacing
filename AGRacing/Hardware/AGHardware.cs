using System;
using System.Linq;
using System.IO.Ports;
using AGRacing.GameData.Telemetry;

namespace AGRacing.Hardware
{
    public class AGHardware
    {
        private SerialPort _serialPort;
        private byte[] _serialdata = new byte[9];


        #region Constructor
        public AGHardware()
        {
            _serialPort = new SerialPort();
        }
        #endregion

        #region Public Methods
        public bool PortOpen()
        {
            return _serialPort.IsOpen;
        }

        public void Start()
        {
            OpenPort();
        }

        public void Stop()
        {
            ClosePort();
        }

        public void SendData(TelemetryData telemetry)
        {
            if (_serialPort.IsOpen)
            {
                int rpm = Convert.ToInt16(telemetry.CarState.Engine.RPM);

                byte shift = Convert.ToByte(Math.Round((telemetry.CarState.Engine.ShiftIndicatorPercentage * 100 * 16) / 100));

                _serialdata[0] = 255;
                _serialdata[1] = Convert.ToByte(telemetry.Game.GameCode());
                _serialdata[2] = Convert.ToByte(telemetry.CarState.Gear + 1);
                _serialdata[3] = Convert.ToByte(telemetry.CarState.Speed);
                _serialdata[4] = Convert.ToByte((rpm >> 8) & 0x00FF);
                _serialdata[5] = Convert.ToByte(rpm & 0x00FF);
                _serialdata[6] = 0;
                _serialdata[7] = Convert.ToByte(shift);
                _serialdata[8] = Convert.ToByte(telemetry.CarState.Engine.RevLimiterActive);

                _serialPort.Write(_serialdata,0,9);

            }
        }
        #endregion

        #region Private methods
        private void OpenPort()
        {
            _serialPort.PortName = "COM3";
            _serialPort.BaudRate = 19200;
            _serialPort.Parity = Parity.None;
            _serialPort.DataBits = 8;

            _serialPort.Open();
        }

        private void ClosePort()
        {
            _serialPort.Close();
        }
        #endregion

    }
}

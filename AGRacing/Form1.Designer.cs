namespace AGRacing
{
    partial class FormMain
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.statusStrip = new System.Windows.Forms.StatusStrip();
            this.gameConnectionState = new System.Windows.Forms.ToolStripStatusLabel();
            this.groupBoxStatus = new System.Windows.Forms.GroupBox();
            this.lblDataReader = new System.Windows.Forms.Label();
            this.lblDataReaderLabel = new System.Windows.Forms.Label();
            this.lblProcessMonitor = new System.Windows.Forms.Label();
            this.lblProcessMonitorLabel = new System.Windows.Forms.Label();
            this.btnExit = new System.Windows.Forms.Button();
            this.groupBoxWebServer = new System.Windows.Forms.GroupBox();
            this.btnWebServerRestart = new System.Windows.Forms.Button();
            this.lblWebServerStatus = new System.Windows.Forms.Label();
            this.lblStatusLabel = new System.Windows.Forms.Label();
            this.txtPort = new System.Windows.Forms.TextBox();
            this.lblPortLabel = new System.Windows.Forms.Label();
            this.lblIPAddress = new System.Windows.Forms.Label();
            this.lblIPAddressLabel = new System.Windows.Forms.Label();
            this.statusStrip.SuspendLayout();
            this.groupBoxStatus.SuspendLayout();
            this.groupBoxWebServer.SuspendLayout();
            this.SuspendLayout();
            // 
            // statusStrip
            // 
            this.statusStrip.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.gameConnectionState});
            this.statusStrip.Location = new System.Drawing.Point(0, 325);
            this.statusStrip.Name = "statusStrip";
            this.statusStrip.Size = new System.Drawing.Size(525, 22);
            this.statusStrip.TabIndex = 0;
            this.statusStrip.Text = "statusStrip1";
            // 
            // gameConnectionState
            // 
            this.gameConnectionState.Name = "gameConnectionState";
            this.gameConnectionState.Size = new System.Drawing.Size(118, 17);
            this.gameConnectionState.Text = "toolStripStatusLabel1";
            // 
            // groupBoxStatus
            // 
            this.groupBoxStatus.Controls.Add(this.lblDataReader);
            this.groupBoxStatus.Controls.Add(this.lblDataReaderLabel);
            this.groupBoxStatus.Controls.Add(this.lblProcessMonitor);
            this.groupBoxStatus.Controls.Add(this.lblProcessMonitorLabel);
            this.groupBoxStatus.Location = new System.Drawing.Point(12, 193);
            this.groupBoxStatus.Name = "groupBoxStatus";
            this.groupBoxStatus.Size = new System.Drawing.Size(397, 120);
            this.groupBoxStatus.TabIndex = 6;
            this.groupBoxStatus.TabStop = false;
            this.groupBoxStatus.Text = " Status ";
            // 
            // lblDataReader
            // 
            this.lblDataReader.AutoSize = true;
            this.lblDataReader.Font = new System.Drawing.Font("Microsoft Sans Serif", 20.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblDataReader.Location = new System.Drawing.Point(243, 73);
            this.lblDataReader.Name = "lblDataReader";
            this.lblDataReader.Size = new System.Drawing.Size(115, 31);
            this.lblDataReader.TabIndex = 4;
            this.lblDataReader.Text = "Stopped";
            // 
            // lblDataReaderLabel
            // 
            this.lblDataReaderLabel.AutoSize = true;
            this.lblDataReaderLabel.Font = new System.Drawing.Font("Microsoft Sans Serif", 20.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblDataReaderLabel.Location = new System.Drawing.Point(56, 73);
            this.lblDataReaderLabel.Name = "lblDataReaderLabel";
            this.lblDataReaderLabel.Size = new System.Drawing.Size(168, 31);
            this.lblDataReaderLabel.TabIndex = 3;
            this.lblDataReaderLabel.Text = "Data Reader";
            // 
            // lblProcessMonitor
            // 
            this.lblProcessMonitor.AutoSize = true;
            this.lblProcessMonitor.Font = new System.Drawing.Font("Microsoft Sans Serif", 20.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblProcessMonitor.Location = new System.Drawing.Point(243, 25);
            this.lblProcessMonitor.Name = "lblProcessMonitor";
            this.lblProcessMonitor.Size = new System.Drawing.Size(115, 31);
            this.lblProcessMonitor.TabIndex = 2;
            this.lblProcessMonitor.Text = "Stopped";
            // 
            // lblProcessMonitorLabel
            // 
            this.lblProcessMonitorLabel.AutoSize = true;
            this.lblProcessMonitorLabel.Font = new System.Drawing.Font("Microsoft Sans Serif", 20.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblProcessMonitorLabel.Location = new System.Drawing.Point(14, 25);
            this.lblProcessMonitorLabel.Name = "lblProcessMonitorLabel";
            this.lblProcessMonitorLabel.Size = new System.Drawing.Size(210, 31);
            this.lblProcessMonitorLabel.TabIndex = 1;
            this.lblProcessMonitorLabel.Text = "Process Monitor";
            // 
            // btnExit
            // 
            this.btnExit.Location = new System.Drawing.Point(415, 285);
            this.btnExit.Name = "btnExit";
            this.btnExit.Size = new System.Drawing.Size(94, 28);
            this.btnExit.TabIndex = 7;
            this.btnExit.Text = "Exit";
            this.btnExit.UseVisualStyleBackColor = true;
            this.btnExit.Click += new System.EventHandler(this.btnExit_Click);
            // 
            // groupBoxWebServer
            // 
            this.groupBoxWebServer.Controls.Add(this.btnWebServerRestart);
            this.groupBoxWebServer.Controls.Add(this.lblWebServerStatus);
            this.groupBoxWebServer.Controls.Add(this.lblStatusLabel);
            this.groupBoxWebServer.Controls.Add(this.txtPort);
            this.groupBoxWebServer.Controls.Add(this.lblPortLabel);
            this.groupBoxWebServer.Controls.Add(this.lblIPAddress);
            this.groupBoxWebServer.Controls.Add(this.lblIPAddressLabel);
            this.groupBoxWebServer.Location = new System.Drawing.Point(12, 12);
            this.groupBoxWebServer.Name = "groupBoxWebServer";
            this.groupBoxWebServer.Size = new System.Drawing.Size(499, 166);
            this.groupBoxWebServer.TabIndex = 5;
            this.groupBoxWebServer.TabStop = false;
            this.groupBoxWebServer.Text = " Web Server ";
            // 
            // btnWebServerRestart
            // 
            this.btnWebServerRestart.Location = new System.Drawing.Point(381, 125);
            this.btnWebServerRestart.Name = "btnWebServerRestart";
            this.btnWebServerRestart.Size = new System.Drawing.Size(94, 28);
            this.btnWebServerRestart.TabIndex = 6;
            this.btnWebServerRestart.Text = "Restart";
            this.btnWebServerRestart.UseVisualStyleBackColor = true;
            this.btnWebServerRestart.Click += new System.EventHandler(this.btnWebServerRestart_Click);
            // 
            // lblWebServerStatus
            // 
            this.lblWebServerStatus.AutoSize = true;
            this.lblWebServerStatus.Font = new System.Drawing.Font("Microsoft Sans Serif", 20.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblWebServerStatus.Location = new System.Drawing.Point(179, 122);
            this.lblWebServerStatus.Name = "lblWebServerStatus";
            this.lblWebServerStatus.Size = new System.Drawing.Size(115, 31);
            this.lblWebServerStatus.TabIndex = 5;
            this.lblWebServerStatus.Text = "Stopped";
            // 
            // lblStatusLabel
            // 
            this.lblStatusLabel.AutoSize = true;
            this.lblStatusLabel.Font = new System.Drawing.Font("Microsoft Sans Serif", 20.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblStatusLabel.Location = new System.Drawing.Point(69, 122);
            this.lblStatusLabel.Name = "lblStatusLabel";
            this.lblStatusLabel.Size = new System.Drawing.Size(92, 31);
            this.lblStatusLabel.TabIndex = 4;
            this.lblStatusLabel.Text = "Status";
            // 
            // txtPort
            // 
            this.txtPort.Font = new System.Drawing.Font("Microsoft Sans Serif", 20.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.txtPort.Location = new System.Drawing.Point(184, 72);
            this.txtPort.Name = "txtPort";
            this.txtPort.Size = new System.Drawing.Size(82, 38);
            this.txtPort.TabIndex = 3;
            this.txtPort.TabStop = false;
            this.txtPort.TextChanged += new System.EventHandler(this.txtPort_TextChanged);
            // 
            // lblPortLabel
            // 
            this.lblPortLabel.AutoSize = true;
            this.lblPortLabel.Font = new System.Drawing.Font("Microsoft Sans Serif", 20.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblPortLabel.Location = new System.Drawing.Point(97, 71);
            this.lblPortLabel.Name = "lblPortLabel";
            this.lblPortLabel.Size = new System.Drawing.Size(64, 31);
            this.lblPortLabel.TabIndex = 2;
            this.lblPortLabel.Text = "Port";
            // 
            // lblIPAddress
            // 
            this.lblIPAddress.AutoSize = true;
            this.lblIPAddress.Font = new System.Drawing.Font("Microsoft Sans Serif", 20.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblIPAddress.Location = new System.Drawing.Point(179, 26);
            this.lblIPAddress.Name = "lblIPAddress";
            this.lblIPAddress.Size = new System.Drawing.Size(218, 31);
            this.lblIPAddress.TabIndex = 1;
            this.lblIPAddress.Text = "999.999.999.999";
            // 
            // lblIPAddressLabel
            // 
            this.lblIPAddressLabel.AutoSize = true;
            this.lblIPAddressLabel.Font = new System.Drawing.Font("Microsoft Sans Serif", 20.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblIPAddressLabel.Location = new System.Drawing.Point(14, 26);
            this.lblIPAddressLabel.Name = "lblIPAddressLabel";
            this.lblIPAddressLabel.Size = new System.Drawing.Size(147, 31);
            this.lblIPAddressLabel.TabIndex = 0;
            this.lblIPAddressLabel.Text = "IP Address";
            // 
            // FormMain
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(525, 347);
            this.Controls.Add(this.groupBoxStatus);
            this.Controls.Add(this.btnExit);
            this.Controls.Add(this.groupBoxWebServer);
            this.Controls.Add(this.statusStrip);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.Name = "FormMain";
            this.SizeGripStyle = System.Windows.Forms.SizeGripStyle.Hide;
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "AG Racing Data Manager";
            this.FormClosed += new System.Windows.Forms.FormClosedEventHandler(this.Form1_FormClosed);
            this.statusStrip.ResumeLayout(false);
            this.statusStrip.PerformLayout();
            this.groupBoxStatus.ResumeLayout(false);
            this.groupBoxStatus.PerformLayout();
            this.groupBoxWebServer.ResumeLayout(false);
            this.groupBoxWebServer.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.StatusStrip statusStrip;
        private System.Windows.Forms.ToolStripStatusLabel gameConnectionState;
        private System.Windows.Forms.GroupBox groupBoxStatus;
        private System.Windows.Forms.Label lblDataReader;
        private System.Windows.Forms.Label lblDataReaderLabel;
        private System.Windows.Forms.Label lblProcessMonitor;
        private System.Windows.Forms.Label lblProcessMonitorLabel;
        private System.Windows.Forms.Button btnExit;
        private System.Windows.Forms.GroupBox groupBoxWebServer;
        private System.Windows.Forms.Button btnWebServerRestart;
        private System.Windows.Forms.Label lblWebServerStatus;
        private System.Windows.Forms.Label lblStatusLabel;
        private System.Windows.Forms.TextBox txtPort;
        private System.Windows.Forms.Label lblPortLabel;
        private System.Windows.Forms.Label lblIPAddress;
        private System.Windows.Forms.Label lblIPAddressLabel;
    }
}


using System;

using Microsoft.SPOT;
using Microsoft.SPOT.Hardware;

using GHI.Glide;
using GHI.Glide.Geom;
using GHI.Glide.UI;

using Gadgeteer.Modules.GHIElectronics;

using Gadgeteer;

namespace AgRacing
{
    public partial class Program
    {
        static GHI.Glide.Display.Window mainWindow;

        // This method is run when the mainboard is powered up or reset.   
        void ProgramStarted()
        {
            /*******************************************************************************************
            Modules added in the Program.gadgeteer designer view are used by typing 
            their name followed by a period, e.g.  button.  or  camera.
            
            Many modules generate useful events. Type +=<tab><tab> to add a handler to an event, e.g.:
                button.ButtonPressed +=<tab><tab>
            
            If you want to do something periodically, use a GT.Timer and handle its Tick event, e.g.:
                GT.Timer timer = new GT.Timer(1000); // every second (1000ms)
                timer.Tick +=<tab><tab>
                timer.Start();
            *******************************************************************************************/


            // Use Debug.Print to show messages in Visual Studio's "Output" window during debugging.
            Debug.Print("Program Started");

            mainWindow = GlideLoader.LoadWindow(Resources.GetString(Resources.StringResources.mainWindow));
            Glide.MainWindow = mainWindow;
        }
    }
}

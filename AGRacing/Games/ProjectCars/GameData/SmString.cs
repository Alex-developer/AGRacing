#region



#endregion

namespace AGRacing.ProjectCars.GameData
{
    using System.Runtime.InteropServices;

    public struct SmString
    {
        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = (int) EStringLenMax.StringLengthMax)] public string Value;
    }
}
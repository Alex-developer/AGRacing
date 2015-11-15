namespace AGRacing.ProjectCars.GameData
{
    public enum ECarFlags
    {
        CarAbs = (1 << 4),
        CarEngineActive = (1 << 1),
        CarEngineWarning = (1 << 2),
        CarHandbrake = (1 << 5),
        CarHeadlight = (1 << 0),
        CarSpeedLimiter = (1 << 3),
    }
}
namespace TruckStopIntegration.Models;

/// <summary>
/// API request model for our proxy endpoint
/// </summary>
public class LoadSearchApiRequest
{
    public string IntegrationId { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public LoadSearchCriteria? Criteria { get; set; }
}

public class LoadSearchCriteria
{
    public Location? Origin { get; set; }
    public List<Location>? Destinations { get; set; }
    public string? EquipmentType { get; set; }
    public List<string>? EquipmentOptions { get; set; }
    public string? LoadType { get; set; }
    public int? AgeFilter { get; set; }
    public List<DateTime>? PickupDates { get; set; }
    public int? PageNumber { get; set; }
    public int? PageSize { get; set; }
    public string? SortColumn { get; set; }
    public string? SortDirection { get; set; }
}

public class Location
{
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Country { get; set; }
    public int? Range { get; set; }
}

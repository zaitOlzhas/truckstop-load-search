namespace TruckStopIntegration.Models;

/// <summary>
/// Response model from TruckStop API
/// </summary>
public class MultipleLoadDetailReturn
{
    public LoadDetail[]? Loads { get; set; }
    public string? ErrorMessage { get; set; }
    public bool HasError { get; set; }
    public int TotalResults { get; set; }
}

public class LoadDetail
{
    public string? LoadId { get; set; }
    public DateTime? PickupDate { get; set; }
    public DateTime? DeliveryDate { get; set; }
    public string? OriginCity { get; set; }
    public string? OriginState { get; set; }
    public string? DestinationCity { get; set; }
    public string? DestinationState { get; set; }
    public string? EquipmentType { get; set; }
    public decimal? Payment { get; set; }
    public int? Miles { get; set; }
    public string? CompanyName { get; set; }
    public string? ContactPhone { get; set; }
    public decimal? Weight { get; set; }
    public string? Comments { get; set; }
}

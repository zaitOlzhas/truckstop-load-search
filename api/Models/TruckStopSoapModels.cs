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
    public string? ID { get; set; }
    public string? Age { get; set; }
    public decimal? Bond { get; set; }
    public string? BondTypeID { get; set; }
    public string? Credit { get; set; }
    public string? DOTNumber { get; set; }
    public int? DeletedId { get; set; }
    public string? DeliveryDate { get; set; }
    public string? DeliveryTime { get; set; }
    public string? DestinationCity { get; set; }
    public string? DestinationCountry { get; set; }
    public int? DestinationDistance { get; set; }
    public string? DestinationState { get; set; }
    public string? DestinationZip { get; set; }
    public int? Distance { get; set; }
    public DateTime? Entered { get; set; }
    public string? Equipment { get; set; }
    public List<string>? EquipmentOptions { get; set; }
    public EquipmentType? EquipmentTypes { get; set; }
    public string? ExperienceFactor { get; set; }
    public decimal? FuelCost { get; set; }
    public string? HandleName { get; set; }
    public bool? HasBonding { get; set; }
    public bool? IsDeleted { get; set; }
    public bool? IsFriend { get; set; }
    public decimal? Length { get; set; }
    public string? LoadType { get; set; }
    public string? MCNumber { get; set; }
    public int? Mileage { get; set; }
    public string? OriginCity { get; set; }
    public string? OriginCountry { get; set; }
    public int? OriginDistance { get; set; }
    public string? OriginState { get; set; }
    public string? OriginZip { get; set; }
    public decimal? PaymentAmount { get; set; }
    public string? PickupDate { get; set; }
    public string? PickupTime { get; set; }
    public string? PointOfContact { get; set; }
    public string? PointOfContactPhone { get; set; }
    public decimal? PricePerGallon { get; set; }
    public int? Quantity { get; set; }
    public string? SpecInfo { get; set; }
    public int? Stops { get; set; }
    public string? TMCNumber { get; set; }
    public string? TruckCompanyCity { get; set; }
    public string? TruckCompanyEmail { get; set; }
    public string? TruckCompanyFax { get; set; }
    public int? TruckCompanyId { get; set; }
    public string? TruckCompanyName { get; set; }
    public string? TruckCompanyPhone { get; set; }
    public string? TruckCompanyState { get; set; }
    public decimal? Weight { get; set; }
    public decimal? Width { get; set; }
}

public class EquipmentType
{
    public string? Category { get; set; }
    public int? CategoryId { get; set; }
    public string? Code { get; set; }
    public string? Description { get; set; }
    public bool? FullLoad { get; set; }
    public int? Id { get; set; }
    public bool? IsCategorizable { get; set; }
    public bool? IsCombo { get; set; }
    public bool? IsTruckPost { get; set; }
    public int? MapToId { get; set; }
    public string? RequiredOption { get; set; }
    public bool? WebserviceOnly { get; set; }
}

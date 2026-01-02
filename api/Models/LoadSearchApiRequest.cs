using System.ComponentModel.DataAnnotations;

namespace TruckStopIntegration.Models;

/// <summary>
/// API request model for our proxy endpoint
/// Aligned with TruckStop SOAP API specification
/// </summary>
public class LoadSearchApiRequest
{
    [Required]
    public string IntegrationId { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;

    [Required]
    public string UserName { get; set; } = string.Empty;

    public LoadSearchCriteria? Criteria { get; set; }
}

/// <summary>
/// Search criteria aligned with TruckStop SOAP API specification
/// Reference: https://developer.truckstop.com/reference/get-load-search-results-1
/// </summary>
public class LoadSearchCriteria
{
    // Origin fields (Origin is required per SOAP API)
    [Required]
    public string OriginState { get; set; } = string.Empty; // Required, supports comma-separated (max 15)

    public string? OriginCity { get; set; }
    public string? OriginCountry { get; set; }
    public int? OriginLatitude { get; set; }
    public int? OriginLongitude { get; set; }
    public int? OriginRange { get; set; }

    // Destination fields (all optional)
    public string? DestinationState { get; set; } // Supports comma-separated (max 15)
    public string? DestinationCity { get; set; }
    public string? DestinationCountry { get; set; }
    public int? DestinationRange { get; set; }

    // Equipment and load details (all optional)
    public List<string>? EquipmentType { get; set; } // Supports multiple equipment types
    public string? LoadType { get; set; }

    // Search parameters (all optional)
    public int? HoursOld { get; set; }
    public List<DateTime>? PickupDates { get; set; }

    // Pagination (all optional)
    public int? PageNumber { get; set; }
    public int? PageSize { get; set; }

    // Sorting (optional)
    public string? SortBy { get; set; }
    public bool? SortDescending { get; set; }
}

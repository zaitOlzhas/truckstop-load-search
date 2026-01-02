using System.Text;
using System.Xml.Linq;
using Microsoft.Extensions.Configuration;
using TruckStopIntegration.Models;

namespace TruckStopIntegration.Services;

public class TruckStopService
{
    private readonly string _serviceUrl;
    private const string SoapAction = "http://webservices.truckstop.com/v12/ILoadSearch/GetMultipleLoadDetailResults";
    private const string Namespace = "http://webservices.truckstop.com/v12";
    private readonly HttpClient _httpClient;

    public TruckStopService(IHttpClientFactory httpClientFactory, IConfiguration configuration)
    {
        _httpClient = httpClientFactory.CreateClient();
        _serviceUrl = configuration["TruckStop:ApiUrl"]
            ?? throw new InvalidOperationException("TruckStop:ApiUrl configuration is missing");
    }

    public async Task<MultipleLoadDetailReturn> GetMultipleLoadDetailResults(LoadSearchApiRequest apiRequest)
    {
        string? soapRequest = null;
        string? soapResponse = null;

        try
        {
            soapRequest = BuildSoapEnvelope(apiRequest);
            Console.WriteLine("=== SOAP REQUEST ===");
            Console.WriteLine(soapRequest);
            Console.WriteLine("====================");

            var content = new StringContent(soapRequest, Encoding.UTF8, "text/xml");
            content.Headers.Add("SOAPAction", SoapAction);

            var response = await _httpClient.PostAsync(_serviceUrl, content);
            soapResponse = await response.Content.ReadAsStringAsync();

            Console.WriteLine("=== SOAP RESPONSE ===");
            Console.WriteLine($"Status: {response.StatusCode}");
            Console.WriteLine(soapResponse);
            Console.WriteLine("=====================");

            if (!response.IsSuccessStatusCode)
            {
                if (soapResponse.Contains("s:Fault"))
                {
                    var faultMessage = ExtractSoapFault(soapResponse);
                    return new MultipleLoadDetailReturn
                    {
                        HasError = true,
                        ErrorMessage = faultMessage
                    };
                }
                return new MultipleLoadDetailReturn
                {
                    HasError = true,
                    ErrorMessage = $"Error from TruckStop API: {response.StatusCode}, {soapResponse}"
                };
            }
            return ParseSoapResponse(soapResponse);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Exception: {ex}");

            return new MultipleLoadDetailReturn
            {
                HasError = true,
                ErrorMessage = $"Error communicating with TruckStop API: {ex.Message}"
            };
        }
    }

    private string ExtractSoapFault(string soapXml)
    {
        try
        {
            var doc = XDocument.Parse(soapXml);
            var soapNs = doc.Root?.GetNamespaceOfPrefix("soap") ?? doc.Root?.GetNamespaceOfPrefix("s");

            if (soapNs != null)
            {
                var fault = doc.Descendants(soapNs + "Fault").FirstOrDefault();
                if (fault != null)
                {
                    var faultCode = fault.Element("faultcode")?.Value ?? "Unknown";
                    var faultString = fault.Element("faultstring")?.Value ?? "TruckStop API returned an error";

                    // Return structured error message with both code and string
                    return $"SOAP Fault [{faultCode}]: {faultString}";
                }
            }

            return "TruckStop API returned an error";
        }
        catch
        {
            return "TruckStop API returned an error";
        }
    }

    private string BuildSoapEnvelope(LoadSearchApiRequest request)
    {
        var v12 = XNamespace.Get("http://webservices.truckstop.com/v12");
        var web = XNamespace.Get("http://schemas.datacontract.org/2004/07/WebServices");
        var web1 = XNamespace.Get("http://schemas.datacontract.org/2004/07/WebServices.Searching");
        var truc = XNamespace.Get("http://schemas.datacontract.org/2004/07/Truckstop2.Objects");
        var soap = XNamespace.Get("http://schemas.xmlsoap.org/soap/envelope/");

        var searchRequest = new XElement(v12 + "searchRequest",
            new XElement(web + "IntegrationId", request.IntegrationId),
            new XElement(web + "Password", request.Password),
            new XElement(web + "UserName", request.UserName));

        if (request.Criteria != null)
        {
            var criteria = BuildCriteriaElement(request.Criteria, web1, truc);
            searchRequest.Add(criteria);
        }

        var envelope = new XElement(soap + "Envelope",
            new XAttribute(XNamespace.Xmlns + "soapenv", soap),
            new XAttribute(XNamespace.Xmlns + "v12", v12),
            new XAttribute(XNamespace.Xmlns + "web", web),
            new XAttribute(XNamespace.Xmlns + "web1", web1),
            new XAttribute(XNamespace.Xmlns + "truc", truc),
            new XElement(soap + "Header"),
            new XElement(soap + "Body",
                new XElement(v12 + "GetMultipleLoadDetailResults",
                    searchRequest)));

        return envelope.ToString();
    }

    private XElement BuildCriteriaElement(LoadSearchCriteria criteria, XNamespace web1, XNamespace truc)
    {
        var criteriaElement = new XElement(web1 + "Criteria");

        // IMPORTANT: Elements must be in ALPHABETICAL ORDER for SOAP/WCF deserialization
        // Reference: https://developer.truckstop.com/reference/get-load-search-results-1

        // DestinationCity (optional)
        if (!string.IsNullOrWhiteSpace(criteria.DestinationCity))
            criteriaElement.Add(new XElement(web1 + "DestinationCity", criteria.DestinationCity));

        // DestinationCountry (optional)
        if (!string.IsNullOrWhiteSpace(criteria.DestinationCountry))
            criteriaElement.Add(new XElement(web1 + "DestinationCountry", criteria.DestinationCountry));

        // DestinationRange (optional)
        if (criteria.DestinationRange.HasValue)
            criteriaElement.Add(new XElement(web1 + "DestinationRange", criteria.DestinationRange.Value));

        // DestinationState (optional, supports comma-separated)
        if (!string.IsNullOrWhiteSpace(criteria.DestinationState))
            criteriaElement.Add(new XElement(web1 + "DestinationState", criteria.DestinationState));

        // EquipmentType (optional, supports comma-separated)
        if (criteria.EquipmentType?.Any() == true)
        {
            var equipmentTypeValue = string.Join(",", criteria.EquipmentType);
            criteriaElement.Add(new XElement(web1 + "EquipmentType", equipmentTypeValue));
        }

        // HoursOld (optional)
        if (criteria.HoursOld.HasValue)
            criteriaElement.Add(new XElement(web1 + "HoursOld", criteria.HoursOld.Value));

        // LoadType (optional)
        if (!string.IsNullOrWhiteSpace(criteria.LoadType))
            criteriaElement.Add(new XElement(web1 + "LoadType", criteria.LoadType));

        // OriginCity (optional)
        if (!string.IsNullOrWhiteSpace(criteria.OriginCity))
            criteriaElement.Add(new XElement(web1 + "OriginCity", criteria.OriginCity));

        // OriginCountry (optional)
        if (!string.IsNullOrWhiteSpace(criteria.OriginCountry))
            criteriaElement.Add(new XElement(web1 + "OriginCountry", criteria.OriginCountry));

        // OriginLatitude (optional)
        if (criteria.OriginLatitude.HasValue)
            criteriaElement.Add(new XElement(web1 + "OriginLatitude", criteria.OriginLatitude.Value));

        // OriginLongitude (optional)
        if (criteria.OriginLongitude.HasValue)
            criteriaElement.Add(new XElement(web1 + "OriginLongitude", criteria.OriginLongitude.Value));

        // OriginRange (optional)
        if (criteria.OriginRange.HasValue)
            criteriaElement.Add(new XElement(web1 + "OriginRange", criteria.OriginRange.Value));

        // OriginState (REQUIRED, supports comma-separated)
        criteriaElement.Add(new XElement(web1 + "OriginState", criteria.OriginState));

        // PageNumber (optional)
        if (criteria.PageNumber.HasValue)
            criteriaElement.Add(new XElement(web1 + "PageNumber", criteria.PageNumber.Value));

        // PageSize (optional)
        if (criteria.PageSize.HasValue)
            criteriaElement.Add(new XElement(web1 + "PageSize", criteria.PageSize.Value));

        // PickupDates (optional array)
        if (criteria.PickupDates?.Any() == true)
        {
            foreach (var date in criteria.PickupDates)
            {
                criteriaElement.Add(new XElement(web1 + "PickupDates", date.ToString("yyyy-MM-ddTHH:mm:ss")));
            }
        }

        // SortBy (optional)
        if (!string.IsNullOrWhiteSpace(criteria.SortBy))
            criteriaElement.Add(new XElement(web1 + "SortBy", criteria.SortBy));

        // SortDescending (optional)
        if (criteria.SortDescending.HasValue)
            criteriaElement.Add(new XElement(web1 + "SortDescending", criteria.SortDescending.Value.ToString().ToLower()));

        return criteriaElement;
    }

    private MultipleLoadDetailReturn ParseSoapResponse(string xml)
    {
        try
        {
            var doc = XDocument.Parse(xml);
            var ns = XNamespace.Get(Namespace);
            var a = XNamespace.Get("http://schemas.datacontract.org/2004/07/WebServices.Objects");

            var resultElement = doc.Descendants(ns + "GetMultipleLoadDetailResultsResult").FirstOrDefault();
            if (resultElement == null)
            {
                Console.WriteLine($"Could not find result element in response");
                return new MultipleLoadDetailReturn
                {
                    HasError = true,
                    ErrorMessage = "Invalid response from TruckStop API"
                };
            }

            // Check for errors
            var errorsElement = resultElement.Element("Errors");
            if (errorsElement?.HasElements == true)
            {
                var errorMessage = errorsElement.Elements().FirstOrDefault()?.Value;
                return new MultipleLoadDetailReturn
                {
                    HasError = true,
                    ErrorMessage = errorMessage ?? "TruckStop API returned an error"
                };
            }

            // Parse loads from DetailResults
            var detailResults = resultElement.Element(a + "DetailResults");
            if (detailResults == null)
            {
                return new MultipleLoadDetailReturn
                {
                    Loads = Array.Empty<LoadDetail>(),
                    HasError = false,
                    TotalResults = 0
                };
            }

            var loads = detailResults.Elements(a + "MultipleLoadDetailResult")
                .Select(load =>
                {
                    var b = XNamespace.Get("http://schemas.datacontract.org/2004/07/Truckstop2.Objects");

                    // Parse EquipmentOptions
                    var equipmentOptionsElement = load.Element(a + "EquipmentOptions");
                    var equipmentOptions = equipmentOptionsElement?.Elements(b + "TrailerOptionType")
                        .Select(e => e.Value)
                        .ToList();

                    // Parse EquipmentTypes
                    var equipmentTypesElement = load.Element(a + "EquipmentTypes");
                    EquipmentType? equipmentTypes = null;
                    if (equipmentTypesElement != null)
                    {
                        equipmentTypes = new EquipmentType
                        {
                            Category = equipmentTypesElement.Element(b + "Category")?.Value,
                            CategoryId = ParseInt(equipmentTypesElement.Element(b + "CategoryId")?.Value),
                            Code = equipmentTypesElement.Element(b + "Code")?.Value,
                            Description = equipmentTypesElement.Element(b + "Description")?.Value,
                            FullLoad = ParseBool(equipmentTypesElement.Element(b + "FullLoad")?.Value),
                            Id = ParseInt(equipmentTypesElement.Element(b + "Id")?.Value),
                            IsCategorizable = ParseBool(equipmentTypesElement.Element(b + "IsCategorizable")?.Value),
                            IsCombo = ParseBool(equipmentTypesElement.Element(b + "IsCombo")?.Value),
                            IsTruckPost = ParseBool(equipmentTypesElement.Element(b + "IsTruckPost")?.Value),
                            MapToId = ParseInt(equipmentTypesElement.Element(b + "MapToId")?.Value),
                            RequiredOption = equipmentTypesElement.Element(b + "RequiredOption")?.Value,
                            WebserviceOnly = ParseBool(equipmentTypesElement.Element(b + "WebserviceOnly")?.Value)
                        };
                    }

                    return new LoadDetail
                    {
                        ID = load.Element(a + "ID")?.Value,
                        Age = load.Element(a + "Age")?.Value,
                        Bond = ParseDecimal(load.Element(a + "Bond")?.Value),
                        BondTypeID = load.Element(a + "BondTypeID")?.Value,
                        Credit = load.Element(a + "Credit")?.Value,
                        DOTNumber = load.Element(a + "DOTNumber")?.Value,
                        DeletedId = ParseInt(load.Element(a + "DeletedId")?.Value),
                        DeliveryDate = load.Element(a + "DeliveryDate")?.Value,
                        DeliveryTime = load.Element(a + "DeliveryTime")?.Value,
                        DestinationCity = load.Element(a + "DestinationCity")?.Value,
                        DestinationCountry = load.Element(a + "DestinationCountry")?.Value,
                        DestinationDistance = ParseInt(load.Element(a + "DestinationDistance")?.Value),
                        DestinationState = load.Element(a + "DestinationState")?.Value,
                        DestinationZip = load.Element(a + "DestinationZip")?.Value,
                        Distance = ParseInt(load.Element(a + "Distance")?.Value),
                        Entered = ParseDateTime(load.Element(a + "Entered")?.Value),
                        Equipment = load.Element(a + "Equipment")?.Value,
                        EquipmentOptions = equipmentOptions,
                        EquipmentTypes = equipmentTypes,
                        ExperienceFactor = load.Element(a + "ExperienceFactor")?.Value,
                        FuelCost = ParseDecimal(load.Element(a + "FuelCost")?.Value),
                        HandleName = load.Element(a + "HandleName")?.Value,
                        HasBonding = ParseBool(load.Element(a + "HasBonding")?.Value),
                        IsDeleted = ParseBool(load.Element(a + "IsDeleted")?.Value),
                        IsFriend = ParseBool(load.Element(a + "IsFriend")?.Value),
                        Length = ParseDecimal(load.Element(a + "Length")?.Value),
                        LoadType = load.Element(a + "LoadType")?.Value,
                        MCNumber = load.Element(a + "MCNumber")?.Value,
                        Mileage = ParseInt(load.Element(a + "Mileage")?.Value),
                        OriginCity = load.Element(a + "OriginCity")?.Value,
                        OriginCountry = load.Element(a + "OriginCountry")?.Value,
                        OriginDistance = ParseInt(load.Element(a + "OriginDistance")?.Value),
                        OriginState = load.Element(a + "OriginState")?.Value,
                        OriginZip = load.Element(a + "OriginZip")?.Value,
                        PaymentAmount = ParseDecimal(load.Element(a + "PaymentAmount")?.Value),
                        PickupDate = load.Element(a + "PickupDate")?.Value,
                        PickupTime = load.Element(a + "PickupTime")?.Value,
                        PointOfContact = load.Element(a + "PointOfContact")?.Value,
                        PointOfContactPhone = load.Element(a + "PointOfContactPhone")?.Value,
                        PricePerGallon = ParseDecimal(load.Element(a + "PricePerGallon")?.Value),
                        Quantity = ParseInt(load.Element(a + "Quantity")?.Value),
                        SpecInfo = load.Element(a + "SpecInfo")?.Value,
                        Stops = ParseInt(load.Element(a + "Stops")?.Value),
                        TMCNumber = load.Element(a + "TMCNumber")?.Value,
                        TruckCompanyCity = load.Element(a + "TruckCompanyCity")?.Value,
                        TruckCompanyEmail = load.Element(a + "TruckCompanyEmail")?.Value,
                        TruckCompanyFax = load.Element(a + "TruckCompanyFax")?.Value,
                        TruckCompanyId = ParseInt(load.Element(a + "TruckCompanyId")?.Value),
                        TruckCompanyName = load.Element(a + "TruckCompanyName")?.Value,
                        TruckCompanyPhone = load.Element(a + "TruckCompanyPhone")?.Value,
                        TruckCompanyState = load.Element(a + "TruckCompanyState")?.Value,
                        Weight = ParseDecimal(load.Element(a + "Weight")?.Value),
                        Width = ParseDecimal(load.Element(a + "Width")?.Value)
                    };
                })
                .ToArray();

            return new MultipleLoadDetailReturn
            {
                Loads = loads,
                HasError = false,
                TotalResults = loads.Length
            };
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to parse response: {ex}");
            return new MultipleLoadDetailReturn
            {
                HasError = true,
                ErrorMessage = "Failed to process TruckStop API response"
            };
        }
    }

    private DateTime? ParseDateTime(string? value) =>
        DateTime.TryParse(value, out var result) ? result : null;

    private decimal? ParseDecimal(string? value) =>
        decimal.TryParse(value, out var result) ? result : null;

    private int? ParseInt(string? value) =>
        int.TryParse(value, out var result) ? result : null;

    private bool? ParseBool(string? value) =>
        bool.TryParse(value, out var result) ? result : null;
}

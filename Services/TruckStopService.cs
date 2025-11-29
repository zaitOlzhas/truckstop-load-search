using System.Text;
using System.Xml.Linq;
using TruckStopIntegration.Models;

namespace TruckStopIntegration.Services;

public class TruckStopService
{
    private const string ServiceUrl = "https://api.truckstop.com/v13/Searching/LoadSearch.svc";
    private const string SoapAction = "http://webservices.truckstop.com/v12/ILoadSearch/GetMultipleLoadDetailResults";
    private const string Namespace = "http://webservices.truckstop.com/v12";
    private readonly HttpClient _httpClient;

    public TruckStopService(IHttpClientFactory httpClientFactory)
    {
        _httpClient = httpClientFactory.CreateClient();
    }

    public async Task<MultipleLoadDetailReturn> GetMultipleLoadDetailResults(LoadSearchApiRequest apiRequest)
    {
        try
        {
            var soapEnvelope = BuildSoapEnvelope(apiRequest);
            var content = new StringContent(soapEnvelope, Encoding.UTF8, "text/xml");
            content.Headers.Add("SOAPAction", SoapAction);

            var response = await _httpClient.PostAsync(ServiceUrl, content);
            var responseContent = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                return new MultipleLoadDetailReturn
                {
                    HasError = true,
                    ErrorMessage = $"HTTP {response.StatusCode}: {responseContent}"
                };
            }

            return ParseSoapResponse(responseContent);
        }
        catch (Exception ex)
        {
            return new MultipleLoadDetailReturn
            {
                HasError = true,
                ErrorMessage = $"Error: {ex.Message}"
            };
        }
    }

    private string BuildSoapEnvelope(LoadSearchApiRequest request)
    {
        var ns = XNamespace.Get(Namespace);
        var soap = XNamespace.Get("http://schemas.xmlsoap.org/soap/envelope/");

        var envelope = new XElement(soap + "Envelope",
            new XAttribute(XNamespace.Xmlns + "soap", soap),
            new XAttribute(XNamespace.Xmlns + "ns", ns),
            new XElement(soap + "Body",
                new XElement(ns + "GetMultipleLoadDetailResults",
                    new XElement(ns + "request",
                        new XElement(ns + "IntegrationId", request.IntegrationId),
                        new XElement(ns + "Password", request.Password),
                        new XElement(ns + "UserName", request.UserName),
                        BuildCriteriaElement(request.Criteria, ns)))));

        return envelope.ToString();
    }

    private XElement? BuildCriteriaElement(LoadSearchCriteria? criteria, XNamespace ns)
    {
        if (criteria == null)
            return null;

        var criteriaElement = new XElement(ns + "Criteria");

        // Per requirement: don't send null parameters
        if (criteria.Origin != null)
            criteriaElement.Add(BuildLocationElement(criteria.Origin, "Origin", ns));

        if (criteria.Destinations?.Any() == true)
        {
            foreach (var dest in criteria.Destinations.Where(d => d != null))
            {
                criteriaElement.Add(BuildLocationElement(dest, "Destinations", ns));
            }
        }

        if (!string.IsNullOrEmpty(criteria.EquipmentType))
            criteriaElement.Add(new XElement(ns + "EquipmentType", criteria.EquipmentType));

        if (criteria.EquipmentOptions?.Any() == true)
        {
            foreach (var option in criteria.EquipmentOptions)
            {
                criteriaElement.Add(new XElement(ns + "EquipmentOptions", option));
            }
        }

        if (!string.IsNullOrEmpty(criteria.LoadType))
            criteriaElement.Add(new XElement(ns + "LoadType", criteria.LoadType));

        if (criteria.AgeFilter.HasValue)
            criteriaElement.Add(new XElement(ns + "AgeFilter", criteria.AgeFilter.Value));

        if (criteria.PickupDates?.Any() == true)
        {
            foreach (var date in criteria.PickupDates)
            {
                criteriaElement.Add(new XElement(ns + "PickupDates", date.ToString("yyyy-MM-ddTHH:mm:ss")));
            }
        }

        if (criteria.PageNumber.HasValue)
            criteriaElement.Add(new XElement(ns + "PageNumber", criteria.PageNumber.Value));

        if (criteria.PageSize.HasValue)
            criteriaElement.Add(new XElement(ns + "PageSize", criteria.PageSize.Value));

        if (!string.IsNullOrEmpty(criteria.SortColumn))
            criteriaElement.Add(new XElement(ns + "SortColumn", criteria.SortColumn));

        if (!string.IsNullOrEmpty(criteria.SortDirection))
            criteriaElement.Add(new XElement(ns + "SortDirection", criteria.SortDirection));

        return criteriaElement;
    }

    private XElement? BuildLocationElement(Location? location, string elementName, XNamespace ns)
    {
        if (location == null)
            return null;

        // Per requirement: if destination is filled, country, state, city and range is required
        if (string.IsNullOrWhiteSpace(location.City) &&
            string.IsNullOrWhiteSpace(location.State) &&
            string.IsNullOrWhiteSpace(location.Country))
            return null;

        var locationElement = new XElement(ns + elementName);

        if (!string.IsNullOrWhiteSpace(location.City))
            locationElement.Add(new XElement(ns + "City", location.City));

        if (!string.IsNullOrWhiteSpace(location.State))
            locationElement.Add(new XElement(ns + "State", location.State));

        if (!string.IsNullOrWhiteSpace(location.Country))
            locationElement.Add(new XElement(ns + "Country", location.Country));

        if (location.Range.HasValue)
            locationElement.Add(new XElement(ns + "Range", location.Range.Value));

        return locationElement;
    }

    private MultipleLoadDetailReturn ParseSoapResponse(string xml)
    {
        try
        {
            var doc = XDocument.Parse(xml);
            var ns = XNamespace.Get(Namespace);
            var soap = XNamespace.Get("http://schemas.xmlsoap.org/soap/envelope/");

            var resultElement = doc.Descendants(ns + "GetMultipleLoadDetailResultsResult").FirstOrDefault();
            if (resultElement == null)
            {
                return new MultipleLoadDetailReturn
                {
                    HasError = true,
                    ErrorMessage = "Invalid SOAP response"
                };
            }

            var hasError = bool.Parse(resultElement.Element(ns + "HasError")?.Value ?? "false");
            var errorMessage = resultElement.Element(ns + "ErrorMessage")?.Value;

            if (hasError)
            {
                return new MultipleLoadDetailReturn
                {
                    HasError = true,
                    ErrorMessage = errorMessage
                };
            }

            var loads = resultElement.Elements(ns + "Loads")
                .Select(load => new LoadDetail
                {
                    LoadId = load.Element(ns + "LoadId")?.Value,
                    PickupDate = ParseDateTime(load.Element(ns + "PickupDate")?.Value),
                    DeliveryDate = ParseDateTime(load.Element(ns + "DeliveryDate")?.Value),
                    OriginCity = load.Element(ns + "OriginCity")?.Value,
                    OriginState = load.Element(ns + "OriginState")?.Value,
                    DestinationCity = load.Element(ns + "DestinationCity")?.Value,
                    DestinationState = load.Element(ns + "DestinationState")?.Value,
                    EquipmentType = load.Element(ns + "EquipmentType")?.Value,
                    Payment = ParseDecimal(load.Element(ns + "Payment")?.Value),
                    Miles = ParseInt(load.Element(ns + "Miles")?.Value),
                    CompanyName = load.Element(ns + "CompanyName")?.Value,
                    ContactPhone = load.Element(ns + "ContactPhone")?.Value,
                    Weight = ParseDecimal(load.Element(ns + "Weight")?.Value),
                    Comments = load.Element(ns + "Comments")?.Value
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
            return new MultipleLoadDetailReturn
            {
                HasError = true,
                ErrorMessage = $"Failed to parse response: {ex.Message}"
            };
        }
    }

    private DateTime? ParseDateTime(string? value) =>
        DateTime.TryParse(value, out var result) ? result : null;

    private decimal? ParseDecimal(string? value) =>
        decimal.TryParse(value, out var result) ? result : null;

    private int? ParseInt(string? value) =>
        int.TryParse(value, out var result) ? result : null;
}

soap action info https://developer.truckstop.com/reference/get-multiple-load-detail-results
create an endpoint that acts as a proxy to GetMultipleLoadDetailResults soap action.
classes and enums https://developer.truckstop.com/reference/load-search-data-classes

IntegrationId, Password, UserName are passed as a json parameter to our api.
create a test request and response in http file, use values given on an example.

1) destinations may have multiple destinations
2) destination should be filled like country, state, city and range is required when destination is filled.
3) if values a null do not send them as a null parameter, just dont mention them in request.
4) if truckstop gives an error pass it to api response.

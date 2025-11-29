using TruckStopIntegration.Models;
using TruckStopIntegration.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddOpenApi();
builder.Services.AddHttpClient();
builder.Services.AddSingleton<TruckStopService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapPost("/api/truckstop/load-search", async (LoadSearchApiRequest request, TruckStopService service) =>
{
    var result = await service.GetMultipleLoadDetailResults(request);

    // Pass through TruckStop errors as specified in requirements
    if (result.HasError)
    {
        return Results.BadRequest(new { error = result.ErrorMessage });
    }

    return Results.Ok(result);
})
.WithName("GetMultipleLoadDetailResults")
.WithOpenApi();

app.Run();

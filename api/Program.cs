using TruckStopIntegration.Models;
using TruckStopIntegration.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddOpenApi();
builder.Services.AddHttpClient();
builder.Services.AddSingleton<TruckStopService>();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://127.0.0.1:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Use CORS
app.UseCors("AllowFrontend");

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

using API.Middlewares;
using API.Middlewares.CustomPolicy;
using Application.Extensions;
using Infrastructure.Extensions;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplicationExtension(builder.Configuration);

builder.Services.AddSingleton<IAuthorizationHandler, SameUserOrAdminHandler>();
builder.Services.AddAuthorization();
        
builder.Services.AddAuthorizationBuilder()
    .AddPolicy("SuperAdminOnly", policy => policy.RequireRole("superadmin"))
    .AddPolicy("CanManageUsers", policy => policy.RequireRole("superadmin","admin"))
    .AddPolicy("SameUserOrAdmin", policy => policy.Requirements.Add(new SameUserOrAdminRequirement()))
    .AddPolicy("CanViewBusinesses", policy => policy.RequireRole("superadmin","admin"))
    .AddPolicy("CanManageStores", policy => policy.RequireRole("superadmin","admin"))
    .AddPolicy("CanViewCommerce", policy => policy.RequireRole("superadmin","admin","user","onlyview"))
    .AddPolicy("CanManageCommerce", policy => policy.RequireRole("superadmin","admin","user"))
    .AddPolicy("ReadOnlyAccess", policy => policy.RequireRole("onlyview"));


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
    options.AddDefaultPolicy(
            policy =>
            {
                policy.AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowAnyOrigin();
            })
    );

var app = builder.Build();
var isPre = app.Environment.EnvironmentName == "PreProduction";

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();

        // Aplica las migraciones si hay cambios pendientes
        if ((await context.Database.GetPendingMigrationsAsync()).Any())
        {
            Console.WriteLine("Applying pending migrations...");
            await context.Database.MigrateAsync();
            Console.WriteLine("Migrations applied successfully.");
        }
        else
        {
            Console.WriteLine("No pending migrations.");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error applying migrations: {ex.Message}");
        throw;
    }
}

// Configure the HTTP request pipeline.
if (isPre || app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors();
app.UseHttpsRedirection();
app.UseMiddleware<ErrorHandlingMiddleware>();
app.UseMiddleware<CommerceManagerMiddleware>();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
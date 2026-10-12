using System.Text;
using CampusEats.Api.Services;
using CampusEats.Api.Data;
using CampusEats.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);


// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization", In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http, Scheme = "bearer",
        BearerFormat = "JWT",
        Description = "Paste ONLY the token - no 'Bearer ' prefix."
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { new OpenApiSecurityScheme { Reference = new OpenApiReference
            { Type = ReferenceType.SecurityScheme, Id = "Bearer" } },
            Array.Empty<string>() }
    });
});

builder.Services.AddScoped<IMenuService, MenuService>();

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration
        .GetConnectionString("Default")));

var jwt = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwt["Key"]!);

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt => opt.TokenValidationParameters = new()
    {
        ValidateIssuer = true, ValidIssuer = jwt["Issuer"],
        ValidateAudience = true, ValidAudience = jwt["Audience"],
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateLifetime = true
    });

builder.Services.AddAuthorization();

// CORS: allow the frontend origin (set Cors__AllowedOrigin in production)
var allowedOrigin = builder.Configuration["Cors:AllowedOrigin"] ?? "http://localhost:5173";
builder.Services.AddCors(opt => opt.AddPolicy("Frontend", p => p
    .WithOrigins(allowedOrigin)
    .AllowAnyHeader()
    .AllowAnyMethod()));

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var seed = new[]
    {
        new MenuItem { Name = "Kottu Roti", Price = 750m, Category = "Mains" },
        new MenuItem { Name = "Fried Rice", Price = 850m, Category = "Mains" },
        new MenuItem { Name = "Watalappan", Price = 350m, Category = "Dessert" },
        new MenuItem { Name = "Rice & Curry", Price = 450m, Category = "Mains" },
        new MenuItem { Name = "Chicken Biryani", Price = 950m, Category = "Mains" },
        new MenuItem { Name = "String Hoppers", Price = 400m, Category = "Mains" },
        new MenuItem { Name = "Egg Hoppers", Price = 120m, Category = "Snacks" },
        new MenuItem { Name = "Fish Bun", Price = 150m, Category = "Snacks" },
        new MenuItem { Name = "Vegetable Roti", Price = 100m, Category = "Snacks" },
        new MenuItem { Name = "Veg Sub", Price = 600m, Category = "Snacks", Available = false },
        new MenuItem { Name = "Curd & Treacle", Price = 300m, Category = "Dessert" },
        new MenuItem { Name = "Iced Milo", Price = 300m, Category = "Drinks" },
        new MenuItem { Name = "Plain Tea", Price = 80m, Category = "Drinks" },
        new MenuItem { Name = "Mango Juice", Price = 280m, Category = "Drinks" },
    };
    // add any starter dishes that aren't in the database yet (safe to run on every start)
    var existing = db.MenuItems.Select(m => m.Name).ToHashSet();
    var missing = seed.Where(m => !existing.Contains(m.Name)).ToList();
    if (missing.Count > 0)
    {
        db.MenuItems.AddRange(missing);
        db.SaveChanges();
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("Frontend");

app.UseAuthentication(); // who are you? (validates JWT)
app.UseAuthorization();  // may you? (checks roles)

app.MapControllers();

app.Run();
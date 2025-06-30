using System.Text.Json.Serialization;
using NHibernate.Cfg;
using VendinhaAPI.Repository;
using VendinhaAPI.Repository.Implementations;
using VendinhaAPI.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.ReferenceHandler =
            ReferenceHandler.IgnoreCycles;
    });
// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddTransient<ClienteService>();

var connectionString = builder.Configuration
    .GetConnectionString("Default");

builder.Services.AddSingleton(c =>
{
    var config = new Configuration().Configure();
    config.DataBaseIntegration(
        x => x.ConnectionString = connectionString
    );
    return config.BuildSessionFactory();
});
builder.Services.AddTransient<IRepository, RepositoryNHibernate>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(
    b => b.AllowAnyHeader()
        .AllowAnyMethod()
        .AllowAnyOrigin()
);

app.UseHttpsRedirection();

app.MapControllers();

app.Run();

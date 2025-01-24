using BIS.Api.Extensions;
using BIS.API.Extensions.BIS.Api.Extensions;
using BIS.API.Filters;
using BIS.API.IOC;
using BIS.DB;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace BIS.API
{
    public class Startup
    {
        readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
        public IConfiguration Configuration { get; }
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {


            IoCConfiguration.Configuration(services);
            services.AddSingleton(Configuration);
            services.AddCors(options =>
            {
                options.AddPolicy("_myAllowSpecificOrigins", builder =>
                {
                    builder.WithOrigins("http://localhost:4200")
                           .AllowAnyMethod()  
                           .AllowAnyHeader()  
                           .AllowCredentials(); 
                });
            });
            //services.AddCors(o => o.AddPolicy(MyAllowSpecificOrigins, builder =>
            //{
            //    //builder.AllowAnyOrigin()
            //    builder.WithOrigins("http://localhost:4200")
            //           .AllowAnyMethod()
            //           .AllowAnyHeader();
            //}));

            services.AddResponseCompression(options =>
            {
                options.EnableForHttps = true;
            });
            services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
            });
            services.AddDbContext<AppDBContext>(options =>
            {
                options.UseSqlServer(Configuration.GetConnectionString("BISDbConn"));
            });
            JwtTokenConfig.AddJwtTokenAuthentication(services, Configuration);
            services.AddSwaggerConfiguration();
            // Configure Newtonsoft.Json settings
            var nullValueSettings = new JsonSerializerSettings
            {
                NullValueHandling = NullValueHandling.Ignore,
                MissingMemberHandling = MissingMemberHandling.Ignore
            };

            services.AddMvc(options =>
            {
                options.Filters.Add(typeof(ValidateModelFilter));
            }).AddDataAnnotationsLocalization()
            .AddNewtonsoftJson();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwaggerSetup();

                app.UseSwagger();  // This enables the Swagger middleware
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "BIS API v1");  // Define the endpoint for Swagger UI
                    c.RoutePrefix = string.Empty; // This will make Swagger UI available at the root URL, i.e., http://localhost:port/
                });

            }

            //app.UseCors(MyAllowSpecificOrigins);
            app.UseCors("_myAllowSpecificOrigins");
            //app.UseCors();
            app.UseRouting();
            app.UseAuthentication();
            app.UseHttpsRedirection();
            app.UseAuthorization();
            app.UseResponseCompression();
            app.UseResponseCaching();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}

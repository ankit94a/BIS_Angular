using BIS.Api.Extensions;
using BIS.API.Extensions.BIS.Api.Extensions;
using BIS.API.Filters;
using BIS.API.Hubs;
using BIS.API.IOC;
using BIS.DB;
using BIS.DB.Implements;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Net.Http.Headers;
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

			services.AddScoped<UserDB>();
			services.AddScoped<NotificationDB>();
			services.AddScoped<MasterDataDB>();
			services.AddScoped<GenerateReportDB>();
			IoCConfiguration.Configuration(services);
			services.AddSingleton(Configuration);
			services.AddCors(options =>
			{
				options.AddPolicy("_myAllowSpecificOrigins", builder =>
				{
					//https://bis1.jayceetechsoftwares.com
					//http://localhost:4200
					builder.WithOrigins("http://localhost:4200")
						   .AllowAnyMethod()
						   .AllowAnyHeader()
						   .AllowCredentials();
				});
			});

			services.AddSignalR();
            services.AddHttpClient("AiModelCall", httpClient =>
            {
                httpClient.BaseAddress = new Uri("http://127.0.0.1:8000/");
                httpClient.DefaultRequestHeaders.Add(HeaderNames.Accept, "application/json");
            });

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
            //services.AddDistributedMemoryCache();
            //services.AddSession(options =>
            //{
            //    options.Cookie.Name = "BIS_User_Session";
            //    options.IdleTimeout = TimeSpan.FromMinutes(30);
            //    options.Cookie.HttpOnly = true;
            //    options.Cookie.IsEssential = true;
            //    options.Cookie.SameSite = Microsoft.AspNetCore.Http.SameSiteMode.None; 
            //    options.Cookie.SecurePolicy = CookieSecurePolicy.Always; 
            //});

            JwtTokenConfig.AddJwtTokenAuthentication(services, Configuration);
			services.AddSwaggerConfiguration();
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

				app.UseSwagger();
				app.UseSwaggerUI(c =>
				{
					c.SwaggerEndpoint("/swagger/v1/swagger.json", "BIS API v1");
					c.RoutePrefix = string.Empty;
				});

			}
            app.Use(async (context, next) =>
            {
                context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
                context.Response.Headers.Add("X-Frame-Options", "DENY");
                context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");
                context.Response.Headers.Add("Referrer-Policy", "no-referrer");
                context.Response.Headers.Add("Permissions-Policy", "geolocation=(), microphone=()");
                context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
                context.Response.Headers.Add("Content-Security-Policy", "default-src 'self'; " + "script-src 'self'; " + "img-src 'self'; " + "font-src 'self'; " + "connect-src 'self'; " + "object-src 'none'; " + "frame-ancestors 'none'; " + "form-action 'self'; " + "base-uri 'self';");

                await next();
            });
            app.UseWebSockets();
			app.UseRouting();
			app.UseCors("_myAllowSpecificOrigins");
            //app.UseSession();
            app.UseAuthentication();
			app.UseAuthorization();
			app.UseResponseCompression();
			app.UseEndpoints(endpoints =>
			{
				endpoints.MapControllers();
				endpoints.MapHub<NotificationHub>("/notificationhub");
			});
		}
	}
}

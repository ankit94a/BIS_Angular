namespace BIS.API.Extensions
{

	using global::BIS.Api.Authorization;
	using InSync.Common.Helpers;
	using Microsoft.AspNetCore.Authentication.JwtBearer;
	using Microsoft.AspNetCore.Http;
	using Microsoft.Extensions.Configuration;
	using Microsoft.Extensions.DependencyInjection;
	using Microsoft.IdentityModel.Tokens;
	using Newtonsoft.Json;
	using System;
	using System.Text;

	namespace BIS.Api.Extensions
	{
		public static class JwtTokenConfig
		{
			public static void AddJwtTokenAuthentication(IServiceCollection services, IConfiguration configuration)
			{
				services.Configure<JwtConfig>(configuration.GetSection("JWTSettings"));
				services.AddAuthentication(x =>
				{
					x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
					x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
					x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
				})
										.AddJwtBearer(x =>
										{
											x.TokenValidationParameters = new TokenValidationParameters()
											{
												ValidateIssuerSigningKey = true,
												IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWTSettings:Key"])),
												ValidateIssuer = true,
												ValidateAudience = true,
												ValidateLifetime = true,
												ValidIssuer = configuration["JWTSettings:Issuer"],
												ValidAudience = configuration["JWTSettings:Audience"],
												ClockSkew = TimeSpan.Zero,
											};
											x.RequireHttpsMetadata = false;
											x.SaveToken = false;
											x.Events = new JwtBearerEvents()
											{
												OnMessageReceived = context =>
												{
													var accessToken = context.Request.Query["access_token"];
													var path = context.HttpContext.Request.Path;
													if (!string.IsNullOrEmpty(accessToken) && !string.IsNullOrEmpty(path) &&
														path.ToString().Contains("notificationhub"))
													{
														context.Token = accessToken;
													}
													return Task.CompletedTask;
												},
												OnAuthenticationFailed = context =>
												{
													context.Response.StatusCode = 401;
													context.Response.ContentType = "application/json";
													return context.Response.WriteAsync("You are not Authorized");
												},
												OnChallenge = context =>
												{
													if (!context.Response.HasStarted)
													{
														context.Response.StatusCode = 401;
														context.Response.ContentType = "application/json";
														context.HandleResponse();
														return context.Response.WriteAsync("You are not Authorized");
													}
													else
													{
														return context.Response.WriteAsync("Token Expired");
													}
												},
												OnForbidden = context =>
												{
													context.Response.StatusCode = 403;
													context.Response.ContentType = "application/json";
													return context.Response.WriteAsync("You are not authorized to access this resource");
												},
											};
										});

			}
		}
	}
}

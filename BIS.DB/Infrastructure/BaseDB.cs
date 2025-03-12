using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Data;

public class BaseDB
{
	protected SqlConnection connection;
	protected JsonSerializerSettings nullValueSettings;

	public BaseDB(IConfiguration configuration)
	{
		// Get connection string using GetConnectionString
		var connectionString = configuration.GetConnectionString("BISDbConn");

		if (string.IsNullOrWhiteSpace(connectionString))
			throw new ArgumentNullException(nameof(connectionString), "Connection string not found or null");

		connection = new SqlConnection(connectionString);

		nullValueSettings = new JsonSerializerSettings
		{
			NullValueHandling = NullValueHandling.Ignore,
			MissingMemberHandling = MissingMemberHandling.Ignore
		};
	}
}

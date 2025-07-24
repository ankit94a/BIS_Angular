using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using BIS.Common.Entities;
using BIS.DB.Interfaces;
using static BIS.Common.Enum.Enum;

namespace BIS.DB.Implements
{
	public class UserManager : IUserManager
	{
		private readonly IUserDB _userDB;
        private readonly IHttpClientFactory _httpClientFactory;
        public UserManager(IUserDB userDB, IHttpClientFactory httpClientFactory)
        {
            _userDB = userDB;
            _httpClientFactory = httpClientFactory;
        }

        public UserDetail GetUserByEmailPassword(string email, string password)
		{
			return _userDB.GetUserByEmailPassword(email, password);
		}
		public List<Menus> GetMenuByRoleCorpsAndDivision(long corpsId, long divisionId, long roleId, RoleType roleType)
		{
			if (roleType == RoleType.StaffEc || roleType == RoleType.G1IntEc || roleType == RoleType.ColIntEc || roleType == RoleType.BrigInt || roleType == RoleType.MggsEc || roleType == RoleType.GocEc)
			{
				corpsId = 1;
			}
			return _userDB.GetMenuByRoleCorpsAndDivision(corpsId, divisionId, roleId, roleType);
		}
		public List<UserDetail> GetUserByCoprs(long corpsId)
		{
			return _userDB.GetUserByCoprs(corpsId);
		}
		public long AddUser(UserDetail user)
		{
			return _userDB.AddUser(user);
		}
		public bool UpdatePassword(UserDetail user)
		{
			return _userDB.UpdatePassword(user);
		}
		public List<UserDetail> GetAllUsers()
		{
			return _userDB.GetAllUsers();

		}
        public async Task<List<PredictionResponse>> GetAnomalies(PredictionModel requestModel)
		{
            var httpClient = _httpClientFactory.CreateClient("AiModelCall");

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            var jsonContent = JsonSerializer.Serialize(requestModel, options);
            var httpContent = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            var httpResponse = await httpClient.PostAsync(requestModel.UrlPath, httpContent);

            if (httpResponse.IsSuccessStatusCode)
            {
                var responseContent = await httpResponse.Content.ReadAsStringAsync();




                var doc = JsonDocument.Parse(responseContent);
                var root = doc.RootElement;
                var results = new List<PredictionResponse>();

                foreach (var item in root.EnumerateArray())
                {
                    var prediction = new PredictionResponse
                    {
                        Date = item.GetProperty("date").GetDateTime(),
                        Observed = item.GetProperty("observed").GetSingle(),
                        IsAnomaly = item.GetProperty("isAnomaly").GetBoolean(),
                        Residual = item.GetProperty("residual").ValueKind == JsonValueKind.Null
                                   ? (float?)null
                                   : item.GetProperty("residual").GetSingle(),
                        Predicted = item.GetProperty("predicted").ValueKind == JsonValueKind.Null
                                   ? (float?)null
                                   : item.GetProperty("predicted").GetSingle(),
                        Count = item.GetProperty("count").ValueKind == JsonValueKind.Null
                                   ? (string?)null
                                   : item.GetProperty("count").GetString(),
                        Title = item.GetProperty("title").GetString()
                    };

                    results.Add(prediction);
                }

                return results;

            }
            else
            {
                throw new HttpRequestException($"Request failed with status code {httpResponse.StatusCode}");
            }

        }

    }
}

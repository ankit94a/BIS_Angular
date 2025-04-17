using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;
using BIS.DB.Implements;
using BIS.DB.Interfaces;
using BIS.Manager.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using static BIS.Common.Enum.Enum;

namespace BIS.Manager.Implements
{
	public class MasterDataManager : IMasterDataManager
	{
		private IMasterDataDB _masterDataDB;
		private readonly IUserDB _userDB;
		private readonly INotificationDB _notificationDB;
		private readonly IServiceScopeFactory _serviceScopeFactory;
		public MasterDataManager(IMasterDataDB masterDataDB, IUserDB userDB, INotificationDB notificationDB, IServiceScopeFactory serviceScopeFactory)
		{
			_masterDataDB = masterDataDB;
			_userDB = userDB;
			_notificationDB = notificationDB;
			_serviceScopeFactory = serviceScopeFactory;
		}
		public List<MasterData> GetAll(int corpsId, int divisionId)
		{
			return _masterDataDB.GetAll(corpsId, divisionId);
		}
		public async Task<List<MasterData>> GetAllMasterData(int corpsId, RoleType roleType, int divisionId = 0)
		{
			var masterDataList = new List<MasterData>();
			if (roleType == RoleType.SuperAdmin)
			{

			}
			else if (roleType == RoleType.Admin)
			{

			}
			else
			{

				foreach (var item in Enum.GetValues(typeof(RoleType)).Cast<RoleType>().OrderByDescending(e => (int)e))
				{
					if ((int)item <= (int)roleType)
					{
						var userId = await _userDB.GetUserIdByRoleType(item, corpsId, divisionId);
						// checking that user fill any masterdata or not
						if (userId > 0)
						{
							var dataList = _masterDataDB.GetByUserId(userId);
							masterDataList.AddRange(dataList);
						}
					}
				}
			}
			return masterDataList;
		}
		public List<MasterData> GetByIds(string idsList)
		{
			if (idsList.Length > 2)
			{
				var idsArray = idsList.Trim('[', ']').Split(',').Select(id => int.Parse(id)).ToList();
				return _masterDataDB.GetByIds(idsArray);
			}
			return new List<MasterData>();
		}

		public List<MasterData> GetBetweenDateRange(FilterModelEntries model, int corpsId, int divisionId = 0)
		{
			// for division roles

			return _masterDataDB.GetBetweenDateRange(model, corpsId, divisionId);


		}
		public List<MasterSector> GetSectorByCorpsId(int corpsId)
		{
			return _masterDataDB.GetSectorByCorpsId(corpsId);
		}
		public List<MasterInputLevel> GetInputLevels()
		{
			return _masterDataDB.GetInputLevels();
		}
		public List<Source> GetSources()
		{
			return _masterDataDB.GetSources();
		}
		public bool AddSource(Source s)
		{
			return _masterDataDB.AddSource(s);
		}
		public List<MasterLocation> GetLocation(bool isSourceLoc = true)
		{
			return _masterDataDB.GetLocation(isSourceLoc);
		}
		public bool AddLocation(MasterLocation location)
		{
			return _masterDataDB.AddLocation(location);
		}
		public List<EnemyLocation> GetAllEnemyLocation()
		{
			return _masterDataDB.GetAllEnemyLocation();
		}
		public bool AddEnemyLocation(EnemyLocation enemyLocation)
		{
			return _masterDataDB.AddEnemyLocation(enemyLocation);
		}
		public bool Deactive(long Id, string table)
		{
			return _masterDataDB.Deactive(Id, table);
		}
		public long AddMasterData(MasterData masterData, RoleType roleType)
		{
			masterData.Status = Status.Created;
			masterData.CreatedOn = DateTime.Now;

			var id = _masterDataDB.Add(masterData);

			if (id > 0)
			{
				Task.Run(async () =>
				{
					await Task.Delay(TimeSpan.FromMinutes(10));

					var notification = new Notification
					{
						SenderId = masterData.CreatedBy,
						SenderEntityType = roleType,
						CreatedBy = masterData.CreatedBy,
						CreatedOn = DateTime.Now,
						CorpsId = masterData.CorpsId,
						DivisionId = masterData.DivisionId,
						DataId = Convert.ToInt32(id),
						NotificationType = NotificationType.MasterData,
						Title = "Master Form Submitted",
						Content = $"Input filled by {roleType}. Please review and respond!"
					};

					using (var scope = _serviceScopeFactory.CreateScope())
					{
						var userDB = scope.ServiceProvider.GetRequiredService<UserDB>();
						var notificationDB = scope.ServiceProvider.GetRequiredService<NotificationDB>();

						foreach (var item in Enum.GetValues(typeof(RoleType)).Cast<RoleType>().OrderByDescending(e => (int)e))
						{
							if ((int)item == (int)roleType + 1)
							{
								notification.ReceiverId = await userDB.GetUserIdByRoleType(item, masterData.CorpsId, masterData.DivisionId);
								notification.ReceiverEntityType = item;
								await notificationDB.AddNotification(notification);
							}
						}
						var masterDB = scope.ServiceProvider.GetRequiredService<MasterDataDB>();
						await masterDB.UpdateStatus(masterData.ID, Status.Progress);
					}
				});
			}
			return id;
		}
		public long Add(MasterData masterData)
		{
			throw new NotImplementedException();
		}
		public long Update(MasterData masterData)
		{
			masterData.UpdatedOn = DateTime.Now;
			return _masterDataDB.Update(masterData);
		}
		public MasterData GetBy(int Id, int CorpsId)
		{
			return _masterDataDB.GetBy(Id, CorpsId);
		}

		// ansh smart-analysis
		public async Task<(List<List<int>> Id, List<string> Labels, List<double> Data, List<double> Data2, List<string> Alerts, List<List<string>> FrmnsList, List<List<string>> SectorsList, List<List<string>> AspectsList, List<List<string>> IndicatorsList)> GetDailyAverageEntriesAsync(string frmn = null, string sector = null, string Aspects = null, string Indicator = null, DateTime? filterStartDate = null, DateTime? filterEndDate = null, int? Id = null)
		{
			return await _masterDataDB.GetDailyAverageEntriesAsync(frmn, sector, Aspects, Indicator, filterStartDate, filterEndDate, Id);
		}

	}
}

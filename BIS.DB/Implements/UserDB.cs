using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;
using BIS.Common.Helpers;
using BIS.DB.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using static BIS.Common.Enum.Enum;

namespace BIS.DB.Implements
{
	public class UserDB : IUserDB
	{
		private readonly AppDBContext dbContext;
		private readonly IServiceProvider _serviceProvider;
		public UserDB(AppDBContext dbContext, IServiceProvider serviceProvider)
		{
			this.dbContext = dbContext;
			_serviceProvider = serviceProvider;
		}
		public UserDetail GetUserByEmailPassword(string username, string password)
		{
			try
			{
				var user = dbContext.UserDetails.Where(us => us.Username == username && us.Password == password).FirstOrDefault();
				return user;
			}
			catch (Exception ex)
			{
				BISLogger.Error(ex, "User Loggin error in method GetUserByEmailPassword");
				throw;
			}
		}
		public List<Menus> GetMenuByRoleCorpsAndDivision(long corpsId, long divisionId, long roleId, RoleType roleType)
		{
			try
			{
				var query = dbContext.UserMenus.AsQueryable();

					query = query.Where(m => m.CorpsId == corpsId && m.DivisionId == divisionId && m.RoleId == roleId).OrderBy(t => t.Id);
				
				var result = query.ToList();
				return result;
			}
			catch (Exception ex)
			{
				BISLogger.Error(ex, "UserMenu loading error in method GetMenuByRoleCorpsAndDivision");
				throw;
			}
		}
		//public async Task<int> GetUserIdByRoleType(RoleType roleType, int corpsId, int? divisionId = 0)
		//{
		//	try
		//	{
		//		var query = dbContext.UserDetails.Where(us => us.RoleType == roleType && corpsId == corpsId && us.DivisionId == divisionId);

		//		var user = await query.FirstOrDefaultAsync();

		//		return user?.Id ?? 0;
		//	}
		//	catch (Exception ex)
		//	{
		//		BISLogger.Error(ex, "Getting user list error in for CorpsId = ");
		//		throw;
		//	}

		//}
		public async Task<int> GetUserIdByRoleType(RoleType roleType, int corpsId, int? divisionId = 0)
		{
			try
			{
				// Create a scope for the background task
				using (var scope = _serviceProvider.CreateScope())
				{
					var dbContext = scope.ServiceProvider.GetRequiredService<AppDBContext>();

					var query = dbContext.UserDetails
						.Where(us => us.RoleType == roleType && us.CorpsId == corpsId && us.DivisionId == divisionId);

					var user = await query.FirstOrDefaultAsync();
					return user?.Id ?? 0;
				}
			}
			catch (Exception ex)
			{
				BISLogger.Error(ex, $"Getting user list error for CorpsId = {corpsId}, DivisionId = {divisionId}");
				throw;
			}
		}


		public List<UserDetail> GetUserByCoprs(long corpsId)
		{
			try
			{
				return dbContext.UserDetails.Where(us => us.CorpsId == corpsId).ToList();
			}
			catch (Exception ex)
			{
				BISLogger.Error(ex, "Getting user list error in for CorpsId = " + corpsId);
				throw;
			}
		}
		public List<UserDetail> GetAllUsers()
		{
			try
			{
				return dbContext.UserDetails.Where(us => us.IsActive).ToList();
			}
			catch (Exception ex)
			{
				throw;
			}
		}
		public long AddUser(UserDetail user)
		{
			try
			{
				BISLogger.Info("Adding user for corpsId = " + user.CorpsId + "and DivisionId = " + user.DivisionId, "UserController", "AddUser");
				dbContext.Add(user);
				dbContext.SaveChanges();
				return user.Id;
			}
			catch (Exception ex)
			{
				BISLogger.Error(ex, "Adding user error for CorpsId = " + user.CorpsId);
				throw;
			}
		}
	}
}

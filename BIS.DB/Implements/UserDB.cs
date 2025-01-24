using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;
using BIS.Common.Helpers;
using BIS.DB.Interfaces;
using Microsoft.Extensions.Logging;
using static BIS.Common.Enum.Enum;

namespace BIS.DB.Implements
{
    public class UserDB : IUserDB
    {
        private readonly AppDBContext dbContext;
        public UserDB(AppDBContext dbContext) 
        { 
            this.dbContext = dbContext;
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

                if (roleType == RoleType.SuperAdmin || roleType == RoleType.Admin)
                {
                    query = query.Where(m => m.RoleId == 10); 
                }
                else
                {
                    query = query.Where(m => m.CorpsId == corpsId && m.DivisionId == divisionId && m.RoleId == roleId);
                }
                var result = query.ToList();
                return result;
            }
            catch (Exception ex)
            {
                BISLogger.Error(ex, "UserMenu loading error in method GetMenuByRoleCorpsAndDivision");
                throw;
            }            
        }
        public int GetUserIdByRoleType(RoleType roleType)
        {
            try
            {
                var user = dbContext.UserDetails.Where(us => us.RoleType == roleType).FirstOrDefault();
                return user?.Id ?? 0;
            }
            catch (Exception ex)
            {
                BISLogger.Error(ex, "Getting user list error in for CorpsId = " );
                throw;
            }
            
        }
        public List<UserDetail> GetUserByCoprs(long corpsId)
        {
            try
            {
                return dbContext.UserDetails.Where(us => us.CorpsId == corpsId).ToList();
            }
            catch(Exception ex)
            {
                BISLogger.Error(ex, "Getting user list error in for CorpsId = " + corpsId);
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

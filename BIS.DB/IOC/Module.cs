using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;
using BIS.DB.Implements;
using BIS.DB.Interfaces;

namespace BIS.DB.IOC
{
    public static class Module
    {
        public static Dictionary<Type, Type> GetTypes()
        {
            var dic = new Dictionary<Type, Type>
            {
                {typeof(IMasterDataDB), typeof(MasterDataDB) },
                {typeof(IUserDB), typeof(UserDB) },
                {typeof(ICorpsDB), typeof(CorpsDB) },
                {typeof(IRoleDB), typeof(RoleDB) },
                {typeof(IGenerateReportDB), typeof(GenerateReportDB)},
                {typeof(ISmartAnalysisDB), typeof(SmartAnalysisDB)},
                {typeof(IDashboardDB), typeof(DashboardDB)},
                {typeof(ICdrDashboardDB), typeof(CdrDashboardDB)},
                {typeof(IAttributeDB), typeof(AttibuteDB) },
                {typeof(INotificationDB), typeof(NotificationDB) },
            };
            return dic;
        }
    }
}

using BIS.Api.Authorization;
using InSync.Api.Authorization;

namespace BIS.API.IOC
{
    public class IoCConfiguration
    {
        public static void Configuration(IServiceCollection services)
        {
            Configure(services, BIS.Manager.IOC.Module.GetTypes());
            Configure(services, BIS.DB.IOC.Module.GetTypes());
            services.AddScoped(typeof(IJwtManager), typeof(JwtManager));
        }

        private static void Configure(IServiceCollection services, Dictionary<Type, Type> types)
        {
            foreach (var type in types)
            {
                services.AddScoped(type.Key, type.Value);
            }
        }
    }
}

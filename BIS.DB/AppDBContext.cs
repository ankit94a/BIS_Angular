using BIS.Common.Entities;
using Microsoft.EntityFrameworkCore;

namespace BIS.DB

{
    public class AppDBContext : DbContext
    {
        public AppDBContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<Corps> Corps { get; set; }
        public DbSet<Divisons> Divisions { get; set; }
        public DbSet<MasterData> MasterDatas { get; set; }
        public DbSet<UserDetail> UserDetails { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Menus> UserMenus { get; set; }
        public DbSet<GenerateReport> GenerateReports { get; set; }
        public DbSet<Aspect> Aspect { get; set; }
        public DbSet<Indicator> Indicator { get; set; }
        public DbSet<IndicatorSubFields> IndicatorSubField { get; set; }
        public DbSet<MasterSector> Sector { get; set; }
        public DbSet<MasterInputLevel> MasterInputLevels { get; set; }
        public DbSet<Source> MasterSources { get; set; }
        public DbSet<MasterLocation> MasterLocations { get; set; }
        public DbSet<EnemyLocation> MasterEnLocName { get; set; }
        public DbSet<Notification> Notification { get; set; }
        public DbSet<GraphImages> GraphImages { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BIS.Common.Entities
{
    public class GenerateReport : BaseEntity
    {
        public string? ReportType { get; set; }
        public string? ReportDate { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
        public string? ReportTitle { get; set; }
        public string? UserId { get; set; }
        public string? Notes { get; set; }
        public string? startDate { get; set; }
        public string? endDate { get; set; }
        public string? MasterDataIds { get; set; }
        [NotMapped]
        public List<GraphImages>? Graphs { get; set; }
        public string? GraphIds { get; set; }

        //public List<MasterData>? MasterData { get; set; }
        // This property handles serialization/deserialization
        //[NotMapped]
        //public List<string>? MasterDataIds
        //{
        //    get => string.IsNullOrEmpty(MasterDataIdsSerialized)
        //        ? new List<string>()
        //        : MasterDataIdsSerialized.Split(',').ToList();
        //    set => MasterDataIdsSerialized = value == null
        //        ? null
        //        : string.Join(',', value);
        //}
    }
    public class GraphImages : BaseEntity
    {
        public string? Name { get; set; }
        public string? Url { get; set; }
    }
}

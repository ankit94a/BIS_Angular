using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BIS.Common.Entities
{
    using System.Text.Json.Serialization;

    public class PredictionModel
    {
        [JsonPropertyName("frmn")]
        public List<string> frmn { get; set; }

        [JsonPropertyName("aspect")]
        public List<string> Aspect { get; set; }

        [JsonPropertyName("indicator")]
        public List<string> Indicator { get; set; }

        [JsonPropertyName("sector")]
        public List<string> Sector { get; set; }

        [JsonPropertyName("startdate")]
        public DateTime StartDate { get; set; }

        [JsonPropertyName("enddate")]
        public DateTime EndDate { get; set; }

        [JsonPropertyName("granularity")]
        public string Granularity { get; set; }

        [JsonPropertyName("urlpath")]
        public string UrlPath { get; set; }

        [JsonPropertyName("isfutureprediction")]
        public bool IsFuturePrediction { get; set; }
    }


    public class PredictionResponse
    {
        public string Title { get; set; }
        public DateTime Date { get; set; }
        public float Observed { get; set; }
        public float? Residual { get; set; }
        public float? Predicted { get; set; }
        public bool IsAnomaly { get; set; }
        public string? Count { get; set; }
    }
}

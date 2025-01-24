using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InSync.Api.Helpers
{
    public class AppSettings
    {
        public string Secret { get;  set; }
        public string ValidIssuer { get;  set; }
        public string ValidAudience { get;  set; }
    }
}

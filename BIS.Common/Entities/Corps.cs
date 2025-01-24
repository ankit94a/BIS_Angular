using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BIS.Common.Entities
{
    public class Corps : CommonModel
    {
        public string Name { get; set; }

    }
    public class Divisons : CommonModel
    {
        public int CorpsId { get; set; }
        public string Name { get; set; }
    }
}

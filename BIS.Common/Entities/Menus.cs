using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BIS.Common.Entities
{
    public class Menus : BaseEntity
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public bool Status { get; set; }
        public string Icon { get; set; }
        public int? RoleId { get; set; }
        
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BIS.Common.Entities
{
    public class Role : BaseEntity
    {
        public string RoleName { get; set; }
        public string RoleDescription { get; set; }

    }
}

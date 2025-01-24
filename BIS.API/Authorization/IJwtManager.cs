using BIS.Common.Entities;
using BIS.Common.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BIS.Api.Authorization
{
  public  interface IJwtManager
    {
        string GenerateJwtToken(UserDetail user);
    }
}

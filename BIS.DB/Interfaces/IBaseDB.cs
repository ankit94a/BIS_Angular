using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BIS.DB.Interfaces
{
    public interface IBaseDB<T>
    {
        List<T> GetAll(long CorpsId,long DivisonId);
        long Update(T obj);
        long Add(T obj);
        T GetBy(long Id, long CorpsId);
        //bool Deactivate(long Id, long CorpsId, long UserId);

    }
}

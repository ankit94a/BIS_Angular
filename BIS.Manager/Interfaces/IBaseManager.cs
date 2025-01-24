using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BIS.Manager.Interfaces
{
    public interface IBaseManager<T>
    {
        List<T> GetAll(int CorpsId, int DivisionId);
        long Update(T obj);
        long Add(T obj);
        T GetBy(int Id, int CorpsId);
        //bool Deactivate(long Id, long CorpsId, long UserId);

    }
}

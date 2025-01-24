using BIS.Common.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BIS.DB.Interfaces
{
    public interface IAttributeDB
    {
        public List<Aspect> GetAllAspect();
        public List<Indicator> GetIndicatorByAspect(int aspectId);
        public List<IndicatorSubFields> GetIndicatorSubField(int indicatorId);
    }
}
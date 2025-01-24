using BIS.Common.Entities;
using BIS.Manager.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.DB.Interfaces;
using BIS.Manager.Interfaces;
using BIS.DB.Implements;

namespace BIS.Manager.Implements
{
    public class AttributeManager : IAttributeManager
    {
        private readonly IAttributeDB _attributeDB;
        public AttributeManager(IAttributeDB attributeDB)
        {
            _attributeDB = attributeDB;
        }

        public List<Aspect> GetAllAspect()
        {
            return _attributeDB.GetAllAspect();
        }

        public List<Indicator> GetIndicatorByAspect(int aspectId)
        {
            return _attributeDB.GetIndicatorByAspect(aspectId);
        }

        public List<IndicatorSubFields> GetIndicatorSubfield(int indicatortId)
        {
            return _attributeDB.GetIndicatorSubField(indicatortId);
        }
    }
}
using BIS.Common.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BIS.Manager.Interfaces
{
	public interface IAttributeManager
	{
		public List<Aspect> GetAllAspect();
		public List<Indicator> GetIndicatorByAspect(int aspectId);
		public List<Indicator> GetIndicators(List<Aspect> aspect);
		public List<IndicatorSubFields> GetIndicatorSubfield(int indicatortId);
		public List<MasterSector> GetSectorByCorpsId(int corpsId);
		public bool AddAspect(Aspect aspect);
		public bool AddIndicator(Indicator indicator);
	}
}
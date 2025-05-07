using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BIS.Common.Entities;
using BIS.DB.Interfaces;
using Microsoft.EntityFrameworkCore;
using static BIS.Common.Enum.Enum;

namespace BIS.DB.Implements
{
	public class GenerateReportDB : IGenerateReportDB, IBaseDB<GenerateReport>
	{
		private readonly AppDBContext _dbContext;
		public GenerateReportDB(AppDBContext dbContext)
		{
			_dbContext = dbContext;
		}
		public List<GenerateReport> GetReportByUser(long corpsId, long divisionId, int userId)
		{
			var result = _dbContext.GenerateReports.Where(report => report.CreatedBy == userId).ToList();
			return result;
		}
		public List<GenerateReport> GetPreviousUserReport(int userId)
		{
			var result = _dbContext.GenerateReports.Where(report => report.CreatedBy == userId).ToList();
			return new List<GenerateReport>();
		}

		public List<GenerateReport> GetAll(long corpsId, long divisionId)
		{
			return _dbContext.GenerateReports.Where(r => r.CorpsId == corpsId && r.DivisionId == divisionId).ToList();
		}
		public string AddGraphs(List<GraphImages> graphs)
		{
			// Add the list of GraphImages to the context
			_dbContext.GraphImages.AddRange(graphs);
			_dbContext.SaveChanges();

			// Get the IDs of the newly added GraphImages
			var ids = graphs.Select(g => g.Id).ToList();

			// Return the IDs as a string formatted like '[4,45,76]'
			return $"[{string.Join(",", ids)}]";
		}

		public long Add(GenerateReport report)
		{
			_dbContext.GenerateReports.Add(report);
			_dbContext.SaveChanges();
			return report.Id;
		}
		public List<GenerateReport> GetAllReports(List<int> idsList)
		{
			var result = _dbContext.GenerateReports.Where(m => idsList.Contains(m.Id)).ToList();
			return result;
		}
		public GenerateReport GetById(int id, int corpsId, int divisionId = 0)
		{
			var query = _dbContext.GenerateReports.Where(re => re.Id == id && re.CorpsId == corpsId);

			if (divisionId > 0)
			{
				query = query.Where(re => re.DivisionId == divisionId);
			}

			return query.FirstOrDefault();
		}
		public List<GraphImages> GetGraphs(List<int> idsList)
		{
			var result = _dbContext.GraphImages.Where(m => idsList.Contains(m.Id)).ToList();
			return result;
		}
		public long Update(GenerateReport report)
		{
			throw new NotImplementedException();
		}
		public GenerateReport GetBy(long Id, long CorpsId)
		{
			throw new NotImplementedException();
		}

		public Tuple<int, int?> GetUserIdAndRptId(int reportId)
		{
			try
			{
				var query = _dbContext.GenerateReports.Where(ap => ap.Id == reportId).FirstOrDefault();
				return new Tuple<int, int?>(query.CreatedBy, query.RptId);
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
				throw ex;
			}
		}
		public async Task<long> UpdateStatus(int id, Status status)
		{
			try
			{
				var result = _dbContext.GenerateReports.Where(ap => ap.Id == id).FirstOrDefault();
				if (result != null)
				{
					result.Status = status;
					_dbContext.SaveChanges();
				}

				return result?.Id ?? 0;
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
				throw ex;
			}
		}
	}
}

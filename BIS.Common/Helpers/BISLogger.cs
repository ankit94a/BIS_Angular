using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;
using NLog;
using NLog.Web;

namespace BIS.Common.Helpers
{
    public class BISLogger
    {
        private static Logger _logger = NLogBuilder.ConfigureNLog($"nlog.config").GetCurrentClassLogger();

        public static void Info(string message, string componentName, string methodName)
        {
            _logger.Info(FormatLogEntry(message, componentName, methodName));
        }
        public static void Warn(string message, string componentName, string methodName)
        {
            _logger.Warn(FormatLogEntry(message, componentName, methodName));
        }
        public static void Error(System.Exception ex, string message = null)
        {
            _logger.Error(ex, message);
        }
        private static string FormatLogEntry(
                     string message,
                     string componentName, string methodName)
        {
            StringBuilder logEntry = new StringBuilder();
            logEntry.AppendFormat("ClassName={0} ", componentName);
            logEntry.AppendFormat("Method={0} ", methodName);
            logEntry.AppendFormat("Message={0}", message);
            logEntry.AppendLine();
            return logEntry.ToString();
        }
    }
}

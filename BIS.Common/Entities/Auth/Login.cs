using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BIS.Common.Entities.Auth
{
    public class Login
    {
        [Required]

        public string UserName { get; set; }
        [Required]
        public string Password { get; set; }
        public string Code { get; set; }
        public string Token { get; set; }
    }
    public class BlockStatus
    {
        public bool IsBlocked { get; set; }
        public TimeSpan? RemainingTime { get; set; }
    }
    public static class CaptchaStore
    {
        public static Dictionary<string, string> Captchas = new();
    }
}

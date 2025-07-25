using BIS.Common.Entities.Auth;
using Microsoft.Extensions.Caching.Memory;

namespace BIS.API.Helpers
{
    public class LoginAttempt
    {
        private readonly IMemoryCache _cache;
        private readonly int _maxAttempts = 3;
        private readonly TimeSpan _blockDuration = TimeSpan.FromMinutes(15);

        public LoginAttempt(IMemoryCache cache)
        {
            _cache = cache;
        }

        public BlockStatus IsBlocked(string ip)
        {
            var blockKey = $"{ip}_blocked";
            if (_cache.TryGetValue(blockKey, out DateTime expiry))
            {
                var remaining = expiry - DateTime.UtcNow;
                if (remaining > TimeSpan.Zero)
                {
                    return new BlockStatus { IsBlocked = true, RemainingTime = remaining };
                }
                _cache.Remove(blockKey);
            }
            return new BlockStatus { IsBlocked = false, RemainingTime = null };
        }

        public void RecordFailedAttempt(string ip)
        {
            var key = $"{ip}_attempts";
            int attempts = 0;

            if (_cache.TryGetValue(key, out int currentAttempts))
            {
                attempts = currentAttempts;
            }

            attempts++;
            _cache.Set(key, attempts, TimeSpan.FromMinutes(15));

            if (attempts >= _maxAttempts)
            {
                var blockKey = $"{ip}_blocked";
                var expiry = DateTime.UtcNow.Add(_blockDuration);

                _cache.Set(blockKey, expiry, _blockDuration);
            }
        }

        public void ResetAttempts(string ip)
        {
            _cache.Remove($"{ip}_attempts");
            _cache.Remove($"{ip}_blocked");
        }
    }
}
